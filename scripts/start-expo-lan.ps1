# Expo を LAN モードで起動（キャッシュクリア + 正しい IP 指定）
# 「This is taking much longer than it should」対策
# 使い方: .\scripts\start-expo-lan.ps1
# または: powershell -ExecutionPolicy Bypass -File scripts/start-expo-lan.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

# Wi-Fi の IPv4 を取得（ipconfig から 192.168.x.x を抽出）
$ipconfig = ipconfig
$ip = ($ipconfig | Select-String -Pattern "192\.168\.\d+\.\d+" | ForEach-Object { $_.Matches.Value } | Select-Object -First 1)

if (-not $ip) {
    Write-Host "Wi-Fi IP が見つかりません。手動で設定してください:"
    Write-Host '  $env:REACT_NATIVE_PACKAGER_HOSTNAME="192.168.x.x"; npx expo start --lan --port 8082 --clear'
    exit 1
}

Write-Host "使用する IP: $ip"
$env:REACT_NATIVE_PACKAGER_HOSTNAME = $ip

# .expo キャッシュを削除
if (Test-Path .expo) {
    Remove-Item -Recurse -Force .expo
    Write-Host ".expo キャッシュを削除しました"
}

npx expo start --lan --port 8082 --clear
