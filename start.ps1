$ErrorActionPreference = "Stop"
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectPath

$bundledPython = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
if (Test-Path -LiteralPath $bundledPython) {
    & $bundledPython (Join-Path $projectPath "server.py")
    exit
}

$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) {
    & $pythonCommand.Source (Join-Path $projectPath "server.py")
    exit
}

$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
if ($pyLauncher) {
    & $pyLauncher.Source (Join-Path $projectPath "server.py")
    exit
}

throw "未找到 Python。请安装 Python 3 后重新运行。"
