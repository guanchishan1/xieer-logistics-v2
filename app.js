const money = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 0 });
const number = new Intl.NumberFormat("zh-CN");
const STORAGE_KEY = "yzt-finance-v2-data";
const ACCOUNT_SESSION_KEY = "yzt-account-session";
const ACCOUNT_EMAIL = "admin@logistics.com";
const ACCOUNT_PASSWORD = "admin123456";
const FINANCE_SESSION_KEY = "yzt-finance-session";
const FINANCE_ACCESS_KEY = "finance2026";
const AMAP_KEY_STORAGE = "yzt-amap-web-key";
const FINANCE_VIEWS = new Set(["receivables", "payables", "collections", "payments", "reconciliation", "costs", "cashflow", "invoices", "reports"]);
const FINANCE_ACTIONS = new Set(["create-receivable", "quick-create", "export-receivables", "export-dashboard", "create-payable", "create-flow", "import-flow", "batch-payment", "create-reconciliation", "create-cost", "create-invoice", "export-payables"]);

const regionCatalog = {
  "上海市": {
    "上海市": {
      "浦东新区": [31.221, 121.544], "嘉定区": [31.374, 121.265], "闵行区": [31.113, 121.382], "松江区": [31.032, 121.227], "青浦区": [31.151, 121.124]
    }
  },
  "浙江省": {
    "杭州市": { "余杭区": [30.419, 120.299], "萧山区": [30.183, 120.264], "钱塘区": [30.322, 120.493], "临平区": [30.419, 120.300] },
    "宁波市": { "鄞州区": [29.817, 121.547], "北仑区": [29.899, 121.845], "镇海区": [29.948, 121.716] },
    "嘉兴市": { "南湖区": [30.747, 120.784], "秀洲区": [30.765, 120.710], "桐乡市": [30.630, 120.565] }
  },
  "江苏省": {
    "苏州市": { "工业园区": [31.324, 120.719], "吴中区": [31.263, 120.632], "昆山市": [31.384, 120.981], "常熟市": [31.654, 120.752] },
    "南京市": { "江宁区": [31.953, 118.839], "栖霞区": [32.117, 118.909], "浦口区": [32.059, 118.628] },
    "无锡市": { "新吴区": [31.491, 120.365], "惠山区": [31.681, 120.298], "锡山区": [31.589, 120.357] },
    "常州市": { "新北区": [31.830, 119.974], "武进区": [31.718, 119.942] }
  },
  "安徽省": {
    "合肥市": { "蜀山区": [31.852, 117.260], "包河区": [31.793, 117.309], "瑶海区": [31.858, 117.309] }
  },
  "广东省": {
    "广州市": { "白云区": [23.158, 113.273], "黄埔区": [23.106, 113.480], "番禺区": [22.938, 113.384] },
    "深圳市": { "龙岗区": [22.721, 114.247], "宝安区": [22.553, 113.884], "龙华区": [22.696, 114.045] },
    "东莞市": { "东莞市": [23.021, 113.752] },
    "佛山市": { "南海区": [23.029, 113.143], "顺德区": [22.805, 113.293] },
    "珠海市": { "香洲区": [22.266, 113.544], "金湾区": [22.146, 113.363] },
    "中山市": { "中山市": [22.517, 113.392] }
  }
};

const demoData = {
  commonCustomers: [
    { id: "C001", name: "上海星链商贸有限公司", senderContact: "张女士", senderPhone: "13800183612", origin: ["上海市", "上海市", "浦东新区"], originAddress: "申江路288号星链物流园2号库", receiverContact: "周经理", receiverPhone: "13600188821", destination: ["浙江省", "杭州市", "余杭区"], destinationAddress: "仁和街道云创产业园A3仓", cargo: "电子设备" },
    { id: "C002", name: "苏州远景智能科技", senderContact: "马先生", senderPhone: "15800181907", origin: ["江苏省", "苏州市", "工业园区"], originAddress: "星湖街328号远景工厂", receiverContact: "陈主管", receiverPhone: "13500182260", destination: ["浙江省", "宁波市", "鄞州区"], destinationAddress: "姜山镇明光北路88号", cargo: "精密仪器" },
    { id: "C003", name: "昆山瑞达精密制造", senderContact: "王会计", senderPhone: "13700186302", origin: ["江苏省", "苏州市", "昆山市"], originAddress: "开发区前进东路168号", receiverContact: "李经理", receiverPhone: "18900180718", destination: ["安徽省", "合肥市", "蜀山区"], destinationAddress: "创新大道2800号智能产业园", cargo: "机械配件" },
    { id: "C004", name: "嘉兴优选食品", senderContact: "陈主管", senderPhone: "13500182260", origin: ["浙江省", "嘉兴市", "南湖区"], originAddress: "七星街道食品工业园6号冷库", receiverContact: "刘女士", receiverPhone: "18900180718", destination: ["上海市", "上海市", "嘉定区"], destinationAddress: "宝安公路物流园18号库", cargo: "冷链食品" }
  ],
  teams: [
    { id: "T001", name: "宏通车队", contact: "郭队长 139****2208", vehicles: 18 },
    { id: "T002", name: "顺联运输车队", contact: "程经理 137****6115", vehicles: 12 },
    { id: "T003", name: "华东冷链车队", contact: "许队长 136****9081", vehicles: 8 }
  ],
  drivers: ["王师傅", "李师傅", "周师傅", "赵师傅", "陈师傅", "刘师傅"],
  driverProfiles: [
    { name: "王师傅", phone: "13800183001", license: "A2" },
    { name: "李师傅", phone: "13800183002", license: "A2" },
    { name: "周师傅", phone: "13800183003", license: "B2" },
    { name: "赵师傅", phone: "13800183004", license: "A2" },
    { name: "陈师傅", phone: "13800183005", license: "B2" },
    { name: "刘师傅", phone: "13800183006", license: "B2" }
  ],
  vehicles: [
    { id: 201, plate: "沪A·7K821", type: "厢式货车", length: 9.6, capacity: 18, source: "自有车辆", team: "", status: "空闲", taskDriver: "" },
    { id: 202, plate: "苏E·9M610", type: "高栏货车", length: 13.0, capacity: 32, source: "车队车辆", team: "宏通车队", status: "空闲", taskDriver: "" },
    { id: 203, plate: "浙A·3P762", type: "厢式货车", length: 9.6, capacity: 18, source: "车队车辆", team: "顺联运输车队", status: "运输中", taskDriver: "周师傅" },
    { id: 204, plate: "皖A·6N128", type: "平板货车", length: 13.0, capacity: 35, source: "临时外请", team: "", status: "运输中", taskDriver: "赵师傅" },
    { id: 205, plate: "浙F·5Q336", type: "冷藏车", length: 9.6, capacity: 15, source: "车队车辆", team: "华东冷链车队", status: "空闲", taskDriver: "" },
    { id: 206, plate: "苏B·2H517", type: "厢式货车", length: 6.8, capacity: 10, source: "自有车辆", team: "", status: "空闲", taskDriver: "" }
  ],
  waybills: [
    { id: 101, no: "WB20260728016", customer: "上海星链商贸有限公司", origin: "上海市浦东新区", destination: "杭州市余杭区", originAddress: "申江路288号星链物流园2号库", destinationAddress: "仁和街道云创产业园A3仓", senderContact: "张女士", senderPhone: "13800183612", receiverContact: "周经理", receiverPhone: "13600188821", distance: 195, cargo: "电子设备", weight: "3.2吨", driver: "王师傅", vehicle: "沪A·7K821", team: "", revenue: 18600, cost: 13200, status: "待调度", date: "07-28 10:18" },
    { id: 102, no: "WB20260727015", customer: "苏州远景智能科技", origin: "苏州市工业园区", destination: "宁波市鄞州区", originAddress: "星湖街328号远景工厂", destinationAddress: "姜山镇明光北路88号", senderContact: "马先生", senderPhone: "15800181907", receiverContact: "陈主管", receiverPhone: "13500182260", distance: 245, cargo: "精密仪器", weight: "1.8吨", driver: "李师傅", vehicle: "苏E·9M610", team: "宏通车队", revenue: 15400, cost: 11800, status: "待调度", date: "07-27 16:42" },
    { id: 103, no: "WB20260726014", customer: "杭州云创供应链", origin: "杭州市余杭区", destination: "南京市江宁区", distance: 305, cargo: "日用百货", weight: "8.5吨", driver: "周师傅", vehicle: "浙A·3P762", team: "顺联运输车队", revenue: 22600, cost: 17500, status: "运输中", date: "07-26 09:36" },
    { id: 104, no: "WB20260725013", customer: "昆山瑞达精密制造", origin: "苏州市昆山市", destination: "合肥市蜀山区", distance: 415, cargo: "机械配件", weight: "12.0吨", driver: "赵师傅", vehicle: "皖A·6N128", team: "", revenue: 26800, cost: 21300, status: "运输中", date: "07-25 08:52" },
    { id: 105, no: "WB20260723012", customer: "嘉兴优选食品", origin: "嘉兴市南湖区", destination: "上海市嘉定区", distance: 105, cargo: "冷链食品", weight: "6.0吨", driver: "陈师傅", vehicle: "浙F·5Q336", team: "华东冷链车队", revenue: 13800, cost: 10200, status: "已签收", date: "07-23 14:05" },
    { id: 106, no: "WB20260721011", customer: "无锡新辰电子", origin: "无锡市新吴区", destination: "上海市浦东新区", distance: 155, cargo: "电子元件", weight: "2.5吨", driver: "刘师傅", vehicle: "苏B·2H517", team: "", revenue: 11900, cost: 8600, status: "已结算", date: "07-21 11:23" },
  ],
  receivables: [
    { id: 1, billNo: "YS20260728008", customer: "上海星链商贸有限公司", waybill: "YD202607260086", amount: 128600, received: 42000, dueDate: "2026-07-28", status: "partial", note: "上海—杭州干线运输月结款", createdAt: "2026-07-01" },
    { id: 2, billNo: "YS20260727015", customer: "苏州远景智能科技", waybill: "YD202607250119", amount: 96400, received: 10000, dueDate: "2026-07-27", status: "overdue", note: "苏州—宁波整车运输", createdAt: "2026-06-26" },
    { id: 3, billNo: "YS20260725006", customer: "杭州云创供应链", waybill: "YD202607230074", amount: 78500, received: 0, dueDate: "2026-08-05", status: "pending", note: "零担运输及提送货费", createdAt: "2026-07-05" },
    { id: 4, billNo: "YS20260721009", customer: "昆山瑞达精密制造", waybill: "YD202607180153", amount: 64200, received: 0, dueDate: "2026-07-21", status: "overdue", note: "昆山—合肥专车运输", createdAt: "2026-06-20" },
    { id: 5, billNo: "YS20260719003", customer: "嘉兴优选食品", waybill: "YD202607170031", amount: 45800, received: 45800, dueDate: "2026-07-25", status: "paid", note: "冷链运输费", createdAt: "2026-07-03" },
    { id: 6, billNo: "YS20260716012", customer: "无锡新辰电子", waybill: "YD202607140097", amount: 55300, received: 0, dueDate: "2026-06-30", status: "overdue", note: "无锡—上海往返运输", createdAt: "2026-06-01" },
    { id: 7, billNo: "YS20260715018", customer: "南京宏远电器", waybill: "YD202607120128", amount: 39800, received: 20000, dueDate: "2026-08-12", status: "partial", note: "干线运输费", createdAt: "2026-07-12" },
    { id: 8, billNo: "YS20260712005", customer: "常州鼎盛新材料", waybill: "YD202607100056", amount: 74100, received: 74100, dueDate: "2026-07-20", status: "paid", note: "危险品运输服务", createdAt: "2026-06-22" },
  ],
  payables: [
    { no: "YF20260728012", party: "皖A·7K821 / 王师傅", type: "外请车运费", amount: 18600, paid: 0, due: "2026-07-30", status: "approved" },
    { no: "YF20260727008", party: "顺联运输有限公司", type: "承运商运费", amount: 72800, paid: 21840, due: "2026-07-29", status: "partial" },
    { no: "YF20260726019", party: "苏州东港装卸队", type: "装卸费", amount: 8600, paid: 0, due: "2026-08-05", status: "draft" },
    { no: "YF20260723007", party: "沪D·9M610 / 李师傅", type: "司机运费", amount: 12500, paid: 12500, due: "2026-07-27", status: "paid" },
    { no: "YF20260721014", party: "宏通车队", type: "车队月结", amount: 89600, paid: 0, due: "2026-08-10", status: "approved" },
  ],
  cashflows: [
    { time: "今天 10:26", account: "招商银行 · 8890", summary: "上海星链商贸回款", relation: "YS20260728008", amount: 42000, type: "in", matched: true },
    { time: "今天 09:42", account: "建设银行 · 1028", summary: "支付王师傅运费", relation: "YF20260728012", amount: 18600, type: "out", matched: true },
    { time: "昨天 16:08", account: "微信商户账户", summary: "客户扫码付款", relation: "待认领", amount: 6800, type: "in", matched: false },
    { time: "昨天 14:20", account: "招商银行 · 8890", summary: "ETC账户充值", relation: "费用报销", amount: 15000, type: "out", matched: true },
    { time: "07-26 11:13", account: "建设银行 · 1028", summary: "嘉兴优选食品回款", relation: "YS20260719003", amount: 45800, type: "in", matched: true },
  ],
  invoices: [
    { no: "KP20260728009", party: "上海星链商贸有限公司", type: "增值税专用发票", amount: 128600, date: "2026-07-28", status: "pending" },
    { no: "KP20260727003", party: "杭州云创供应链", type: "增值税专用发票", amount: 78500, date: "2026-07-27", status: "approved" },
    { no: "JX20260726017", party: "顺联运输有限公司", type: "进项专用发票", amount: 72800, date: "2026-07-26", status: "draft" },
    { no: "KP20260722006", party: "嘉兴优选食品", type: "增值税普通发票", amount: 45800, date: "2026-07-22", status: "paid" },
  ],
  customers: [
    { name: "上海星链商贸有限公司", contact: "张女士 · 138****3612", level: "A级", revenue: 368000, balance: 86600, days: 30, color: "#2563eb", soft: "#eaf1ff" },
    { name: "杭州云创供应链", contact: "周经理 · 136****8821", level: "A级", revenue: 286400, balance: 78500, days: 30, color: "#15966a", soft: "#e8f8f1" },
    { name: "苏州远景智能科技", contact: "马先生 · 158****1907", level: "B级", revenue: 241800, balance: 86400, days: 30, color: "#7c55c7", soft: "#f2edff" },
    { name: "昆山瑞达精密制造", contact: "王会计 · 137****6302", level: "B级", revenue: 198600, balance: 64200, days: 45, color: "#d97706", soft: "#fff5df" },
    { name: "嘉兴优选食品", contact: "陈主管 · 135****2260", level: "A级", revenue: 176500, balance: 0, days: 15, color: "#18a7b5", soft: "#e8f9fb" },
    { name: "无锡新辰电子", contact: "刘经理 · 189****0718", level: "C级", revenue: 153200, balance: 55300, days: 30, color: "#d64242", soft: "#fff0f0" },
  ],
  reconciliations: [
    { no: "DZ20260728003", customer: "上海星链商贸有限公司", period: "2026-07-01 至 07-25", count: 8, amount: 186400, confirmed: 186400, status: "已确认" },
    { no: "DZ20260727002", customer: "杭州云创供应链", period: "2026-07-01 至 07-20", count: 6, amount: 128600, confirmed: 126800, status: "已发送" },
    { no: "DZ20260726001", customer: "苏州远景智能科技", period: "2026-06-21 至 07-20", count: 5, amount: 96400, confirmed: 0, status: "草稿" },
  ],
  costs: [
    { date: "2026-07-28", driver: "王师傅", waybill: "WB20260728016", type: "油费", amount: 1260, location: "沪昆高速嘉兴服务区", voucher: "FP07280018", status: "已入账" },
    { date: "2026-07-28", driver: "李师傅", waybill: "WB20260727015", type: "过路费", amount: 680, location: "苏州—宁波", voucher: "ETC0728009", status: "已入账" },
    { date: "2026-07-27", driver: "周师傅", waybill: "WB20260726014", type: "装卸费", amount: 800, location: "南京江宁仓", voucher: "ZX0727003", status: "待审核" },
    { date: "2026-07-26", driver: "赵师傅", waybill: "WB20260725013", type: "维修费", amount: 2350, location: "合肥新站维修厂", voucher: "WX0726006", status: "已入账" },
  ],
};

let state = loadData();
let currentReceivableTab = "all";
let currentWaybillTab = "all";
let currentReceivableId = null;
const assignmentVisibility = { driver: false, vehicle: false };
let pendingFinanceView = null;

function cloneDemo() {
  return JSON.parse(JSON.stringify(demoData));
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.receivables ? { ...cloneDemo(), ...saved } : cloneDemo();
  } catch {
    return cloneDemo();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatMoney(value) {
  return money.format(value || 0).replace("CN¥", "¥");
}

function setSelectOptions(select, values, placeholder) {
  if (!select) return;
  select.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : "";
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = typeof value === "string" ? value : value.value;
    option.textContent = typeof value === "string" ? value : value.label;
    select.append(option);
  });
}

function updateRegionCities(prefix) {
  const province = document.getElementById(`${prefix}-province`).value;
  const cities = province ? Object.keys(regionCatalog[province]) : [];
  setSelectOptions(document.getElementById(`${prefix}-city`), cities, "选择城市");
  setSelectOptions(document.getElementById(`${prefix}-district`), [], "选择区/县");
  calculateDistance();
}

function updateRegionDistricts(prefix) {
  const province = document.getElementById(`${prefix}-province`).value;
  const city = document.getElementById(`${prefix}-city`).value;
  const districts = province && city ? Object.keys(regionCatalog[province][city]) : [];
  setSelectOptions(document.getElementById(`${prefix}-district`), districts, "选择区/县");
  calculateDistance();
}

function setRegionPath(prefix, path) {
  if (!Array.isArray(path) || path.length !== 3) return;
  const [province, city, district] = path;
  const provinceSelect = document.getElementById(`${prefix}-province`);
  provinceSelect.value = province;
  updateRegionCities(prefix);
  document.getElementById(`${prefix}-city`).value = city;
  updateRegionDistricts(prefix);
  document.getElementById(`${prefix}-district`).value = district;
  calculateDistance();
}

function selectedRegion(prefix) {
  const province = document.getElementById(`${prefix}-province`).value;
  const city = document.getElementById(`${prefix}-city`).value;
  const district = document.getElementById(`${prefix}-district`).value;
  const coords = province && city && district ? regionCatalog[province]?.[city]?.[district] : null;
  return { province, city, district, coords, label: `${city}${district}` };
}

function haversineKm(a, b) {
  const radians = value => value * Math.PI / 180;
  const earthRadius = 6371;
  const dLat = radians(b[0] - a[0]);
  const dLng = radians(b[1] - a[1]);
  const lat1 = radians(a[0]);
  const lat2 = radians(b[0]);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(value));
}

function calculateDistance() {
  const origin = selectedRegion("origin");
  const destination = selectedRegion("destination");
  const output = document.getElementById("distance-value");
  const input = document.querySelector('#waybill-form input[name="distance"]');
  if (!origin.coords || !destination.coords) {
    if (origin.district && destination.district) {
      output.textContent = `${origin.label} → ${destination.label} · 区县已识别`;
      return Number(input.value) || 0;
    }
    output.textContent = "请选择完整起点和终点";
    input.value = "";
    return 0;
  }
  const directDistance = haversineKm(origin.coords, destination.coords);
  const estimatedRoadDistance = Math.max(1, Math.round(directDistance * 1.18));
  output.textContent = `${origin.label} → ${destination.label} · 约 ${estimatedRoadDistance} km`;
  input.value = estimatedRoadDistance;
  return estimatedRoadDistance;
}

function prepareWaybillForm() {
  setSelectOptions(document.getElementById("common-customer-select"), state.commonCustomers.map(x => ({ value: x.id, label: `${x.name} · ${x.origin[2]}→${x.destination[2]}` })), "选择已保存客户");
  setSelectOptions(document.getElementById("waybill-driver-select"), state.drivers, "选择本次任务司机");
  setSelectOptions(document.getElementById("waybill-team-select"), state.teams.map(x => x.name), "不指定车队");
  setSelectOptions(document.getElementById("vehicle-team-select"), state.teams.map(x => x.name), "公司自有/无车队");
  setSelectOptions(document.getElementById("origin-province"), Object.keys(regionCatalog), "选择省份");
  setSelectOptions(document.getElementById("destination-province"), Object.keys(regionCatalog), "选择省份");
  setSelectOptions(document.getElementById("origin-city"), [], "选择城市");
  setSelectOptions(document.getElementById("destination-city"), [], "选择城市");
  setSelectOptions(document.getElementById("origin-district"), [], "选择区/县");
  setSelectOptions(document.getElementById("destination-district"), [], "选择区/县");
  document.getElementById("distance-value").textContent = "请选择完整起点和终点";
  document.getElementById("smart-sender-info")?.classList.remove("recognized");
  document.getElementById("smart-receiver-info")?.classList.remove("recognized");
  const senderResult = document.getElementById("sender-import-result");
  const receiverResult = document.getElementById("receiver-import-result");
  if (senderResult) {
    senderResult.textContent = "粘贴后自动识别发货人、电话和装货地址";
    senderResult.className = "";
  }
  if (receiverResult) {
    receiverResult.textContent = "粘贴后自动识别收货人、电话和卸货地址";
    receiverResult.className = "";
  }
  document.getElementById("driver-entry-mode").value = "existing";
  document.getElementById("vehicle-entry-mode").value = "existing";
  setAssignmentVisibility("driver", false);
  setAssignmentVisibility("vehicle", false);
  updateAssignmentMode("driver");
  updateAssignmentMode("vehicle");
  refreshVehicleOptions();
  updateWaybillFinanceAccess();
  updateChargeTotal();
}

function refreshVehicleOptions() {
  const mode = document.getElementById("carrier-mode").value;
  const team = document.getElementById("waybill-team-select").value;
  let vehicles = state.vehicles;
  if (mode === "自有车辆") vehicles = vehicles.filter(x => x.source === "自有车辆");
  if (mode === "合作车队") vehicles = vehicles.filter(x => x.source === "车队车辆" && (!team || x.team === team));
  if (mode === "临时外请") vehicles = vehicles.filter(x => x.source === "临时外请");
  setSelectOptions(document.getElementById("waybill-vehicle-select"), vehicles.map(x => ({ value: x.plate, label: `${x.plate} · ${x.type} ${x.length}米 · ${x.team || x.source}` })), "选择本次任务车辆");
}

function setAssignmentVisibility(type, visible) {
  assignmentVisibility[type] = visible;
  const fields = document.getElementById(`${type}-assignment-fields`);
  const empty = document.getElementById(`${type}-assignment-empty`);
  const button = document.querySelector(`[data-toggle-assignment="${type}"]`);
  if (!fields || !empty || !button) return;
  fields.hidden = !visible;
  empty.hidden = visible;
  button.classList.toggle("active", visible);
  button.textContent = visible
    ? `－ 暂不填写${type === "driver" ? "司机" : "车辆"}`
    : `＋ 填写${type === "driver" ? "司机" : "车辆"}信息`;
}

function updateAssignmentMode(type) {
  const mode = document.getElementById(`${type}-entry-mode`)?.value || "existing";
  const existingFields = document.getElementById(`existing-${type}-fields`);
  const newFields = document.getElementById(`new-${type}-fields`);
  if (existingFields) existingFields.hidden = mode !== "existing";
  if (newFields) newFields.hidden = mode !== "new";
}

function updateChargeTotal() {
  const form = document.getElementById("waybill-form");
  const output = document.getElementById("waybill-charge-total");
  if (!form || !output) return;
  const total = ["freight", "insuranceFee", "loadingFee", "upstairsFee", "otherFee"]
    .reduce((sum, name) => sum + (Number(form.elements[name]?.value) || 0), 0);
  output.textContent = formatMoney(total);
}

function updateWaybillFinanceAccess() {
  const unlocked = financeAccessGranted();
  const fieldset = document.getElementById("waybill-finance-fieldset");
  const lockedNote = document.getElementById("waybill-finance-locked-note");
  if (fieldset) fieldset.hidden = !unlocked;
  if (lockedNote) lockedNote.hidden = true;
}

function importCommonCustomer() {
  const id = document.getElementById("common-customer-select").value;
  const customer = state.commonCustomers.find(x => x.id === id);
  if (!customer) {
    const senderText = document.getElementById("smart-sender-info").value.trim();
    const receiverText = document.getElementById("smart-receiver-info").value.trim();
    if (senderText || receiverText) {
      if (senderText) smartFillSenderInfo();
      if (receiverText) smartFillReceiverInfo();
      return;
    }
    toast("请先选择一个已保存客户，或在上方分别粘贴发货、收货信息", "warning");
    return;
  }
  const form = document.getElementById("waybill-form");
  form.elements.customer.value = customer.name || "";
  ["senderContact", "senderPhone", "originAddress", "receiverContact", "receiverPhone", "destinationAddress", "cargo"].forEach(name => {
    form.elements[name].value = customer[name] || "";
  });
  setRegionPath("origin", customer.origin);
  setRegionPath("destination", customer.destination);
  toast(`已带入 ${customer.name} 的常用收发货资料`);
}

const smartFieldAliases = {
  customer: ["客户名称", "客户公司", "公司名称", "单位名称", "客户"],
  senderContact: ["发货联系人", "提货联系人", "发货人", "寄件人", "发件人", "托运人", "提货人"],
  senderPhone: ["发货联系电话", "提货联系电话", "发货电话", "寄件电话", "发件电话", "托运电话", "提货电话"],
  originAddress: ["详细装货地址", "发货地址", "寄件地址", "发件地址", "提货地址", "取货地址", "装车地址", "装货地址", "上门地址", "提货地点", "装车地点", "起点地址", "始发地址", "始发地", "提货地", "起点"],
  receiverContact: ["收货联系人", "送货联系人", "收货人", "收件人", "签收人", "送货人"],
  receiverPhone: ["收货联系电话", "送货联系电话", "收货电话", "收件电话", "签收电话", "送货电话"],
  destinationAddress: ["详细卸货地址", "收货地址", "收件地址", "送货地址", "配送地址", "卸车地址", "卸货地址", "送达地址", "收货地点", "卸车地点", "终点地址", "目的地", "送货地", "卸货地", "终点"],
  cargo: ["货物名称", "货物品名", "货物", "品名"]
};

const allSmartAliases = Object.values(smartFieldAliases).flat().sort((a, b) => b.length - a.length);
const smartPhonePattern = /(?:\+?86[-\s]?)?(?:1[3-9]\d(?:[-\s]?\d){8}|0\d{2,3}[-\s]?\d{7,8})/g;
const provinceNames = [
  "河北省", "山西省", "辽宁省", "吉林省", "黑龙江省", "江苏省", "浙江省", "安徽省", "福建省", "江西省",
  "山东省", "河南省", "湖北省", "湖南省", "广东省", "海南省", "四川省", "贵州省", "云南省", "陕西省",
  "甘肃省", "青海省", "台湾省", "内蒙古自治区", "广西壮族自治区", "西藏自治区", "宁夏回族自治区", "新疆维吾尔自治区"
];
const municipalityNames = ["北京市", "上海市", "天津市", "重庆市"];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanSmartValue(value) {
  return String(value || "").replace(/^[\s:：,，;；、-]+|[\s,，;；、-]+$/g, "").trim();
}

function extractLabeledValue(text, aliases) {
  const wanted = aliases.map(escapeRegExp).join("|");
  const stops = allSmartAliases.map(escapeRegExp).join("|");
  const pattern = new RegExp(`(?:^|[\\s,，;；])(?:${wanted})\\s*[:：]?\\s*([\\s\\S]*?)(?=(?:[\\s,，;；]+)?(?:${stops})\\s*[:：]?|$)`, "i");
  return cleanSmartValue(text.match(pattern)?.[1]);
}

function extractPhones(text) {
  smartPhonePattern.lastIndex = 0;
  return [...String(text || "").matchAll(smartPhonePattern)]
    .map(match => match[0].replace(/\D/g, "").replace(/^86(?=1[3-9]\d{9}$)/, ""))
    .filter((phone, index, list) => phone && list.indexOf(phone) === index);
}

function findRegionMatches(text) {
  const matches = [];
  Object.entries(regionCatalog).forEach(([province, cities]) => {
    Object.entries(cities).forEach(([city, districts]) => {
      Object.keys(districts).forEach(district => {
        let from = 0;
        while (String(text || "").indexOf(district, from) >= 0) {
          const index = String(text).indexOf(district, from);
          matches.push({ index, path: [province, city, district] });
          from = index + district.length;
        }
      });
    });
  });
  return matches.sort((a, b) => a.index - b.index);
}

function findGenericRegionMatches(text) {
  const value = String(text || "");
  const matches = [];
  const provinces = provinceNames.map(escapeRegExp).sort((a, b) => b.length - a.length).join("|");
  const municipalities = municipalityNames.map(escapeRegExp).join("|");
  const provincePattern = new RegExp(`(${provinces})([\\u4e00-\\u9fa5]{1,8}?(?:市|自治州|地区|盟))([\\u4e00-\\u9fa5]{1,8}?(?:区|县|旗|市))`, "g");
  const municipalityPattern = new RegExp(`(${municipalities})([\\u4e00-\\u9fa5]{1,8}?(?:区|县))`, "g");
  [...value.matchAll(provincePattern)].forEach(match => matches.push({ index: match.index, path: [match[1], match[2], match[3]], dynamic: true }));
  [...value.matchAll(municipalityPattern)].forEach(match => matches.push({ index: match.index, path: [match[1], match[1], match[2]], dynamic: true }));
  return matches.sort((a, b) => a.index - b.index);
}

function mergeRegionMatches(text) {
  const matches = [...findRegionMatches(text), ...findGenericRegionMatches(text)].sort((a, b) => a.index - b.index);
  return matches.filter((match, index, list) => index === list.findIndex(other => other.index === match.index && other.path.join("|") === match.path.join("|")));
}

function ensureRegionPath(path) {
  if (!path?.length) return;
  const [province, city, district] = path;
  regionCatalog[province] ||= {};
  regionCatalog[province][city] ||= {};
  if (!(district in regionCatalog[province][city])) regionCatalog[province][city][district] = null;
}

function extractDirectionBlock(text, startWords, stopWords) {
  const starts = startWords.map(escapeRegExp).join("|");
  const stops = stopWords.map(escapeRegExp).join("|");
  const pattern = new RegExp(`(?:${starts})(?:信息|联系人|人|电话|地址)?\\s*[:：]?\\s*([\\s\\S]*?)(?=(?:${stops})(?:信息|联系人|人|电话|地址)?\\s*[:：]?|$)`, "i");
  return cleanSmartValue(text.match(pattern)?.[1]);
}

function cleanPerson(value) {
  smartPhonePattern.lastIndex = 0;
  const withoutPhone = String(value || "").replace(smartPhonePattern, " ");
  const explicit = withoutPhone.match(/([\u4e00-\u9fa5]{1,4}(?:先生|女士|经理|主管|会计|师傅))/);
  if (explicit) return explicit[1];
  const plain = cleanSmartValue(withoutPhone).split(/[\s,，、]/)[0];
  return /^[\u4e00-\u9fa5]{2,4}$/.test(plain) ? plain : "";
}

function inferPersonFromBlock(block) {
  const value = String(block || "");
  const beforePhone = value.match(/(?:联系人|发货人|收货人|寄件人|收件人)?\s*[:：]?\s*([\u4e00-\u9fa5]{1,4}(?:先生|女士|经理|主管|会计|师傅)?)\s*[,，、\s]*(?:(?:电话|手机)\s*[:：]?\s*)?(?=(?:\+?86[-\s]?)?1[3-9]\d)/);
  return cleanPerson(beforePhone?.[1]);
}

function inferPersonByPhoneOrder(text, order) {
  smartPhonePattern.lastIndex = 0;
  const phoneMatches = [...String(text || "").matchAll(smartPhonePattern)];
  const phoneMatch = phoneMatches[order];
  if (!phoneMatch) return "";
  const before = String(text).slice(Math.max(0, phoneMatch.index - 28), phoneMatch.index);
  const explicit = before.match(/([\u4e00-\u9fa5]{1,3}(?:先生|女士|经理|主管|会计|师傅))\s*[,，、\s]*(?:(?:电话|手机)\s*[:：]?\s*)?$/);
  if (explicit) return explicit[1];
  const plain = before.match(/(?:^|[,，;；、\s])([\u4e00-\u9fa5]{2,4})\s*(?:(?:电话|手机)\s*[:：]?\s*)?$/);
  return cleanPerson(plain?.[1]);
}

function stripRegionFromAddress(address, path) {
  smartPhonePattern.lastIndex = 0;
  let result = cleanSmartValue(String(address || "").replace(smartPhonePattern, " "));
  [...new Set(path || [])].sort((a, b) => b.length - a.length).forEach(part => {
    result = result.replace(part, "");
  });
  result = result
    .replace(/^(?:详细装货地址|详细卸货地址|发货地址|寄件地址|发件地址|提货地址|取货地址|装车地址|装货地址|上门地址|收货地址|收件地址|送货地址|配送地址|卸车地址|卸货地址|送达地址|提货地点|装车地点|收货地点|卸车地点|起点地址|终点地址|始发地址|目的地|提货地|送货地|卸货地|始发地|起点|终点|地址|地点|位置)\s*[:：]?/, "")
    .replace(/(?:发货人|收货人|寄件人|收件人|联系人)\s*[:：]?\s*[\u4e00-\u9fa5]{2,6}/g, "")
    .replace(/(?:电话|手机)\s*[:：]?/g, "")
    .replace(/[，,;；\s]+(?:货物名称|货物品名|货物|品名)\s*[:：]?.*$/, "");
  return cleanSmartValue(result);
}

function addressFromBlock(block, path) {
  if (!block) return "";
  const district = path?.[2];
  const pieces = String(block).split(/[；;\n]/).flatMap(part => part.split(/[，,](?=[^号弄栋室库园区大厦路街道镇村]{0,5}(?:发货|收货|电话|手机|联系人|先生|女士|经理|主管|会计))/));
  const labeled = String(block).match(/(?:详细地址|地址|地点|位置)\s*[:：]?\s*([\s\S]+)/)?.[1];
  const roadLike = pieces.find(part => /(?:路|街|道|巷|弄|号|村|镇|园区|大厦|栋|室|仓|库)/.test(part));
  const candidate = (district && pieces.find(part => part.includes(district))) || labeled || roadLike || block;
  return stripRegionFromAddress(candidate, path);
}

function addressFromWholeText(text, path) {
  if (!path) return "";
  const district = path[2];
  const segment = String(text || "").split(/[；;\n]/).find(part => part.includes(district)) || "";
  if (!segment) return "";
  const starts = path.map(part => segment.indexOf(part)).filter(index => index >= 0);
  const addressStart = starts.length ? Math.min(...starts) : segment.indexOf(district);
  const candidate = segment.slice(Math.max(0, addressStart));
  return stripRegionFromAddress(candidate, path);
}

function inferCompany(text) {
  const savedCustomer = state.commonCustomers.find(customer => text.includes(customer.name));
  if (savedCustomer) return savedCustomer.name;
  const match = text.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·-]{2,32}?(?:供应链有限公司|物流有限公司|商贸有限公司|科技有限公司|制造有限公司|有限责任公司|有限公司|供应链|商贸|物流|科技|制造|工厂))/);
  return cleanSmartValue(match?.[1]).replace(/^(?:客户名称|客户公司|公司名称|单位名称|客户)\s*[:：]?/, "");
}

function applyRecognizedPartyFields({ textarea, result, assignments, labels, required, path, prefix, silent }) {
  const form = document.getElementById("waybill-form");
  const recognized = [];
  Object.entries(assignments).forEach(([name, value]) => {
    if (!value) return;
    form.elements[name].value = value;
    form.elements[name].classList.add("smart-filled");
    window.setTimeout(() => form.elements[name]?.classList.remove("smart-filled"), 2200);
    recognized.push(labels[name]);
  });
  if (path) {
    ensureRegionPath(path);
    setSelectOptions(document.getElementById(`${prefix}-province`), Object.keys(regionCatalog), "选择省份");
    setRegionPath(prefix, path);
    recognized.push(prefix === "origin" ? "起点区县" : "终点区县");
  }
  calculateDistance();

  const missing = required.filter(([name]) => !form.elements[name].value).map(([, label]) => label);
  if (recognized.length) {
    textarea.classList.add("recognized");
    result.textContent = `已填入：${recognized.join("、")}${missing.length ? `；待确认：${missing.join("、")}` : ""}`;
    result.className = missing.length ? "warning" : "success";
    if (!silent) toast(`${prefix === "origin" ? "发货" : "收货"}信息已识别并填入`);
  } else {
    textarea.classList.remove("recognized");
    result.textContent = `未识别到${prefix === "origin" ? "发货" : "收货"}信息，请检查姓名、电话和地址`;
    result.className = "warning";
    if (!silent) toast(result.textContent, "warning");
  }
}

function smartFillSenderInfo(silent = false) {
  const textarea = document.getElementById("smart-sender-info");
  const result = document.getElementById("sender-import-result");
  const text = textarea.value.replace(/\r/g, "").replace(/\u3000/g, " ").trim();
  if (!text) {
    result.textContent = "请先粘贴发货方信息";
    result.className = "warning";
    if (!silent) textarea.focus();
    return;
  }
  const path = mergeRegionMatches(text)[0]?.path;
  const labeledCustomer = extractLabeledValue(text, smartFieldAliases.customer);
  const customer = inferCompany(labeledCustomer) || inferCompany(text) || cleanSmartValue(labeledCustomer).split(/[，,；;]/)[0];
  const senderPhone = extractPhones(extractLabeledValue(text, smartFieldAliases.senderPhone))[0] || extractPhones(text)[0];
  const senderContact = cleanPerson(extractLabeledValue(text, smartFieldAliases.senderContact)) || inferPersonFromBlock(text) || inferPersonByPhoneOrder(text, 0);
  const cargo = cleanSmartValue(extractLabeledValue(text, smartFieldAliases.cargo)).split(/[，,；;]/)[0];
  const directAddress = extractLabeledValue(text, smartFieldAliases.originAddress);
  const originAddress = stripRegionFromAddress(directAddress, path) || addressFromBlock(text, path) || addressFromWholeText(text, path);
  applyRecognizedPartyFields({
    textarea, result, silent, path, prefix: "origin",
    assignments: { customer, cargo, senderContact, senderPhone, originAddress },
    labels: { customer: "客户", cargo: "货物", senderContact: "发货人", senderPhone: "发货电话", originAddress: "装货地址" },
    required: [["senderContact", "发货人"], ["senderPhone", "发货电话"], ["originAddress", "装货详细地址"]]
  });
}

function smartFillReceiverInfo(silent = false) {
  const textarea = document.getElementById("smart-receiver-info");
  const result = document.getElementById("receiver-import-result");
  const text = textarea.value.replace(/\r/g, "").replace(/\u3000/g, " ").trim();
  if (!text) {
    result.textContent = "请先粘贴收货方信息";
    result.className = "warning";
    if (!silent) textarea.focus();
    return;
  }
  const path = mergeRegionMatches(text)[0]?.path;
  const receiverPhone = extractPhones(extractLabeledValue(text, smartFieldAliases.receiverPhone))[0] || extractPhones(text)[0];
  const receiverContact = cleanPerson(extractLabeledValue(text, smartFieldAliases.receiverContact)) || inferPersonFromBlock(text) || inferPersonByPhoneOrder(text, 0);
  const directAddress = extractLabeledValue(text, smartFieldAliases.destinationAddress);
  const destinationAddress = stripRegionFromAddress(directAddress, path) || addressFromBlock(text, path) || addressFromWholeText(text, path);
  applyRecognizedPartyFields({
    textarea, result, silent, path, prefix: "destination",
    assignments: { receiverContact, receiverPhone, destinationAddress },
    labels: { receiverContact: "收货人", receiverPhone: "收货电话", destinationAddress: "卸货地址" },
    required: [["receiverContact", "收货人"], ["receiverPhone", "收货电话"], ["destinationAddress", "卸货详细地址"]]
  });
}

function decodeAmapValue(value) {
  let result = String(value || "");
  for (let index = 0; index < 3; index += 1) {
    try {
      const decoded = decodeURIComponent(result);
      if (decoded === result) break;
      result = decoded;
    } catch {
      break;
    }
  }
  return result.replace(/\+/g, " ");
}

function amapCoordinatesFromText(value) {
  const text = decodeAmapValue(value);
  const labeled = text.match(/(?:position|location|center|geo|q)\s*[=:]\s*(1(?:0\d|1\d|2\d|3[0-5])(?:\.\d+)?)\s*[,，]\s*([1-5]?\d(?:\.\d+)?)/i);
  const amapP = text.match(/(?:[?&]p=|(?:^|\s)p\s*[=:])[^,&#\s]*,([1-5]?\d(?:\.\d+)?)\s*[,，]\s*(1(?:0\d|1\d|2\d|3[0-5])(?:\.\d+)?)/i);
  const plain = text.match(/(?<!\d)(1(?:0\d|1\d|2\d|3[0-5])\.\d{3,})\s*[,，]\s*([1-5]?\d\.\d{3,})(?!\d)/);
  if (amapP) {
    const coordinates = [Number(amapP[1]), Number(amapP[2])];
    return coordinates[0] >= 3 && coordinates[0] <= 54 && coordinates[1] >= 73 && coordinates[1] <= 136 ? coordinates : null;
  }
  const match = labeled || plain;
  if (!match) return null;
  const coordinates = [Number(match[2]), Number(match[1])];
  return coordinates[0] >= 3 && coordinates[0] <= 54 && coordinates[1] >= 73 && coordinates[1] <= 136 ? coordinates : null;
}

function parseAmapContentLocally(text) {
  const urls = String(text || "").match(/https?:\/\/[^\s<>'"。，；]+/gi) || [];
  const amapUrl = urls.find(value => /(?:amap\.com|autonavi\.com|gaode\.com)/i.test(value)) || "";
  let name = "";
  let address = "";
  if (amapUrl) {
    try {
      const parsed = new URL(amapUrl);
      const getFirst = keys => keys.map(key => parsed.searchParams.get(key)).find(Boolean) || "";
      name = decodeAmapValue(getFirst(["name", "poiname", "dname", "sname"]));
      address = decodeAmapValue(getFirst(["address", "addr", "daddress"]));
      const amapP = decodeAmapValue(parsed.searchParams.get("p") || "").split(",");
      if (!name && amapP.length >= 4) name = amapP[3].trim();
      if (!address && amapP.length >= 5) address = amapP[4].trim();
    } catch {
      // The local resolver can still use raw text and coordinates.
    }
  }
  return {
    amapUrl,
    name,
    address,
    coordinates: amapCoordinatesFromText(`${text}\n${amapUrl}`),
    isShortLink: /surl\.amap\.com/i.test(amapUrl)
  };
}

function nearestRegionPath(coordinates, maximumKm = 80) {
  if (!coordinates) return null;
  let nearest = null;
  Object.entries(regionCatalog).forEach(([province, cities]) => {
    Object.entries(cities).forEach(([city, districts]) => {
      Object.entries(districts).forEach(([district, coords]) => {
        if (!coords) return;
        const distance = haversineKm(coordinates, coords);
        if (!nearest || distance < nearest.distance) nearest = { distance, path: [province, city, district] };
      });
    });
  });
  return nearest && nearest.distance <= maximumKm ? nearest.path : null;
}

function amapPathFromResult(result) {
  if (result?.province && result?.city && result?.district) return [result.province, result.city, result.district];
  const coordinates = result?.coordinates
    ? [Number(result.coordinates.lat), Number(result.coordinates.lng)]
    : null;
  return nearestRegionPath(coordinates);
}

function applyAmapResult(type, originalText, result) {
  const isSender = type === "sender";
  const textarea = document.getElementById(isSender ? "smart-sender-info" : "smart-receiver-info");
  const resultElement = document.getElementById(isSender ? "sender-import-result" : "receiver-import-result");
  const form = document.getElementById("waybill-form");
  const prefix = isSender ? "origin" : "destination";
  const addressField = isSender ? "originAddress" : "destinationAddress";
  const path = amapPathFromResult(result) || mergeRegionMatches(result?.formattedAddress || result?.address || originalText)[0]?.path;
  const fullAddress = result?.formattedAddress || result?.address || "";
  const detailedAddress = path ? stripRegionFromAddress(fullAddress, path) : cleanSmartValue(fullAddress);
  const recognized = [];

  if (isSender) smartFillSenderInfo(true);
  else smartFillReceiverInfo(true);

  if (path) {
    ensureRegionPath(path);
    setSelectOptions(document.getElementById(`${prefix}-province`), Object.keys(regionCatalog), "选择省份");
    setRegionPath(prefix, path);
    recognized.push(isSender ? "起点区县" : "终点区县");
  }
  if (detailedAddress || result?.name) {
    form.elements[addressField].value = detailedAddress || result.name;
    form.elements[addressField].classList.add("smart-filled");
    window.setTimeout(() => form.elements[addressField]?.classList.remove("smart-filled"), 2200);
    recognized.push(isSender ? "装货地址" : "卸货地址");
  }
  if (isSender && result?.name && !form.elements.customer.value) {
    form.elements.customer.value = result.name;
    recognized.push("发货公司/地点");
  }
  calculateDistance();

  const coordinateNote = result?.coordinates ? "、坐标" : "";
  const missing = [
    !form.elements[isSender ? "senderContact" : "receiverContact"].value ? "联系人" : "",
    !form.elements[isSender ? "senderPhone" : "receiverPhone"].value ? "电话" : "",
    !form.elements[addressField].value ? "详细地址" : "",
    !path ? "区县" : ""
  ].filter(Boolean);
  if (recognized.length) {
    textarea.classList.add("recognized");
    resultElement.textContent = `高德已导入：${recognized.join("、")}${coordinateNote}${missing.length ? `；请确认：${missing.join("、")}` : ""}`;
    resultElement.className = missing.length ? "warning" : "success";
    toast(`${isSender ? "发货" : "收货"}高德地址已导入`);
  } else {
    resultElement.textContent = result?.message || "未从高德内容中提取到可填写的地址";
    resultElement.className = "warning";
    toast(resultElement.textContent, "warning");
  }
}

async function importAmapParty(type, button) {
  const isSender = type === "sender";
  window.clearTimeout(isSender ? senderInputTimer : receiverInputTimer);
  const textarea = document.getElementById(isSender ? "smart-sender-info" : "smart-receiver-info");
  const resultElement = document.getElementById(isSender ? "sender-import-result" : "receiver-import-result");
  const text = textarea.value.trim();
  if (!text) {
    resultElement.textContent = "请先粘贴高德地点、分享文字或链接";
    resultElement.className = "warning";
    textarea.focus();
    return;
  }

  const local = parseAmapContentLocally(text);
  const localPath = mergeRegionMatches(text)[0]?.path || nearestRegionPath(local.coordinates);
  const localAddress = local.address || (localPath ? addressFromWholeText(text, localPath) || addressFromBlock(text, localPath) : "");
  if (!local.amapUrl && (localPath || localAddress)) {
    if (isSender) smartFillSenderInfo(false);
    else smartFillReceiverInfo(false);
    return;
  }

  const originalButtonText = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = "正在解析…";
  }
  resultElement.textContent = local.isShortLink ? "正在展开高德短链接…" : "正在解析高德地址…";
  resultElement.className = "";

  try {
    let resolved = {
      ok: Boolean(local.coordinates || localAddress || local.name),
      coordinates: local.coordinates ? { lat: local.coordinates[0], lng: local.coordinates[1] } : null,
      name: local.name,
      address: localAddress,
      formattedAddress: localAddress,
      message: ""
    };
    if (local.amapUrl) {
      const response = await fetch("/api/amap/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, key: localStorage.getItem(AMAP_KEY_STORAGE) || "" })
      });
      const remote = await response.json().catch(() => ({}));
      if (!response.ok && !resolved.ok) throw new Error(remote.message || "高德链接解析失败");
      if (remote.ok) resolved = { ...resolved, ...remote };
    }
    applyAmapResult(type, text, resolved);
    if (resolved.coordinates && !amapPathFromResult(resolved) && !localStorage.getItem(AMAP_KEY_STORAGE)) {
      resultElement.textContent += "；如需自动反查省市区县，请在系统设置中配置高德 Web 服务 Key";
      resultElement.className = "warning";
    }
  } catch (error) {
    if (local.coordinates || localAddress || local.name) {
      applyAmapResult(type, text, {
        coordinates: local.coordinates ? { lat: local.coordinates[0], lng: local.coordinates[1] } : null,
        name: local.name,
        address: localAddress,
        formattedAddress: localAddress,
        message: error.message
      });
    } else {
      const message = error.message || "高德链接解析失败";
      const needsRestart = /Failed to fetch|接口不存在|JSON|Unexpected token/i.test(message);
      resultElement.textContent = `${message}${needsRestart ? "；若刚升级系统，请重新运行 start.ps1 后再试" : ""}`;
      resultElement.className = "warning";
      toast(resultElement.textContent, "warning");
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalButtonText;
    }
  }
}

function balanceOf(item) {
  return Math.max(0, item.amount - item.received);
}

function statusLabel(status) {
  return ({ pending: "待收款", partial: "部分收款", overdue: "已逾期", paid: "已结清", approved: "待付款", draft: "待审核", rejected: "已驳回" })[status] || status;
}

function daysBetween(dateString) {
  const today = new Date("2026-07-29T12:00:00");
  return Math.ceil((new Date(`${dateString}T12:00:00`) - today) / 86400000);
}

function dueText(item) {
  if (item.status === "paid") return { text: item.dueDate, cls: "" };
  const diff = daysBetween(item.dueDate);
  if (diff < 0) return { text: `${item.dueDate}（逾期${Math.abs(diff)}天）`, cls: "due-overdue" };
  if (diff <= 3) return { text: `${item.dueDate}（${diff === 0 ? "今天到期" : `${diff}天后`}）`, cls: "due-soon" };
  return { text: item.dueDate, cls: "" };
}

function metricCard(label, value, note, icon, color, soft) {
  return `<article class="metric-card" style="--card-color:${color};--card-soft:${soft}">
    <div class="metric-top"><span class="metric-label">${label}</span><span class="metric-icon">${icon}</span></div>
    <div class="metric-value">${value}</div><div class="metric-note">${note}</div>
  </article>`;
}

function totals() {
  const total = state.receivables.reduce((sum, item) => sum + item.amount, 0);
  const received = state.receivables.reduce((sum, item) => sum + item.received, 0);
  const balance = total - received;
  const overdue = state.receivables.filter(x => x.status === "overdue").reduce((sum, item) => sum + balanceOf(item), 0);
  return { total, received, balance, overdue };
}

function renderAll() {
  renderDashboard();
  renderWaybills();
  renderDispatch();
  renderPod();
  renderFleet();
  renderReceivables();
  renderPayables();
  renderCollections();
  renderPayments();
  renderReconciliation();
  renderCosts();
  renderCashflow();
  renderInvoices();
  renderCustomers();
  renderReports();
  document.getElementById("nav-overdue-count").textContent = state.receivables.filter(x => x.status === "overdue").length;
  document.getElementById("nav-dispatch-count").textContent = state.waybills.filter(x => x.status === "待调度").length;
}

function renderDashboard() {
  const t = totals();
  const unlocked = financeAccessGranted();
  document.getElementById("dashboard-finance-alert").hidden = !unlocked;
  document.getElementById("dashboard-finance-chart").hidden = !unlocked;
  document.getElementById("dashboard-finance-lower").hidden = !unlocked;
  document.getElementById("dashboard-finance-locked").hidden = true;
  document.getElementById("dashboard-metrics").innerHTML = (unlocked ? [
    metricCard("本月应收", formatMoney(t.total), `<strong class="up">↑ 12.8%</strong> 较上月`, "收", "#2563eb", "#eaf1ff"),
    metricCard("本月已收", formatMoney(t.received), `回款率 <strong class="up">${Math.round(t.received / t.total * 100)}%</strong>`, "✓", "#15966a", "#e8f8f1"),
    metricCard("逾期应收", formatMoney(t.overdue), `<strong class="down">${state.receivables.filter(x => x.status === "overdue").length} 笔</strong> 需要跟进`, "!", "#d64242", "#fff0f0"),
    metricCard("本月经营毛利", "¥286,430", `<strong class="up">↑ 8.4%</strong> 毛利率 21.6%`, "利", "#7c55c7", "#f2edff"),
  ] : [
    metricCard("本月运单", `${state.waybills.length} 票`, "运输业务正常运行", "单", "#2563eb", "#eaf1ff"),
    metricCard("待调度", `${state.waybills.filter(x => x.status === "待调度").length} 票`, "需要安排运力", "调", "#d97706", "#fff5df"),
    metricCard("运输中", `${state.waybills.filter(x => x.status === "运输中").length} 票`, "在途任务", "途", "#18a7b5", "#e8f9fb"),
    metricCard("已签收", `${state.waybills.filter(x => ["已签收", "已结算"].includes(x.status)).length} 票`, "等待回单归档", "签", "#15966a", "#e8f8f1"),
  ]).join("");

  if (unlocked) renderLineChart("cash");
  else document.getElementById("cashflow-chart").innerHTML = "";

  const todos = unlocked ? [
    { icon: "收", title: "即将到期应收", sub: "今天有3笔账款到期", count: 3, color: "#d64242", soft: "#fff0f0" },
    { icon: "付", title: "待审批付款", sub: "司机与承运商结算", count: 5, color: "#d97706", soft: "#fff5df" },
    { icon: "票", title: "待开票申请", sub: "客户已提交开票信息", count: 4, color: "#2563eb", soft: "#eaf1ff" },
    { icon: "认", title: "未认领流水", sub: "需要匹配业务单据", count: 2, color: "#7c55c7", soft: "#f2edff" },
  ] : [
    { icon: "调", title: "待调度运单", sub: "需要安排司机或车辆", count: state.waybills.filter(x => x.status === "待调度").length, color: "#d97706", soft: "#fff5df" },
    { icon: "途", title: "在途运输", sub: "关注运输节点", count: state.waybills.filter(x => x.status === "运输中").length, color: "#2563eb", soft: "#eaf1ff" },
    { icon: "签", title: "待回单任务", sub: "签收后及时归档", count: state.waybills.filter(x => x.status === "已签收").length, color: "#15966a", soft: "#e8f8f1" },
    { icon: "车", title: "空闲车辆", sub: "可用于新任务", count: state.vehicles.filter(x => x.status === "空闲").length, color: "#7c55c7", soft: "#f2edff" },
  ];
  document.getElementById("todo-list").innerHTML = todos.map(x => `<div class="todo-item" style="--item-color:${x.color};--item-soft:${x.soft}"><span class="todo-icon">${x.icon}</span><div><strong>${x.title}</strong><small>${x.sub}</small></div><b>${x.count}</b></div>`).join("");

  document.getElementById("risk-receivables").innerHTML = unlocked ? state.receivables
    .filter(x => x.status === "overdue")
    .sort((a, b) => balanceOf(b) - balanceOf(a))
    .slice(0, 4)
    .map(x => `<div class="compact-table-row"><div><strong>${x.customer}</strong><small>${x.billNo}</small></div><span class="status overdue">${Math.abs(daysBetween(x.dueDate))}天</span><b>${formatMoney(balanceOf(x))}</b></div>`)
    .join("") : "";

  document.getElementById("recent-activities").innerHTML = unlocked ? state.cashflows.slice(0, 4).map(x => `<div class="activity-item"><span class="activity-icon">${x.type === "in" ? "↙" : "↗"}</span><div><strong>${x.summary}</strong><small>${x.time} · ${x.account}</small></div><b class="${x.type === "in" ? "amount-in" : "amount-out"}">${x.type === "in" ? "+" : "-"}${formatMoney(x.amount)}</b></div>`).join("") : "";
}

function renderLineChart(mode) {
  const data = mode === "profit"
    ? { income: [18, 20, 22, 21, 25, 28], expense: [0, 0, 0, 0, 0, 0], max: 32 }
    : { income: [82, 96, 91, 113, 126, 138], expense: [65, 70, 69, 84, 91, 103], max: 150 };
  const labels = ["2月", "3月", "4月", "5月", "6月", "7月"];
  const w = 620, h = 210, px = 28, py = 18, cw = w - px * 2, ch = h - py * 2;
  const points = values => values.map((v, i) => `${px + i * cw / (values.length - 1)},${py + ch - v / data.max * ch}`).join(" ");
  const grid = [0, .25, .5, .75, 1].map(v => {
    const y = py + ch * v;
    return `<line class="chart-grid-line" x1="${px}" y1="${y}" x2="${w - px}" y2="${y}"/>`;
  }).join("");
  const xlabels = labels.map((x, i) => `<text class="chart-label" x="${px + i * cw / 5}" y="${h - 1}" text-anchor="middle">${x}</text>`).join("");
  const expenseLine = mode === "cash" ? `<polyline fill="none" stroke="#18a7b5" stroke-width="2.5" points="${points(data.expense)}"/>` : "";
  document.getElementById("cashflow-chart").innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${grid}<defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2563eb" stop-opacity=".23"/><stop offset="100%" stop-color="#2563eb" stop-opacity="0"/></linearGradient></defs><polygon fill="url(#areaGradient)" points="${px},${py + ch} ${points(data.income)} ${w - px},${py + ch}"/><polyline fill="none" stroke="#2563eb" stroke-width="3" points="${points(data.income)}"/>${expenseLine}${xlabels}</svg>`;
}

function normalizeWaybillSearch(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase()
    .replace(/^(?:运单号|订单号|单号)\s*[:：]?\s*/, "")
    .replace(/[\s·•\-—_:：/\\]+/g, "");
}

function extractWaybillNumber(value) {
  const normalized = String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "");
  const match = normalized.match(/WB(?:[\s·•\-—_:：/\\]*\d){8,14}/i)?.[0];
  return match ? `WB${match.slice(2).replace(/\D/g, "")}`.toUpperCase() : "";
}

function waybillMatchesSearch(item, search) {
  const haystack = normalizeWaybillSearch([
    item.no, item.date, item.customer, item.origin, item.originAddress, item.destination, item.destinationAddress,
    item.cargo, item.weight, item.driver, item.vehicle, item.team, item.status, item.revenue, item.cost
  ].filter(Boolean).join(" "));
  return !search || haystack.includes(search);
}

function filteredWaybills() {
  const rawSearch = document.getElementById("waybill-search")?.value || "";
  const search = normalizeWaybillSearch(extractWaybillNumber(rawSearch) || rawSearch);
  return state.waybills.filter(x => {
    const tabMatch = search || currentWaybillTab === "all" || x.status === currentWaybillTab;
    const searchMatch = waybillMatchesSearch(x, search);
    return tabMatch && searchMatch;
  });
}

function waybillStatusClass(status) {
  return ({ "待调度": "pending", "运输中": "partial", "已签收": "approved", "已结算": "paid", "已取消": "draft" })[status] || "draft";
}

function displayCargoWeight(value) {
  if (value === null || value === undefined || value === "") return "未填写重量";
  return typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value)) ? `${value} 吨` : String(value);
}

function renderWaybills() {
  const items = filteredWaybills();
  const unlocked = financeAccessGranted();
  const revenue = state.waybills.reduce((s, x) => s + x.revenue, 0);
  const profit = state.waybills.reduce((s, x) => s + x.revenue - x.cost, 0);
  document.getElementById("waybill-metrics").innerHTML = (unlocked ? [
    metricCard("本月运单", `${state.waybills.length} 票`, "较上月 ↑ 9.6%", "单", "#2563eb", "#eaf1ff"),
    metricCard("运输中", `${state.waybills.filter(x => x.status === "运输中").length} 票`, "节点正常 100%", "途", "#18a7b5", "#e8f9fb"),
    metricCard("运单收入", formatMoney(revenue), "数据联动应收", "收", "#15966a", "#e8f8f1"),
    metricCard("预估毛利", formatMoney(profit), `毛利率 ${Math.round(profit / revenue * 100)}%`, "利", "#7c55c7", "#f2edff"),
  ] : [
    metricCard("本月运单", `${state.waybills.length} 票`, "运输业务总量", "单", "#2563eb", "#eaf1ff"),
    metricCard("待调度", `${state.waybills.filter(x => x.status === "待调度").length} 票`, "待安排运力", "调", "#d97706", "#fff5df"),
    metricCard("运输中", `${state.waybills.filter(x => x.status === "运输中").length} 票`, "节点正常 100%", "途", "#18a7b5", "#e8f9fb"),
    metricCard("已完成", `${state.waybills.filter(x => ["已签收", "已结算"].includes(x.status)).length} 票`, "已签收或结算", "✓", "#15966a", "#e8f8f1"),
  ]).join("");
  document.getElementById("waybill-finance-column").hidden = !unlocked;
  document.getElementById("waybill-finance-column").textContent = "收入/成本";
  document.getElementById("waybill-sync-note").textContent = unlocked ? "数据变更实时同步应收、应付与利润" : "运输业务数据已同步更新";
  document.getElementById("waybill-result-count").textContent = `共 ${items.length} 条记录`;
  document.getElementById("waybill-table-body").innerHTML = items.length ? items.map(x => `<tr>
    <td><span class="cell-title">${x.no}</span><span class="cell-subtitle">${x.date}</span></td>
    <td><span class="cell-title">${x.customer}</span></td>
    <td><span class="cell-title">${x.origin} → ${x.destination}</span><span class="cell-subtitle">${x.distance || "—"} km · 干线运输</span></td>
    <td><span class="cell-title">${x.cargo}</span><span class="cell-subtitle">${displayCargoWeight(x.weight)}</span></td>
    <td>${x.driver || x.vehicle ? `<span class="cell-title">${x.driver || "未安排司机"}</span><span class="cell-subtitle">${x.vehicle || "未安排车辆"}</span>` : `<span class="cell-subtitle">待调度时补充</span>`}</td>
    ${unlocked ? `<td><span class="cell-title amount-in">${formatMoney(x.revenue)}</span><span class="cell-subtitle">成本 ${formatMoney(x.cost)}</span></td>` : ""}
    <td><span class="status ${waybillStatusClass(x.status)}">${x.status}</span></td>
    <td><div class="row-actions">${x.status === "待调度" ? `<button class="row-action primary" data-dispatch-waybill="${x.id}">派车</button>` : ""}<button class="row-action" data-action="waybill-detail">详情</button><button class="row-action" data-print-waybill="${x.id}">三联单</button></div></td>
  </tr>`).join("") : `<tr><td colspan="${unlocked ? 8 : 7}"><div class="empty-state"><strong>没有找到匹配的运单</strong><small>可粘贴完整运单号、客户、路线、司机或车牌号</small><button class="row-action" data-action="clear-waybill-search">清空查询</button></div></td></tr>`;
}

function dispatchCard(x) {
  const primary = x.status === "待调度"
    ? `<button class="row-action primary" data-dispatch-waybill="${x.id}">确认派车</button>`
    : x.status === "运输中"
      ? `<button class="row-action primary" data-advance-waybill="${x.id}">确认签收</button>`
      : `<button class="row-action primary" data-action="pod-upload">上传回单</button>`;
  const assignment = [x.driver, x.vehicle].filter(Boolean);
  return `<div class="dispatch-card"><div class="dispatch-card-head"><strong>${x.no}</strong><span class="status ${waybillStatusClass(x.status)}">${x.status}</span></div><h3>${x.customer}</h3><p>${x.origin} → ${x.destination} · ${x.distance || "—"}km · ${x.cargo}</p><div class="dispatch-meta">${assignment.length ? assignment.map(value => `<span>${value}</span>`).join("") : `<span>司机、车辆待安排</span>`}</div><div class="dispatch-actions">${primary}<button class="row-action" data-print-waybill="${x.id}">三联单</button></div></div>`;
}

function renderDispatch() {
  const pending = state.waybills.filter(x => x.status === "待调度");
  const transit = state.waybills.filter(x => x.status === "运输中");
  const signed = state.waybills.filter(x => x.status === "已签收");
  document.getElementById("dispatch-metrics").innerHTML = [
    metricCard("待调度", `${pending.length} 票`, "需安排车辆", "调", "#d97706", "#fff5df"),
    metricCard("运输中", `${transit.length} 票`, "节点正常", "途", "#2563eb", "#eaf1ff"),
    metricCard("已签收", `${signed.length} 票`, "待回单/结算", "签", "#15966a", "#e8f8f1"),
    metricCard("今日发车", "4 票", "准点率 96%", "发", "#7c55c7", "#f2edff"),
  ].join("");
  document.getElementById("dispatch-pending-count").textContent = pending.length;
  document.getElementById("dispatch-transit-count").textContent = transit.length;
  document.getElementById("dispatch-signed-count").textContent = signed.length;
  document.getElementById("dispatch-pending-list").innerHTML = pending.map(dispatchCard).join("") || `<div class="empty-state">暂无待调度运单</div>`;
  document.getElementById("dispatch-transit-list").innerHTML = transit.map(dispatchCard).join("") || `<div class="empty-state">暂无在途运单</div>`;
  document.getElementById("dispatch-signed-list").innerHTML = signed.map(dispatchCard).join("") || `<div class="empty-state">暂无已签收运单</div>`;
}

function renderPod() {
  const signed = state.waybills.filter(x => ["已签收", "已结算"].includes(x.status));
  document.getElementById("pod-metrics").innerHTML = [
    metricCard("待签收", `${state.waybills.filter(x => x.status === "运输中").length} 票`, "在途待完成", "待", "#d97706", "#fff5df"),
    metricCard("今日签收", "3 票", "全部正常", "签", "#15966a", "#e8f8f1"),
    metricCard("待回单", `${signed.filter(x => x.status === "已签收").length} 票`, "平均1.4天", "回", "#2563eb", "#eaf1ff"),
    metricCard("异常签收", "1 票", "破损待核实", "!", "#d64242", "#fff0f0"),
  ].join("");
  document.getElementById("pod-table-body").innerHTML = signed.map((x, i) => `<tr><td><span class="cell-title">${x.no}</span><span class="cell-subtitle">${x.date}</span></td><td><span class="cell-title">${x.customer}</span><span class="cell-subtitle">${x.origin} → ${x.destination}</span></td><td><span class="cell-title">${i ? "刘女士" : "陈主管"}</span><span class="cell-subtitle">2026-07-${i ? "22" : "24"} 16:20</span></td><td><span class="status paid">正常签收</span></td><td><span class="status ${x.status === "已结算" ? "paid" : "pending"}">${x.status === "已结算" ? "已归档" : "待寄回"}</span></td><td><button class="row-action primary" data-action="pod-upload">${x.status === "已结算" ? "查看回单" : "上传回单"}</button></td></tr>`).join("");
}

function renderFleet() {
  const search = document.getElementById("vehicle-search")?.value.trim().toLowerCase() || "";
  const items = state.vehicles.filter(x => !search || [x.plate, x.type, x.team, x.source].some(v => String(v).toLowerCase().includes(search)));
  document.getElementById("fleet-metrics").innerHTML = [
    metricCard("车辆总数", `${state.vehicles.length} 辆`, "车辆独立建档", "车", "#2563eb", "#eaf1ff"),
    metricCard("空闲车辆", `${state.vehicles.filter(x => x.status === "空闲").length} 辆`, "可立即调度", "闲", "#15966a", "#e8f8f1"),
    metricCard("运输中", `${state.vehicles.filter(x => x.status === "运输中").length} 辆`, "司机按任务关联", "途", "#d97706", "#fff5df"),
    metricCard("合作车队", `${state.teams.length} 个`, `${state.teams.reduce((s, x) => s + x.vehicles, 0)} 辆可调运力`, "队", "#7c55c7", "#f2edff"),
  ].join("");
  document.getElementById("vehicle-table-body").innerHTML = items.map(x => `<tr>
    <td><span class="cell-title">${x.plate}</span><span class="cell-subtitle">${x.source}</span></td>
    <td>${x.type}</td><td><strong>${x.length} 米</strong></td><td>${x.capacity} 吨</td>
    <td>${x.team || "公司自有"}</td><td>${x.taskDriver || `<span class="cell-subtitle">未绑定，调度时选择</span>`}</td>
    <td><span class="status ${x.status === "空闲" ? "paid" : "partial"}">${x.status}</span></td>
    <td><button class="row-action">编辑</button></td>
  </tr>`).join("");
  document.getElementById("team-list").innerHTML = state.teams.map(x => `<div class="team-item"><div><strong>${x.name}</strong><b>${x.vehicles} 辆</b></div><p>${x.contact}</p></div>`).join("");
}

function moneyUppercase(value) {
  const amount = Math.round((Number(value) || 0) * 100);
  if (!amount) return "零元整";
  const digits = "零壹贰叁肆伍陆柒捌玖";
  const units = ["分", "角", "元", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万"];
  let result = "";
  let zero = false;
  String(amount).split("").reverse().forEach((character, index) => {
    const digit = Number(character);
    const unit = units[index] || "";
    if (digit) {
      result = `${digits[digit]}${unit}${zero ? "零" : ""}${result}`;
      zero = false;
    } else {
      zero = index > 1 && !["万", "亿"].includes(unit);
      if (["元", "万", "亿"].includes(unit) && !result.startsWith(unit)) result = `${unit}${result}`;
    }
  });
  return result
    .replace(/零+/g, "零")
    .replace(/零(万|亿)/g, "$1")
    .replace(/亿万/g, "亿")
    .replace(/零元/g, "元")
    .replace(/元$/, "元整");
}

function printValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") return "—";
  return `${value}${suffix}`;
}

function waybillCopyHtml(item, copyName, copyColor) {
  const vehicle = state.vehicles.find(x => x.plate === item.vehicle);
  const vehicleType = item.vehicleType || vehicle?.type || "";
  const vehicleLength = item.vehicleLength || vehicle?.length || "";
  const team = item.team || vehicle?.team || "";
  const freight = Number(item.freight ?? item.revenue) || 0;
  const insuranceFee = Number(item.insuranceFee) || 0;
  const loadingFee = Number(item.loadingFee) || 0;
  const upstairsFee = Number(item.upstairsFee) || 0;
  const otherFee = Number(item.otherFee) || 0;
  const total = Number(item.revenue) || freight + insuranceFee + loadingFee + upstairsFee + otherFee;
  const isAccounting = copyName === "第三联 · 记账留存";
  const isDriver = copyName === "第二联 · 司机留存";
  const assignmentFields = [
    item.driver ? `<div class="waybill-other-cell"><span>司机</span><strong>${item.driver}${item.driverPhone ? ` · ${item.driverPhone}` : ""}</strong></div>` : "",
    item.vehicle ? `<div class="waybill-other-cell"><span>车辆</span><strong>${item.vehicle}${vehicleType || vehicleLength ? ` · ${[vehicleType, vehicleLength ? `${vehicleLength}米` : ""].filter(Boolean).join(" / ")}` : ""}</strong></div>` : "",
    team ? `<div class="waybill-other-cell"><span>承运车队</span><strong>${team}</strong></div>` : ""
  ].filter(Boolean).join("");
  const copyAmount = isDriver ? Number(item.cost) || 0 : total;
  const copyAmountLabel = isDriver ? "承运结算" : isAccounting ? "客户应收" : "客户应付";
  const accountingLine = isAccounting
    ? `<div class="accounting-summary"><span>承运成本 <strong>${formatMoney(item.cost)}</strong></span><span>预估毛利 <strong>${formatMoney(total - (Number(item.cost) || 0))}</strong></span></div>`
    : "";
  const thirdSignature = isDriver ? "司机签字" : isAccounting ? "财务复核" : "收货人签收";

  return `<section class="waybill-copy ${isAccounting ? "is-accounting-copy" : isDriver ? "is-driver-copy" : "is-customer-copy"}" data-copy="${copyName}" style="--copy-color:${copyColor}">
    <div class="waybill-copy-head">
      <div class="waybill-title"><h3>榭尔物流运输单</h3><p>客户、司机、记账三联统一编号 · 运单全程可追溯</p></div>
      <div class="waybill-copy-no"><span>运单编号</span><strong>${item.no}</strong><small>开单：2026-${String(item.date).replace(" ", " · ")}</small></div>
    </div>
    <div class="waybill-party-columns">
      <section class="waybill-party sender-party"><h4>发货人 / 发货公司</h4><strong class="party-name">${item.customer || item.senderContact || "—"}</strong><div class="party-line"><span>联系人</span><b>${item.senderContact || "—"}</b></div><div class="party-line"><span>电话</span><b>${item.senderPhone || "—"}</b></div><div class="party-line address"><span>装货地址</span><b>${item.origin || ""}${item.originAddress ? ` ${item.originAddress}` : ""}</b></div></section>
      <section class="waybill-party receiver-party"><h4>收货人</h4><strong class="party-name">${item.receiverContact || "—"}</strong><div class="party-line"><span>电话</span><b>${item.receiverPhone || "—"}</b></div><div class="party-line address"><span>卸货地址</span><b>${item.destination || ""}${item.destinationAddress ? ` ${item.destinationAddress}` : ""}</b></div></section>
    </div>
    <div class="waybill-other-info">
      <div class="waybill-other-cell"><span>运输里程</span><strong>约 ${item.distance || "—"} km</strong></div>
      <div class="waybill-other-cell"><span>承运方式</span><strong>${item.carrierMode || "公路运输"}</strong></div>
      ${assignmentFields}
    </div>
    <table class="cargo-print-table"><thead><tr><th>货物名称</th><th>包装</th><th>件数</th><th>重量</th><th>体积</th><th>声明价值</th></tr></thead><tbody><tr><td>${item.cargo || "—"}</td><td>${item.packaging || "—"}</td><td>${printValue(item.pieces, " 件")}</td><td>${item.weight === null || item.weight === undefined || item.weight === "" ? "—" : displayCargoWeight(item.weight)}</td><td>${printValue(item.volume, " m³")}</td><td>${item.declaredValue ? formatMoney(item.declaredValue) : "—"}</td></tr></tbody></table>
    <div class="settlement-print"><div><span>付款方式</span><strong>${item.paymentMethod || "欠付"}</strong></div><div><span>结算方式</span><strong>${item.settlementMethod || "月结"}</strong></div><div><span>交付方式</span><strong>${item.deliveryMethod || "送货"}</strong></div></div>
    <table class="fee-print-table"><thead><tr><th>基础运费</th><th>保险费</th><th>装卸费</th><th>上楼费</th><th>其他费用</th><th>费用合计</th></tr></thead><tbody><tr><td>${formatMoney(freight)}</td><td>${formatMoney(insuranceFee)}</td><td>${formatMoney(loadingFee)}</td><td>${formatMoney(upstairsFee)}</td><td>${formatMoney(otherFee)}</td><td><strong>${formatMoney(total)}</strong></td></tr></tbody></table>
    <div class="amount-print-line"><span>${copyAmountLabel}</span><strong>${formatMoney(copyAmount)}</strong><b>人民币大写：${moneyUppercase(copyAmount)}</b></div>
    <div class="remarks-print"><strong>运输备注 / 异常记录</strong><span></span><span></span><span></span></div>
    ${accountingLine}
    <div class="terms-print"><strong>约定事项</strong><ol><li>托运人应如实申报货物名称、数量、重量、包装和价值，不得夹带禁限运物品。</li><li>收货人签收前应核对货物外包装及数量，异常、货损或拒收须当场注明。</li><li>因包装不当、自然损耗或货物自身性质导致的损失，按双方约定处理。</li><li>运费、附加费及承运结算金额以本单记录和双方确认结果为准。</li><li>本单经托运、承运或收货相关方签字盖章后，作为运输及结算凭证。</li></ol></div>
    <div class="signature-print"><span>托运人签字：____________</span><span>承运人盖章：____________</span><span>${thirdSignature}：____________</span></div>
    <div class="company-print-footer"><span>榭尔物流</span><span>服务电话：400-888-6688</span><span>地址：上海市浦东新区申江路物流园</span></div>
  </section>`;
}

function showTriplicate(id) {
  const item = state.waybills.find(x => x.id === Number(id));
  if (!item) return;
  document.getElementById("triplicate-content").innerHTML = [
    waybillCopyHtml(item, "第一联 · 客户留存", "#2563eb"),
    waybillCopyHtml(item, "第二联 · 司机留存", "#d97706"),
    waybillCopyHtml(item, "第三联 · 记账留存", "#15966a")
  ].join("");
  openModal("triplicate-modal");
}

function filteredReceivables() {
  const search = document.getElementById("receivable-search")?.value.trim().toLowerCase() || "";
  const aging = document.getElementById("receivable-aging")?.value || "all";
  return state.receivables.filter(item => {
    const tabMatch = currentReceivableTab === "all" || item.status === currentReceivableTab;
    const searchMatch = !search || [item.billNo, item.customer, item.waybill].some(v => v.toLowerCase().includes(search));
    const diff = daysBetween(item.dueDate);
    const age = diff >= 0 ? "current" : Math.abs(diff) <= 30 ? "1-30" : Math.abs(diff) <= 60 ? "31-60" : "60+";
    const agingMatch = aging === "all" || age === aging;
    return tabMatch && searchMatch && agingMatch;
  });
}

function renderCollections() {
  const t = totals();
  document.getElementById("collection-metrics").innerHTML = [
    metricCard("应收总额", formatMoney(t.total), `${state.receivables.length} 笔账款`, "总", "#2563eb", "#eaf1ff"),
    metricCard("累计已收", formatMoney(t.received), `回款率 ${Math.round(t.received / t.total * 100)}%`, "收", "#15966a", "#e8f8f1"),
    metricCard("待收余额", formatMoney(t.balance), "建议按账龄跟进", "待", "#d97706", "#fff5df"),
    metricCard("逾期金额", formatMoney(t.overdue), `${state.receivables.filter(x => x.status === "overdue").length} 笔逾期`, "!", "#d64242", "#fff0f0"),
  ].join("");
  const search = document.getElementById("collection-search")?.value.trim().toLowerCase() || "";
  const items = state.receivables.filter(x => !search || [x.billNo, x.waybill, x.customer].some(v => v.toLowerCase().includes(search)));
  document.getElementById("collection-table-body").innerHTML = items.map(x => `<tr><td><span class="cell-title">${x.billNo}</span><span class="cell-subtitle">${x.waybill}</span></td><td>${x.customer}</td><td class="money">${formatMoney(x.amount)}</td><td class="amount-in">${formatMoney(x.received)}</td><td class="money-balance">${formatMoney(balanceOf(x))}</td><td>${dueText(x).text}</td><td><span class="status ${x.status}">${statusLabel(x.status)}</span></td><td>${x.status === "paid" ? `<span class="status paid">已核销</span>` : `<button class="row-action primary" data-payment-id="${x.id}">回款</button>`}</td></tr>`).join("");
}

function renderPayments() {
  const total = state.payables.reduce((s, x) => s + x.amount, 0);
  const paid = state.payables.reduce((s, x) => s + (x.paid || 0), 0);
  const balance = total - paid;
  document.getElementById("payment-metrics").innerHTML = [
    metricCard("应付总额", formatMoney(total), `${state.payables.length} 笔结算`, "总", "#2563eb", "#eaf1ff"),
    metricCard("累计已付", formatMoney(paid), `付款率 ${Math.round(paid / total * 100)}%`, "付", "#15966a", "#e8f8f1"),
    metricCard("待付余额", formatMoney(balance), "按计划付款", "待", "#d97706", "#fff5df"),
    metricCard("本周到期", "¥104,900", "3 笔需审批", "期", "#d64242", "#fff0f0"),
  ].join("");
  document.getElementById("payment-table-body").innerHTML = state.payables.map((x, i) => {
    const remain = x.amount - (x.paid || 0);
    const label = remain === 0 ? "已结清" : (x.paid || 0) > 0 ? "部分付款" : x.status === "draft" ? "待审核" : "待付款";
    const cls = remain === 0 ? "paid" : (x.paid || 0) > 0 ? "partial" : x.status === "draft" ? "draft" : "pending";
    return `<tr><td><span class="cell-title">${x.no}</span><span class="cell-subtitle">${x.type}</span></td><td>${x.party}</td><td class="money">${formatMoney(x.amount)}</td><td class="amount-in">${formatMoney(x.paid || 0)}</td><td class="money-balance">${formatMoney(remain)}</td><td>${x.due}</td><td><span class="status ${cls}">${label}</span></td><td>${remain ? `<button class="row-action primary" data-payable-pay="${i}">付款</button>` : `<span class="status paid">已核销</span>`}</td></tr>`;
  }).join("");
}

function renderReconciliation() {
  const total = state.reconciliations.reduce((s, x) => s + x.amount, 0);
  const diff = state.reconciliations.reduce((s, x) => s + Math.abs(x.amount - x.confirmed), 0);
  document.getElementById("reconciliation-metrics").innerHTML = [
    metricCard("对账单", `${state.reconciliations.length} 张`, "本月累计", "单", "#2563eb", "#eaf1ff"),
    metricCard("待处理", `${state.reconciliations.filter(x => x.status !== "已确认").length} 张`, "草稿或已发送", "待", "#d97706", "#fff5df"),
    metricCard("对账金额", formatMoney(total), "覆盖 19 票运单", "额", "#15966a", "#e8f8f1"),
    metricCard("未结差额", formatMoney(diff), "1 笔待确认", "差", "#d64242", "#fff0f0"),
  ].join("");
  document.getElementById("reconciliation-table-body").innerHTML = state.reconciliations.map(x => {
    const delta = x.amount - x.confirmed;
    const cls = x.status === "已确认" ? "paid" : x.status === "已发送" ? "partial" : "draft";
    return `<tr><td><span class="cell-title">${x.no}</span></td><td>${x.customer}</td><td>${x.period}</td><td>${x.count}票</td><td class="money">${formatMoney(x.amount)}</td><td>${formatMoney(x.confirmed)}</td><td class="${delta ? "money-balance" : "amount-in"}">${formatMoney(delta)}</td><td><span class="status ${cls}">${x.status}</span></td><td><button class="row-action">${x.status === "草稿" ? "编辑" : "查看"}</button></td></tr>`;
  }).join("");
}

function renderCosts() {
  const total = state.costs.reduce((s, x) => s + x.amount, 0);
  const types = ["油费", "过路费", "维修费", "装卸费", "罚款", "其他"];
  document.getElementById("cost-metrics").innerHTML = [
    metricCard("费用总额", formatMoney(total), `${state.costs.length} 笔记录`, "总", "#2563eb", "#eaf1ff"),
    metricCard("本月费用", formatMoney(total), "较上月 ↓ 3.1%", "月", "#15966a", "#e8f8f1"),
    metricCard("待审核", formatMoney(state.costs.filter(x => x.status === "待审核").reduce((s, x) => s + x.amount, 0)), "1 笔申请", "审", "#d97706", "#fff5df"),
    metricCard("单票均摊", formatMoney(total / Math.max(1, state.waybills.length)), "自动归集", "均", "#7c55c7", "#f2edff"),
  ].join("");
  document.getElementById("cost-type-grid").innerHTML = types.map(type => {
    const items = state.costs.filter(x => x.type === type);
    const amount = items.reduce((s, x) => s + x.amount, 0);
    return `<article class="cost-type-card"><span>${type}</span><strong>${formatMoney(amount)}</strong><small>${items.length} 笔</small></article>`;
  }).join("");
  document.getElementById("cost-table-body").innerHTML = state.costs.map(x => `<tr><td>${x.date}</td><td>${x.driver}</td><td><span class="cell-title">${x.waybill || "未关联"}</span></td><td>${x.type}</td><td class="money">${formatMoney(x.amount)}</td><td>${x.location}</td><td>${x.voucher || "—"}</td><td><span class="status ${x.status === "已入账" ? "paid" : "pending"}">${x.status}</span></td></tr>`).join("");
}

function renderReceivables() {
  const t = totals();
  document.getElementById("receivable-metrics").innerHTML = [
    metricCard("应收余额", formatMoney(t.balance), `${state.receivables.filter(x => x.status !== "paid").length} 笔未结`, "余", "#2563eb", "#eaf1ff"),
    metricCard("逾期金额", formatMoney(t.overdue), `占余额 ${Math.round(t.overdue / t.balance * 100)}%`, "!", "#d64242", "#fff0f0"),
    metricCard("7日内到期", "¥125,600", "3 笔需跟进", "期", "#d97706", "#fff5df"),
    metricCard("本月回款率", `${Math.round(t.received / t.total * 100)}%`, "目标 75%", "率", "#15966a", "#e8f8f1"),
  ].join("");

  const items = filteredReceivables();
  document.getElementById("tab-count-all").textContent = state.receivables.length;
  document.getElementById("receivable-result-count").textContent = `共 ${items.length} 条记录`;
  document.getElementById("receivable-table-body").innerHTML = items.length ? items.map(item => {
    const due = dueText(item);
    return `<tr>
      <td><span class="cell-title">${item.billNo}</span><span class="cell-subtitle">运单 ${item.waybill}</span></td>
      <td><span class="cell-title">${item.customer}</span><span class="cell-subtitle">${item.note}</span></td>
      <td><span class="money">${formatMoney(item.amount)}</span></td>
      <td><span class="cell-title">${formatMoney(item.received)}</span><span class="cell-subtitle money-balance">未收 ${formatMoney(balanceOf(item))}</span></td>
      <td><span class="${due.cls}">${due.text}</span></td>
      <td><span class="status ${item.status}">${statusLabel(item.status)}</span></td>
      <td><div class="row-actions"><button class="row-action" data-detail-id="${item.id}">详情</button>${item.status !== "paid" ? `<button class="row-action primary" data-payment-id="${item.id}">登记收款</button>` : ""}</div></td>
    </tr>`;
  }).join("") : `<tr><td colspan="7"><div class="empty-state"><strong>没有匹配的应收记录</strong>请调整筛选条件后再试。</div></td></tr>`;
}

function renderPayables() {
  const total = state.payables.reduce((s, x) => s + x.amount, 0);
  document.getElementById("payable-metrics").innerHTML = [
    metricCard("应付余额", formatMoney(total), `${state.payables.length} 笔结算`, "付", "#2563eb", "#eaf1ff"),
    metricCard("待审批", "¥81,400", "2 笔申请", "审", "#d97706", "#fff5df"),
    metricCard("7日内待付", "¥104,900", "3 笔到期", "期", "#d64242", "#fff0f0"),
    metricCard("本月已付", "¥426,800", "较上月 ↑ 6.2%", "✓", "#15966a", "#e8f8f1"),
  ].join("");
  document.getElementById("payable-table-body").innerHTML = state.payables.map(x => `<tr><td><span class="cell-title">${x.no}</span><span class="cell-subtitle">创建于 07-28</span></td><td><span class="cell-title">${x.party}</span></td><td>${x.type}</td><td class="money">${formatMoney(x.amount)}</td><td>${x.due}</td><td><span class="status ${x.status}">${statusLabel(x.status)}</span></td><td><button class="row-action">查看</button></td></tr>`).join("");
}

function renderCashflow() {
  const accounts = [
    { name: "招商银行", suffix: "尾号 8890", amount: 638420, color: "#c62828", today: "+¥42,000" },
    { name: "建设银行", suffix: "尾号 1028", amount: 286190, color: "#1765ae", today: "-¥18,600" },
    { name: "微信商户账户", suffix: "企业收款", amount: 45380, color: "#15966a", today: "+¥6,800" },
  ];
  document.getElementById("account-grid").innerHTML = accounts.map(x => `<article class="account-card"><div class="account-head"><span class="bank-mark" style="--bank-color:${x.color}">${x.name[0]}</span><div><strong>${x.name}</strong><small>${x.suffix}</small></div></div><h3>${formatMoney(x.amount)}</h3><div class="account-meta"><span>可用余额</span><strong class="${x.today.startsWith("+") ? "amount-in" : "amount-out"}">今日 ${x.today}</strong></div></article>`).join("");
  document.getElementById("cashflow-table-body").innerHTML = state.cashflows.map(x => `<tr><td>${x.time}</td><td>${x.account}</td><td><span class="cell-title">${x.summary}</span></td><td>${x.relation}</td><td class="${x.type === "in" ? "amount-in" : "amount-out"}">${x.type === "in" ? "+" : "-"}${formatMoney(x.amount)}</td><td><span class="status ${x.matched ? "paid" : "pending"}">${x.matched ? "已核销" : "待认领"}</span></td></tr>`).join("");
}

function renderInvoices() {
  document.getElementById("invoice-metrics").innerHTML = [
    metricCard("本月销项", "¥486,300", "已开 12 张", "销", "#2563eb", "#eaf1ff"),
    metricCard("待开票", "¥207,100", "4 笔申请", "待", "#d97706", "#fff5df"),
    metricCard("本月进项", "¥328,600", "已认证 9 张", "进", "#15966a", "#e8f8f1"),
    metricCard("缺票金额", "¥86,400", "3 笔待收", "!", "#d64242", "#fff0f0"),
  ].join("");
  document.getElementById("invoice-table-body").innerHTML = state.invoices.map(x => `<tr><td><span class="cell-title">${x.no}</span></td><td>${x.party}</td><td>${x.type}</td><td class="money">${formatMoney(x.amount)}</td><td>${x.date}</td><td><span class="status ${x.status}">${x.status === "pending" ? "待开票" : x.status === "approved" ? "已开票" : x.status === "draft" ? "进项待收" : "已完成"}</span></td><td><button class="row-action">查看</button></td></tr>`).join("");
}

function renderCustomers() {
  const search = document.getElementById("customer-search")?.value.trim().toLowerCase() || "";
  const items = state.customers.filter(x => !search || `${x.name}${x.contact}`.toLowerCase().includes(search));
  document.getElementById("customer-grid").innerHTML = items.map(x => `<article class="customer-card"><div class="customer-head"><span class="customer-logo" style="--logo-color:${x.color};--logo-soft:${x.soft}">${x.name[0]}</span><div><h3>${x.name}</h3><p>${x.contact}</p></div><span class="customer-level">${x.level}</span></div><div class="customer-stats"><div><span>本月收入</span><strong>${formatMoney(x.revenue)}</strong></div><div><span>应收余额</span><strong class="${x.balance ? "money-balance" : ""}">${formatMoney(x.balance)}</strong></div><div><span>账期</span><strong>${x.days}天</strong></div></div><div class="customer-contact"><span>信用状态：${x.balance > 80000 ? "需关注" : "正常"}</span><button class="text-button">查看档案 →</button></div></article>`).join("");
}

function renderReports() {
  document.getElementById("report-metrics").innerHTML = [
    metricCard("营业收入", "¥1,326,800", "较上月 ↑ 12.8%", "营", "#2563eb", "#eaf1ff"),
    metricCard("直接成本", "¥1,040,370", "成本率 78.4%", "本", "#d97706", "#fff5df"),
    metricCard("经营毛利", "¥286,430", "毛利率 21.6%", "利", "#15966a", "#e8f8f1"),
    metricCard("单票毛利", "¥420", "本月 682 票", "票", "#7c55c7", "#f2edff"),
  ].join("");

  const bars = state.customers.slice(0, 5);
  const max = Math.max(...bars.map(x => x.revenue));
  document.getElementById("customer-bar-chart").innerHTML = bars.map(x => `<div class="bar-row"><label>${x.name.replace("有限公司", "")}</label><div class="bar-track"><i style="width:${x.revenue / max * 100}%"></i></div><strong>${formatMoney(x.revenue)}</strong></div>`).join("");
  document.getElementById("aging-donut").innerHTML = `<div class="donut"><div class="donut-center"><strong>¥582.6k</strong><span>应收余额</span></div></div><div class="donut-legend"><div><span><i style="background:#2563eb"></i>未到期</span><strong>48%</strong></div><div><span><i style="background:#18a7b5"></i>1—30天</span><strong>22%</strong></div><div><span><i style="background:#d97706"></i>31—60天</span><strong>18%</strong></div><div><span><i style="background:#d64242"></i>60天以上</span><strong>12%</strong></div></div>`;
  const routes = [
    ["上海—杭州", 186, 368600, 278900, 89700, "24.3%", "↑ 8.2%"],
    ["苏州—宁波", 142, 286400, 226300, 60100, "21.0%", "↑ 3.6%"],
    ["上海—合肥", 121, 241800, 196100, 45700, "18.9%", "↓ 1.2%"],
    ["无锡—上海", 108, 198600, 158800, 39800, "20.0%", "↑ 2.4%"],
  ];
  document.getElementById("route-report-body").innerHTML = routes.map(x => `<tr><td><span class="cell-title">${x[0]}</span></td><td>${x[1]}票</td><td class="money">${formatMoney(x[2])}</td><td>${formatMoney(x[3])}</td><td class="amount-in">${formatMoney(x[4])}</td><td>${x[5]}</td><td class="${x[6].startsWith("↑") ? "amount-in" : "amount-out"}">${x[6]}</td></tr>`).join("");
}

function financeAccessGranted() {
  return sessionStorage.getItem(FINANCE_SESSION_KEY) === "granted";
}

function accountAccessGranted() {
  return sessionStorage.getItem(ACCOUNT_SESSION_KEY) === ACCOUNT_EMAIL;
}

function updateAccountAccessUI() {
  const loggedIn = accountAccessGranted();
  const shell = document.getElementById("app-shell");
  const loginScreen = document.getElementById("account-login-screen");
  if (shell) shell.hidden = !loggedIn;
  if (loginScreen) loginScreen.hidden = loggedIn;
  document.body.classList.toggle("account-authenticated", loggedIn);
  if (!loggedIn) {
    const menu = document.getElementById("account-menu");
    if (menu) menu.hidden = true;
    window.setTimeout(() => document.getElementById("account-email")?.focus(), 50);
  }
}

function logoutAccount() {
  sessionStorage.removeItem(ACCOUNT_SESSION_KEY);
  sessionStorage.removeItem(FINANCE_SESSION_KEY);
  pendingFinanceView = null;
  closeAllOverlays();
  history.replaceState(null, "", `${location.pathname}${location.search}#dashboard`);
  updateFinanceAccessUI();
  renderDashboard();
  renderWaybills();
  updateAccountAccessUI();
  const form = document.getElementById("account-login-form");
  if (form) form.reset();
  document.getElementById("account-login-error").textContent = "";
}

function updateFinanceAccessUI() {
  const unlocked = financeAccessGranted();
  const button = document.getElementById("finance-session-button");
  const status = document.getElementById("finance-nav-status");
  const financeLabel = document.querySelector(".finance-nav-label");
  if (button) {
    button.classList.toggle("unlocked", unlocked);
    button.innerHTML = unlocked
      ? `<span>✓</span><strong>退出财务模式</strong>`
      : `<span>🔐</span><strong>登录财务中心</strong>`;
    button.title = unlocked ? "点击退出财务模式" : "点击验证财务专属密钥";
    button.setAttribute("aria-label", unlocked ? "退出财务模式" : "登录财务中心");
  }
  if (financeLabel) financeLabel.hidden = !unlocked;
  if (status) {
    status.textContent = unlocked ? "已授权" : "未授权";
    status.classList.toggle("unlocked", unlocked);
  }
  document.querySelectorAll(".finance-restricted").forEach(item => {
    item.hidden = !unlocked;
    item.classList.toggle("finance-unlocked", unlocked);
  });
  document.getElementById("global-search").placeholder = unlocked
    ? "搜索客户、运单号、账单号…"
    : "搜索客户、运单号…";
  updateWaybillFinanceAccess();
}

function showFinanceLogin(view = null) {
  pendingFinanceView = view && FINANCE_VIEWS.has(view) ? view : null;
  const form = document.getElementById("finance-auth-form");
  form.reset();
  document.getElementById("finance-auth-error").textContent = "";
  openModal("finance-auth-modal");
  window.setTimeout(() => document.getElementById("finance-key-input").focus(), 80);
}

function activateView(target) {
  document.querySelectorAll(".view").forEach(x => x.classList.toggle("active", x.dataset.viewPanel === target));
  document.querySelectorAll(".nav-item").forEach(x => x.classList.toggle("active", x.dataset.view === target));
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("show");
  window.scrollTo({ top: 0 });
}

function navigate(view, updateHash = false) {
  if (!accountAccessGranted()) {
    updateAccountAccessUI();
    return false;
  }
  const target = document.querySelector(`[data-view-panel="${view}"]`) ? view : "dashboard";
  if (FINANCE_VIEWS.has(target) && !financeAccessGranted()) {
    const current = document.querySelector(".view.active")?.dataset.viewPanel;
    const fallback = current && !FINANCE_VIEWS.has(current) ? current : "dashboard";
    activateView(fallback);
    history.replaceState(null, "", `#${fallback}`);
    showFinanceLogin(target);
    return false;
  }
  activateView(target);
  if (updateHash && location.hash !== `#${target}`) history.pushState(null, "", `#${target}`);
  return true;
}

function openModal(id) {
  closeAllOverlays();
  document.getElementById("modal-backdrop").classList.add("show");
  document.getElementById(id).classList.add("show");
}

function closeAllOverlays() {
  document.querySelectorAll(".modal").forEach(x => x.classList.remove("show"));
  document.getElementById("modal-backdrop").classList.remove("show");
  document.getElementById("detail-drawer").classList.remove("show");
}

function showPayment(id) {
  const item = state.receivables.find(x => x.id === Number(id));
  if (!item) return;
  currentReceivableId = item.id;
  const form = document.getElementById("payment-form");
  form.receivableId.value = item.id;
  form.paymentAmount.value = balanceOf(item);
  form.paymentAmount.max = balanceOf(item);
  form.paymentDate.value = "2026-07-28";
  document.getElementById("payment-context").innerHTML = `<strong>${item.customer}</strong><br>${item.billNo} · 未收余额 ${formatMoney(balanceOf(item))}`;
  openModal("payment-modal");
}

function showDetail(id) {
  const item = state.receivables.find(x => x.id === Number(id));
  if (!item) return;
  currentReceivableId = item.id;
  document.getElementById("drawer-title").textContent = item.billNo;
  document.getElementById("drawer-content").innerHTML = `
    <div class="detail-summary"><div class="detail-stat"><span>应收金额</span><strong>${formatMoney(item.amount)}</strong></div><div class="detail-stat"><span>未收余额</span><strong class="money-balance">${formatMoney(balanceOf(item))}</strong></div></div>
    <div class="detail-section"><h3>账单信息</h3><div class="detail-line"><span>客户</span><strong>${item.customer}</strong></div><div class="detail-line"><span>关联运单</span><strong>${item.waybill}</strong></div><div class="detail-line"><span>费用说明</span><strong>${item.note}</strong></div><div class="detail-line"><span>到期日</span><strong>${dueText(item).text}</strong></div><div class="detail-line"><span>状态</span><span class="status ${item.status}">${statusLabel(item.status)}</span></div></div>
    <div class="detail-section"><h3>处理记录</h3><div class="timeline-item"><strong>系统生成应收账单</strong><span>${item.createdAt} · 来源于运单结算</span></div>${item.received ? `<div class="timeline-item"><strong>已登记收款 ${formatMoney(item.received)}</strong><span>2026-07-28 · 招商银行 · 自动核销</span></div>` : ""}<div class="timeline-item"><strong>${item.status === "overdue" ? "账款已逾期，进入重点跟进" : "等待客户付款"}</strong><span>系统自动更新账款状态</span></div></div>
    <div class="drawer-actions"><button class="secondary-button">下载对账单</button>${item.status !== "paid" ? `<button class="primary-button" data-drawer-payment="${item.id}">登记收款</button>` : ""}</div>`;
  document.getElementById("modal-backdrop").classList.add("show");
  document.getElementById("detail-drawer").classList.add("show");
}

function toast(message, type = "success") {
  const element = document.createElement("div");
  element.className = `toast ${type}`;
  element.textContent = message;
  document.getElementById("toast-stack").append(element);
  setTimeout(() => element.remove(), 3200);
}

function exportCsv(filename, headers, rows) {
  const escape = v => `"${String(v).replaceAll('"', '""')}"`;
  const csv = "\ufeff" + [headers, ...rows].map(row => row.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  toast(`已导出 ${filename}`);
}

document.addEventListener("click", event => {
  const assignmentToggle = event.target.closest("[data-toggle-assignment]");
  if (assignmentToggle) {
    const type = assignmentToggle.dataset.toggleAssignment;
    setAssignmentVisibility(type, !assignmentVisibility[type]);
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    event.preventDefault();
    navigate(go.dataset.go, true);
    return;
  }

  const nav = event.target.closest(".nav-item");
  if (nav) {
    event.preventDefault();
    navigate(nav.dataset.view, true);
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "account-logout") {
    event.preventDefault();
    logoutAccount();
    return;
  }
  const financeRecordTrigger = event.target.closest("[data-payment-id], [data-drawer-payment], [data-payable-pay]");
  if (!financeAccessGranted() && ((action && FINANCE_ACTIONS.has(action)) || financeRecordTrigger)) {
    event.preventDefault();
    showFinanceLogin();
    return;
  }
  if (action === "open-finance-login") showFinanceLogin();
  if (action === "create-receivable" || action === "quick-create") {
    const form = document.getElementById("receivable-form");
    form.reset();
    form.dueDate.value = "2026-08-27";
    openModal("receivable-modal");
  }
  if (action === "create-waybill") {
    document.getElementById("waybill-form").reset();
    prepareWaybillForm();
    openModal("waybill-modal");
  }
  if (action === "create-vehicle") {
    document.getElementById("vehicle-form").reset();
    prepareWaybillForm();
    openModal("vehicle-modal");
  }
  if (action === "import-customer") importCommonCustomer();
  if (action === "smart-fill-sender") smartFillSenderInfo();
  if (action === "smart-fill-receiver") smartFillReceiverInfo();
  if (action === "amap-fill-sender") importAmapParty("sender", event.target.closest("[data-action]"));
  if (action === "amap-fill-receiver") importAmapParty("receiver", event.target.closest("[data-action]"));
  if (action === "clear-waybill-search") {
    document.getElementById("waybill-search").value = "";
    currentWaybillTab = "all";
    document.querySelectorAll("[data-waybill-tab]").forEach(button => button.classList.toggle("active", button.dataset.waybillTab === "all"));
    renderWaybills();
  }
  if (action === "create-cost") {
    document.getElementById("cost-form").reset();
    openModal("cost-modal");
  }
  if (action === "export-receivables" || action === "export-dashboard") {
    exportCsv("应收账款明细.csv", ["账单号", "客户", "运单", "应收金额", "已收金额", "未收金额", "到期日", "状态"], state.receivables.map(x => [x.billNo, x.customer, x.waybill, x.amount, x.received, balanceOf(x), x.dueDate, statusLabel(x.status)]));
  }
  if (action === "export-waybills") {
    if (financeAccessGranted()) {
      exportCsv("运单明细.csv", ["运单号", "客户", "起点", "终点", "货物", "司机", "车辆", "收入", "成本", "状态"], state.waybills.map(x => [x.no, x.customer, x.origin, x.destination, x.cargo, x.driver, x.vehicle, x.revenue, x.cost, x.status]));
    } else {
      exportCsv("运单业务明细.csv", ["运单号", "客户", "起点", "终点", "货物", "司机", "车辆", "状态"], state.waybills.map(x => [x.no, x.customer, x.origin, x.destination, x.cargo, x.driver, x.vehicle, x.status]));
    }
  }
  if (action === "create-reconciliation") {
    const index = state.reconciliations.length + 1;
    state.reconciliations.unshift({ no: `DZ20260729${String(index).padStart(3, "0")}`, customer: "待选择客户", period: "2026-07-01 至 07-29", count: 0, amount: 0, confirmed: 0, status: "草稿" });
    saveData();
    renderReconciliation();
    toast("已创建对账单草稿");
  }
  if (["create-payable", "create-flow", "create-invoice", "create-customer", "import-flow", "batch-payment", "batch-remind-pod", "pod-upload", "waybill-detail", "create-team"].includes(action)) toast("操作入口已就绪，演示版暂以提示代替服务端提交。", "warning");
  if (action === "smart-dispatch") toast("已根据线路、车型和司机空闲度生成推荐排序");
  if (action === "export-payables") exportCsv("应付账款明细.csv", ["结算单", "收款方", "类型", "金额", "付款日", "状态"], state.payables.map(x => [x.no, x.party, x.type, x.amount, x.due, statusLabel(x.status)]));
  if (action === "reset-demo") {
    state = cloneDemo();
    saveData();
    renderAll();
    toast("演示数据已恢复");
  }
  if (action === "restore-record") toast("单据已恢复到运单管理");
  if (action === "empty-recycle") toast("演示模式不执行不可恢复删除", "warning");

  const detail = event.target.closest("[data-detail-id]");
  if (detail) showDetail(detail.dataset.detailId);
  const payment = event.target.closest("[data-payment-id]");
  if (payment) showPayment(payment.dataset.paymentId);
  const drawerPayment = event.target.closest("[data-drawer-payment]");
  if (drawerPayment) showPayment(drawerPayment.dataset.drawerPayment);
  const dispatchWaybill = event.target.closest("[data-dispatch-waybill]");
  if (dispatchWaybill) {
    const item = state.waybills.find(x => x.id === Number(dispatchWaybill.dataset.dispatchWaybill));
    if (item) {
      item.status = "运输中";
      const vehicle = state.vehicles.find(x => x.plate === item.vehicle);
      if (vehicle) {
        vehicle.status = "运输中";
        vehicle.taskDriver = item.driver;
      }
      saveData();
      renderAll();
      toast(`${item.no} 已派车并进入运输中`);
    }
  }
  const advanceWaybill = event.target.closest("[data-advance-waybill]");
  if (advanceWaybill) {
    const item = state.waybills.find(x => x.id === Number(advanceWaybill.dataset.advanceWaybill));
    if (item) {
      item.status = "已签收";
      const vehicle = state.vehicles.find(x => x.plate === item.vehicle);
      if (vehicle) {
        vehicle.status = "空闲";
        vehicle.taskDriver = "";
      }
      saveData();
      renderAll();
      toast(`${item.no} 已完成签收`);
    }
  }
  const payablePay = event.target.closest("[data-payable-pay]");
  if (payablePay) {
    const item = state.payables[Number(payablePay.dataset.payablePay)];
    if (item) {
      const amount = item.amount - (item.paid || 0);
      item.paid = item.amount;
      item.status = "paid";
      state.cashflows.unshift({ time: "刚刚", account: "建设银行 · 1028", summary: `支付${item.party}`, relation: item.no, amount, type: "out", matched: true });
      saveData();
      renderAll();
      toast(`已付款 ${formatMoney(amount)}，并完成自动核销`);
    }
  }
  const printWaybill = event.target.closest("[data-print-waybill]");
  if (printWaybill) showTriplicate(printWaybill.dataset.printWaybill);

  if (event.target.closest("[data-close-modal]") || event.target.id === "modal-backdrop" || event.target.id === "close-drawer") closeAllOverlays();

  const tab = event.target.closest("[data-receivable-tab]");
  if (tab) {
    currentReceivableTab = tab.dataset.receivableTab;
    document.querySelectorAll("[data-receivable-tab]").forEach(x => x.classList.toggle("active", x === tab));
    renderReceivables();
  }

  const chartButton = event.target.closest("[data-chart-mode]");
  if (chartButton) {
    document.querySelectorAll("[data-chart-mode]").forEach(x => x.classList.toggle("active", x === chartButton));
    renderLineChart(chartButton.dataset.chartMode);
  }
  const waybillTab = event.target.closest("[data-waybill-tab]");
  if (waybillTab) {
    currentWaybillTab = waybillTab.dataset.waybillTab;
    document.querySelectorAll("[data-waybill-tab]").forEach(x => x.classList.toggle("active", x === waybillTab));
    renderWaybills();
  }
});

window.addEventListener("hashchange", () => navigate(location.hash.slice(1)));

document.getElementById("account-login-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  const error = document.getElementById("account-login-error");
  if (email !== ACCOUNT_EMAIL || password !== ACCOUNT_PASSWORD) {
    error.textContent = "账号或密码不正确，请检查后重新登录。";
    document.getElementById(email !== ACCOUNT_EMAIL ? "account-email" : "account-password").focus();
    return;
  }
  sessionStorage.setItem(ACCOUNT_SESSION_KEY, ACCOUNT_EMAIL);
  sessionStorage.removeItem(FINANCE_SESSION_KEY);
  error.textContent = "";
  updateAccountAccessUI();
  updateFinanceAccessUI();
  renderAll();
  navigate(location.hash.slice(1) || "dashboard");
  toast("账号登录成功");
});

document.getElementById("user-menu-button").addEventListener("click", event => {
  event.stopPropagation();
  const menu = document.getElementById("account-menu");
  menu.hidden = !menu.hidden;
});

document.addEventListener("click", event => {
  if (!event.target.closest("#account-menu") && !event.target.closest("#user-menu-button")) {
    document.getElementById("account-menu").hidden = true;
  }
});

document.getElementById("finance-auth-form").addEventListener("submit", event => {
  event.preventDefault();
  const key = String(new FormData(event.currentTarget).get("financeKey") || "").trim();
  const error = document.getElementById("finance-auth-error");
  if (key !== FINANCE_ACCESS_KEY) {
    error.textContent = "财务密钥不正确，请重新输入。";
    document.getElementById("finance-key-input").select();
    return;
  }
  sessionStorage.setItem(FINANCE_SESSION_KEY, "granted");
  updateFinanceAccessUI();
  renderDashboard();
  renderWaybills();
  const target = pendingFinanceView;
  pendingFinanceView = null;
  closeAllOverlays();
  if (target) navigate(target, true);
  toast("财务身份验证成功，当前会话已开放财务专属功能");
});

document.getElementById("finance-session-button").addEventListener("click", () => {
  if (!financeAccessGranted()) {
    showFinanceLogin();
    return;
  }
  sessionStorage.removeItem(FINANCE_SESSION_KEY);
  pendingFinanceView = null;
  updateFinanceAccessUI();
  renderDashboard();
  renderWaybills();
  const current = document.querySelector(".view.active")?.dataset.viewPanel;
  if (FINANCE_VIEWS.has(current)) navigate("dashboard", true);
  toast("已退出财务模式，财务专属功能重新锁定");
});

document.getElementById("receivable-search").addEventListener("input", renderReceivables);
document.getElementById("receivable-aging").addEventListener("change", renderReceivables);
document.getElementById("clear-receivable-filters").addEventListener("click", () => {
  document.getElementById("receivable-search").value = "";
  document.getElementById("receivable-aging").value = "all";
  currentReceivableTab = "all";
  document.querySelectorAll("[data-receivable-tab]").forEach(x => x.classList.toggle("active", x.dataset.receivableTab === "all"));
  renderReceivables();
});
document.getElementById("customer-search").addEventListener("input", renderCustomers);
document.getElementById("waybill-search").addEventListener("input", event => {
  if (event.currentTarget.value.trim()) {
    currentWaybillTab = "all";
    document.querySelectorAll("[data-waybill-tab]").forEach(button => button.classList.toggle("active", button.dataset.waybillTab === "all"));
  }
  renderWaybills();
});
document.getElementById("collection-search").addEventListener("input", renderCollections);
document.getElementById("vehicle-search").addEventListener("input", renderFleet);
document.getElementById("origin-province").addEventListener("change", () => updateRegionCities("origin"));
document.getElementById("destination-province").addEventListener("change", () => updateRegionCities("destination"));
document.getElementById("origin-city").addEventListener("change", () => updateRegionDistricts("origin"));
document.getElementById("destination-city").addEventListener("change", () => updateRegionDistricts("destination"));
document.getElementById("origin-district").addEventListener("change", calculateDistance);
document.getElementById("destination-district").addEventListener("change", calculateDistance);
document.getElementById("carrier-mode").addEventListener("change", refreshVehicleOptions);
document.getElementById("waybill-team-select").addEventListener("change", refreshVehicleOptions);
document.getElementById("driver-entry-mode").addEventListener("change", () => updateAssignmentMode("driver"));
document.getElementById("vehicle-entry-mode").addEventListener("change", () => updateAssignmentMode("vehicle"));
["freight", "insuranceFee", "loadingFee", "upstairsFee", "otherFee"].forEach(name => {
  document.querySelector(`#waybill-form [name="${name}"]`).addEventListener("input", updateChargeTotal);
});
function clearTriplicatePrintMode() {
  document.body.classList.remove("print-copy-1", "print-copy-2", "print-copy-3");
}

function printTriplicate(copyIndex = null) {
  clearTriplicatePrintMode();
  if (copyIndex) document.body.classList.add(`print-copy-${copyIndex}`);
  window.print();
  window.setTimeout(clearTriplicatePrintMode, 0);
}

document.getElementById("print-triplicate").addEventListener("click", () => printTriplicate());
document.querySelectorAll("[data-print-copy]").forEach(button => {
  button.addEventListener("click", () => printTriplicate(Number(button.dataset.printCopy)));
});
window.addEventListener("afterprint", clearTriplicatePrintMode);
let senderInputTimer;
let receiverInputTimer;
document.getElementById("smart-sender-info").addEventListener("input", event => {
  window.clearTimeout(senderInputTimer);
  const value = event.currentTarget.value.trim();
  if (value.length < 6) return;
  if (/(?:amap\.com|autonavi\.com|gaode\.com)/i.test(value)) {
    const result = document.getElementById("sender-import-result");
    result.textContent = "检测到高德分享链接，请点击“高德地址导入”";
    result.className = "";
    return;
  }
  senderInputTimer = window.setTimeout(() => smartFillSenderInfo(true), 320);
});
document.getElementById("smart-receiver-info").addEventListener("input", event => {
  window.clearTimeout(receiverInputTimer);
  const value = event.currentTarget.value.trim();
  if (value.length < 6) return;
  if (/(?:amap\.com|autonavi\.com|gaode\.com)/i.test(value)) {
    const result = document.getElementById("receiver-import-result");
    result.textContent = "检测到高德分享链接，请点击“高德地址导入”";
    result.className = "";
    return;
  }
  receiverInputTimer = window.setTimeout(() => smartFillReceiverInfo(true), 320);
});

document.getElementById("global-search").addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  const query = event.currentTarget.value.trim();
  if (!query) return;
  const extractedWaybill = extractWaybillNumber(query);
  const normalizedQuery = normalizeWaybillSearch(extractedWaybill || query);
  const waybillMatches = state.waybills.filter(item => waybillMatchesSearch(item, normalizedQuery));
  if (extractedWaybill || waybillMatches.length) {
    navigate("waybills", true);
    currentWaybillTab = "all";
    document.querySelectorAll("[data-waybill-tab]").forEach(button => button.classList.toggle("active", button.dataset.waybillTab === "all"));
    document.getElementById("waybill-search").value = extractedWaybill || query;
    renderWaybills();
    toast(waybillMatches.length ? `找到 ${waybillMatches.length} 张匹配运单` : `未找到运单 ${extractedWaybill}`, waybillMatches.length ? "success" : "warning");
    return;
  }
  const receivableMatches = state.receivables.filter(item => [item.billNo, item.waybill, item.customer].some(value => String(value).toLowerCase().includes(query.toLowerCase())));
  if (receivableMatches.length || /^YS/i.test(query)) {
    if (!navigate("receivables", true)) return;
    document.getElementById("receivable-search").value = query;
    renderReceivables();
    return;
  }
  toast("没有找到匹配的运单、账单或客户", "warning");
});

document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    document.getElementById("global-search").focus();
  }
  if (event.key === "Escape") closeAllOverlays();
});

document.getElementById("receivable-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!financeAccessGranted()) {
    showFinanceLogin("receivables");
    return;
  }
  const data = new FormData(event.currentTarget);
  const id = Math.max(0, ...state.receivables.map(x => x.id)) + 1;
  state.receivables.unshift({
    id,
    billNo: `YS20260728${String(id).padStart(3, "0")}`,
    customer: data.get("customer"),
    waybill: data.get("waybill"),
    amount: Number(data.get("amount")),
    received: 0,
    dueDate: data.get("dueDate"),
    status: daysBetween(data.get("dueDate")) < 0 ? "overdue" : "pending",
    note: data.get("note") || "运输服务费",
    createdAt: "2026-07-28",
  });
  saveData();
  closeAllOverlays();
  renderAll();
  location.hash = "receivables";
  toast("应收账单已创建");
});

document.getElementById("payment-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!financeAccessGranted()) {
    showFinanceLogin("collections");
    return;
  }
  const data = new FormData(event.currentTarget);
  const item = state.receivables.find(x => x.id === Number(data.get("receivableId")));
  if (!item) return;
  const amount = Math.min(Number(data.get("paymentAmount")), balanceOf(item));
  if (!amount) return;
  item.received += amount;
  item.status = balanceOf(item) === 0 ? "paid" : "partial";
  state.cashflows.unshift({ time: "刚刚", account: data.get("account"), summary: `${item.customer}回款`, relation: item.billNo, amount, type: "in", matched: true });
  saveData();
  closeAllOverlays();
  renderAll();
  toast(`已收款 ${formatMoney(amount)}，并完成自动核销`);
});

let waybillInvalidNoticeActive = false;
document.getElementById("waybill-form").addEventListener("invalid", event => {
  if (waybillInvalidNoticeActive) return;
  waybillInvalidNoticeActive = true;
  const label = event.target.closest("label");
  const fieldName = label?.childNodes?.[0]?.textContent?.trim() || "必填信息";
  toast(`请先填写：${fieldName}`, "warning");
  event.target.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => { waybillInvalidNoticeActive = false; }, 400);
}, true);

document.getElementById("waybill-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const origin = selectedRegion("origin");
  const destination = selectedRegion("destination");
  const distance = Number(data.get("distance")) || calculateDistance();
  if (!origin.district || !destination.district) {
    toast("请选择完整的起点和终点区县", "warning");
    return;
  }
  if (!distance) {
    toast("该区县暂未匹配坐标，请填写确认里程", "warning");
    return;
  }

  let driver = "";
  let driverPhone = "";
  let driverLicense = "";
  if (assignmentVisibility.driver) {
    if (data.get("driverEntryMode") === "existing") {
      driver = String(data.get("existingDriver") || "").trim();
      if (!driver) {
        toast("请选择已有司机，或切换为录入新司机", "warning");
        return;
      }
      const profile = (state.driverProfiles || []).find(x => x.name === driver);
      driverPhone = profile?.phone || "";
      driverLicense = profile?.license || "";
    } else {
      driver = String(data.get("newDriverName") || "").trim();
      driverPhone = String(data.get("newDriverPhone") || "").trim();
      driverLicense = String(data.get("newDriverLicense") || "").trim();
      if (!driver) {
        toast("请填写新司机姓名，或选择暂不填写司机", "warning");
        return;
      }
      if (data.get("saveNewDriver") === "on") {
        if (!state.drivers.includes(driver)) state.drivers.unshift(driver);
        state.driverProfiles = state.driverProfiles || [];
        const existingProfile = state.driverProfiles.find(x => x.name === driver);
        if (existingProfile) {
          existingProfile.phone = driverPhone;
          existingProfile.license = driverLicense;
        } else {
          state.driverProfiles.unshift({ name: driver, phone: driverPhone, license: driverLicense });
        }
      }
    }
  }

  let vehicle = "";
  let vehicleType = "";
  let vehicleLength = "";
  let vehicleSource = "";
  if (assignmentVisibility.vehicle) {
    if (data.get("vehicleEntryMode") === "existing") {
      vehicle = String(data.get("existingVehicle") || "").trim();
      if (!vehicle) {
        toast("请选择已有车辆，或切换为录入新车辆", "warning");
        return;
      }
      const vehicleRecord = state.vehicles.find(x => x.plate === vehicle);
      vehicleType = vehicleRecord?.type || "";
      vehicleLength = vehicleRecord?.length || "";
      vehicleSource = vehicleRecord?.source || "";
    } else {
      vehicle = String(data.get("newVehiclePlate") || "").trim().toUpperCase();
      vehicleType = String(data.get("newVehicleType") || "").trim();
      vehicleLength = Number(data.get("newVehicleLength")) || "";
      const carrierMode = String(data.get("carrierMode") || "临时外请");
      vehicleSource = carrierMode === "合作车队" ? "车队车辆" : carrierMode;
      if (!vehicle) {
        toast("请填写新车辆车牌号，或选择暂不填写车辆", "warning");
        return;
      }
      if (data.get("saveNewVehicle") === "on") {
        if (state.vehicles.some(x => x.plate === vehicle)) {
          toast("该车牌已存在，请改为选择已有车辆", "warning");
          return;
        }
        state.vehicles.unshift({
          id: Math.max(200, ...state.vehicles.map(x => x.id)) + 1,
          plate: vehicle,
          type: vehicleType,
          length: vehicleLength,
          capacity: 0,
          source: vehicleSource,
          team: data.get("team") || "",
          status: "空闲",
          taskDriver: ""
        });
      }
    }
  }

  const freight = Number(data.get("freight")) || 0;
  const insuranceFee = Number(data.get("insuranceFee")) || 0;
  const loadingFee = Number(data.get("loadingFee")) || 0;
  const upstairsFee = Number(data.get("upstairsFee")) || 0;
  const otherFee = Number(data.get("otherFee")) || 0;
  const revenue = freight + insuranceFee + loadingFee + upstairsFee + otherFee;
  const id = Math.max(100, ...state.waybills.map(x => x.id)) + 1;
  state.waybills.unshift({
    id,
    no: `WB20260729${String(id).slice(-3)}`,
    customer: data.get("customer"),
    origin: origin.label,
    destination: destination.label,
    originAddress: data.get("originAddress"),
    destinationAddress: data.get("destinationAddress"),
    senderContact: data.get("senderContact"),
    senderPhone: data.get("senderPhone"),
    receiverContact: data.get("receiverContact"),
    receiverPhone: data.get("receiverPhone"),
    distance,
    cargo: data.get("cargo"),
    packaging: data.get("packaging") || "",
    pieces: data.get("pieces") === "" ? "" : Number(data.get("pieces")),
    weight: data.get("weight") === "" ? "" : Number(data.get("weight")),
    volume: data.get("volume") === "" ? "" : Number(data.get("volume")),
    declaredValue: Number(data.get("declaredValue")) || 0,
    driver,
    driverPhone,
    driverLicense,
    vehicle,
    vehicleType,
    vehicleLength,
    vehicleSource,
    team: data.get("team"),
    carrierMode: data.get("carrierMode"),
    freight,
    insuranceFee,
    loadingFee,
    upstairsFee,
    otherFee,
    paymentMethod: data.get("paymentMethod"),
    settlementMethod: data.get("settlementMethod"),
    deliveryMethod: data.get("deliveryMethod"),
    revenue,
    cost: Number(data.get("cost")),
    status: "待调度",
    date: "07-29 刚刚",
  });
  saveData();
  closeAllOverlays();
  renderAll();
  navigate("waybills", true);
  showTriplicate(id);
  toast(driver || vehicle ? `运单 ${state.waybills[0].no} 已开具，并同步生成待调度任务` : `运单 ${state.waybills[0].no} 已开具，司机和车辆可在调度时补充`);
});

document.getElementById("vehicle-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const plate = String(data.get("plate")).trim().toUpperCase();
  if (state.vehicles.some(x => x.plate === plate)) {
    toast("该车牌已存在，请检查车辆档案", "warning");
    return;
  }
  state.vehicles.unshift({
    id: Math.max(200, ...state.vehicles.map(x => x.id)) + 1,
    plate,
    type: data.get("type"),
    length: Number(data.get("length")),
    capacity: Number(data.get("capacity")),
    source: data.get("source"),
    team: data.get("team"),
    status: "空闲",
    taskDriver: ""
  });
  saveData();
  closeAllOverlays();
  renderAll();
  location.hash = "fleet";
  toast("车辆已建档；司机将在具体调度任务中选择");
});

document.getElementById("cost-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!financeAccessGranted()) {
    showFinanceLogin("costs");
    return;
  }
  const data = new FormData(event.currentTarget);
  state.costs.unshift({
    date: "2026-07-29",
    driver: data.get("driver"),
    waybill: data.get("waybill"),
    type: data.get("type"),
    amount: Number(data.get("amount")),
    location: data.get("location"),
    voucher: `FY${Date.now().toString().slice(-7)}`,
    status: "待审核",
  });
  saveData();
  closeAllOverlays();
  renderAll();
  location.hash = "costs";
  toast("费用已登记，等待审核");
});

document.getElementById("settings-form").addEventListener("submit", event => {
  event.preventDefault();
  const amapKey = String(new FormData(event.currentTarget).get("amapWebKey") || "").trim();
  if (amapKey) localStorage.setItem(AMAP_KEY_STORAGE, amapKey);
  else localStorage.removeItem(AMAP_KEY_STORAGE);
  toast(amapKey ? "企业设置和高德地图 Key 已保存" : "企业设置已保存；高德地图 Key 未配置");
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("yzt-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
});
document.getElementById("menu-button").addEventListener("click", () => {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebar-overlay").classList.add("show");
});
document.getElementById("sidebar-overlay").addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("show");
});

document.getElementById("workday").textContent = new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "short" }).format(new Date("2026-07-29"));
if (localStorage.getItem("yzt-theme") === "dark") document.documentElement.classList.add("dark");
document.getElementById("amap-web-key").value = localStorage.getItem(AMAP_KEY_STORAGE) || "";
updateAccountAccessUI();
updateFinanceAccessUI();
renderAll();
if (accountAccessGranted()) navigate(location.hash.slice(1) || "dashboard");
