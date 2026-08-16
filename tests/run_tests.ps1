# HCM-T21 "Đức hay Tài" — PowerShell Test Runner
# Runs zero-dependency Node.js test runner and outputs status

$ErrorActionPreference = "Stop"
Write-Host "Executing Automated Test Suite..." -ForegroundColor Cyan

$result = node (Join-Path $PSScriptRoot "run_tests.js")
Write-Host $result

if ($LASTEXITCODE -ne 0) {
    Write-Host "Test Suite Failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
} else {
    Write-Host "Test Suite Passed with 100% success rate!" -ForegroundColor Green
    exit 0
}
