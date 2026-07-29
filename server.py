from __future__ import annotations

import argparse
import html
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8088
MAX_BODY = 64 * 1024
MAX_REMOTE_BODY = 2 * 1024 * 1024
AMAP_HOST_SUFFIXES = ("amap.com", "autonavi.com", "gaode.com")
URL_PATTERN = re.compile(r"https?://[^\s<>'\"，。；]+", re.I)
COORDINATE_PATTERN = re.compile(
    r"(?:position|location|q|center|geo)\s*[=:]\s*"
    r"(?P<lng>1(?:0\d|1\d|2\d|3[0-5])(?:\.\d+)?)\s*[,，]\s*"
    r"(?P<lat>[1-5]?\d(?:\.\d+)?)",
    re.I,
)


def is_amap_url(value: str) -> bool:
    try:
        host = (urllib.parse.urlparse(value).hostname or "").lower()
    except ValueError:
        return False
    return any(host == suffix or host.endswith(f".{suffix}") for suffix in AMAP_HOST_SUFFIXES)


class AmapOnlyRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        absolute = urllib.parse.urljoin(req.full_url, newurl)
        if not is_amap_url(absolute):
            raise urllib.error.URLError("高德链接跳转到了非高德域名，已停止解析")
        return super().redirect_request(req, fp, code, msg, headers, absolute)


def decode_repeatedly(value: str, rounds: int = 3) -> str:
    result = html.unescape(value or "")
    for _ in range(rounds):
        decoded = urllib.parse.unquote(result)
        if decoded == result:
            break
        result = decoded
    return result


def coordinates_from_text(value: str):
    decoded = decode_repeatedly(value)
    match = COORDINATE_PATTERN.search(decoded)
    if not match:
        amap_p = re.search(
            r"(?:[?&]p=|(?:^|\s)p\s*[=:])[^,&#\s]*,"
            r"(?P<lat>[1-5]?\d(?:\.\d+)?)\s*[,，]\s*"
            r"(?P<lng>1(?:0\d|1\d|2\d|3[0-5])(?:\.\d+)?)",
            decoded,
            re.I,
        )
        match = amap_p
    if not match:
        pair = re.search(
            r"(?<!\d)(?P<lng>1(?:0\d|1\d|2\d|3[0-5])\.\d{3,})\s*[,，]\s*"
            r"(?P<lat>[1-5]?\d\.\d{3,})(?!\d)",
            decoded,
        )
        match = pair
    if not match:
        return None
    lng = float(match.group("lng"))
    lat = float(match.group("lat"))
    if not (73 <= lng <= 136 and 3 <= lat <= 54):
        return None
    return {"lng": lng, "lat": lat}


def query_details(value: str):
    details = {"name": "", "address": ""}
    try:
        parsed = urllib.parse.urlparse(value)
        query = urllib.parse.parse_qs(parsed.query)
    except ValueError:
        return details
    name_keys = ("name", "poiname", "dname", "sname")
    address_keys = ("address", "addr", "daddress")
    for key in name_keys:
        if query.get(key):
            details["name"] = decode_repeatedly(query[key][0]).strip()
            break
    for key in address_keys:
        if query.get(key):
            details["address"] = decode_repeatedly(query[key][0]).strip()
            break
    if query.get("p"):
        parts = [decode_repeatedly(part).strip() for part in query["p"][0].split(",")]
        if len(parts) >= 4 and not details["name"]:
            details["name"] = parts[3]
        if len(parts) >= 5 and not details["address"]:
            details["address"] = parts[4]
    return details


def extract_redirect_from_html(body: str, base_url: str):
    patterns = [
        r'<meta[^>]+http-equiv=["\']?refresh["\']?[^>]+content=["\'][^"\']*url=([^"\']+)',
        r'(?:location\.href|location\.replace)\s*(?:=|\()\s*["\']([^"\']+)',
        r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, body, re.I)
        if not match:
            continue
        candidate = html.unescape(match.group(1).strip())
        if candidate.endswith("amapexchange="):
            continue
        absolute = urllib.parse.urljoin(base_url, candidate)
        if is_amap_url(absolute):
            return absolute
    return ""


def fetch_amap_url(value: str):
    if not is_amap_url(value):
        raise ValueError("仅支持高德地图、AutoNavi 或高德相关分享域名")
    opener = urllib.request.build_opener(AmapOnlyRedirect())
    request = urllib.request.Request(
        value,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )
    with opener.open(request, timeout=10) as response:
        final_url = response.geturl()
        if not is_amap_url(final_url):
            raise ValueError("高德链接最终跳转到了不受信任的域名")
        raw = response.read(MAX_REMOTE_BODY)
        charset = response.headers.get_content_charset() or "utf-8"
        body = raw.decode(charset, errors="replace")
    html_redirect = extract_redirect_from_html(body, final_url)
    return html_redirect or final_url, body


def amap_api_json(path: str, params: dict):
    query = urllib.parse.urlencode(params)
    url = f"https://restapi.amap.com{path}?{query}"
    request = urllib.request.Request(url, headers={"User-Agent": "LogisticsFinance/2.0"})
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.loads(response.read(MAX_REMOTE_BODY).decode("utf-8"))


def reverse_geocode(key: str, coordinates: dict):
    payload = amap_api_json(
        "/v3/geocode/regeo",
        {
            "key": key,
            "location": f"{coordinates['lng']},{coordinates['lat']}",
            "extensions": "base",
            "radius": 1000,
        },
    )
    if payload.get("status") != "1" or not payload.get("regeocode"):
        raise ValueError(payload.get("info") or "高德逆地理编码失败")
    regeocode = payload["regeocode"]
    component = regeocode.get("addressComponent") or {}
    city = component.get("city")
    if isinstance(city, list):
        city = ""
    return {
        "formattedAddress": regeocode.get("formatted_address") or "",
        "province": component.get("province") or "",
        "city": city or component.get("province") or "",
        "district": component.get("district") or "",
        "adcode": component.get("adcode") or "",
    }


def geocode_address(key: str, address: str):
    payload = amap_api_json("/v3/geocode/geo", {"key": key, "address": address})
    geocodes = payload.get("geocodes") or []
    if payload.get("status") != "1" or not geocodes:
        raise ValueError(payload.get("info") or "高德地址编码失败")
    item = geocodes[0]
    location = item.get("location", "").split(",")
    coordinates = None
    if len(location) == 2:
        coordinates = {"lng": float(location[0]), "lat": float(location[1])}
    return {
        "coordinates": coordinates,
        "formattedAddress": item.get("formatted_address") or address,
        "province": item.get("province") or "",
        "city": item.get("city") or item.get("province") or "",
        "district": item.get("district") or "",
        "adcode": item.get("adcode") or "",
    }


def resolve_amap(payload: dict):
    source = str(payload.get("input") or "").strip()
    key = str(payload.get("key") or "").strip()
    if not source:
        raise ValueError("请粘贴高德分享内容或链接")
    urls = [match.group(0).rstrip(").,，。") for match in URL_PATTERN.finditer(source)]
    amap_urls = [url for url in urls if is_amap_url(url)]
    if urls and not amap_urls:
        raise ValueError("仅支持导入高德地图分享链接；也可以直接粘贴完整地址文字")
    final_url = amap_urls[0] if amap_urls else ""
    page_body = ""
    coordinates = coordinates_from_text(source)
    details = query_details(final_url) if final_url else {"name": "", "address": ""}

    if final_url and not coordinates:
        final_url, page_body = fetch_amap_url(final_url)
        coordinates = coordinates_from_text(final_url) or coordinates_from_text(page_body)
        final_details = query_details(final_url)
        details["name"] = final_details["name"] or details["name"]
        details["address"] = final_details["address"] or details["address"]

    result = {
        "ok": True,
        "finalUrl": final_url,
        "coordinates": coordinates,
        "name": details["name"],
        "address": details["address"],
        "formattedAddress": "",
        "province": "",
        "city": "",
        "district": "",
        "adcode": "",
        "message": "",
    }

    if key and coordinates:
        result.update(reverse_geocode(key, coordinates))
        result["message"] = "高德链接和坐标已解析，并完成行政区反查"
    elif key and details["address"]:
        result.update(geocode_address(key, details["address"]))
        result["message"] = "高德地点地址已解析"
    elif coordinates:
        result["message"] = "已识别高德坐标；配置 Web 服务 Key 后可反查完整地址"
    elif details["address"]:
        result["formattedAddress"] = details["address"]
        result["message"] = "已提取高德分享地址"
    else:
        result["ok"] = False
        result["message"] = "链接已展开，但没有提取到地址或坐标；请复制高德中的完整分享文字"
    return result


class LogisticsHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_json(self, status: int, payload: dict):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path != "/api/amap/resolve":
            self.send_json(404, {"ok": False, "message": "接口不存在"})
            return
        try:
            content_length = int(self.headers.get("Content-Length") or "0")
            if content_length <= 0 or content_length > MAX_BODY:
                raise ValueError("请求内容为空或过大")
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
            self.send_json(200, resolve_amap(payload))
        except (urllib.error.URLError, TimeoutError):
            self.send_json(400, {"ok": False, "message": "无法联网展开高德短链接，请检查网络，或粘贴高德中的完整分享文字"})
        except (ValueError, json.JSONDecodeError) as exc:
            message = str(exc).strip() or "高德短链接无法打开，请重新从高德地图复制分享内容"
            self.send_json(400, {"ok": False, "message": message})
        except Exception:
            self.send_json(500, {"ok": False, "message": "高德地址解析服务暂时不可用"})

    def end_headers(self):
        static_path = urllib.parse.urlparse(self.path).path
        if static_path.endswith((".html", ".js", ".css")) or static_path == "/":
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="运账通本地服务")
    parser.add_argument("--host", default=HOST)
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()
    print(f"运账通已启动：http://{args.host}:{args.port}/#waybills")
    ThreadingHTTPServer((args.host, args.port), LogisticsHandler).serve_forever()
