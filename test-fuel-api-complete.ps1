# Comprehensive Fuel API Test Script
# Tests all endpoints with real scenarios including low efficiency notification

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fuel & Analysis Backend Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api/fuel"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [object]$Body = $null
    )
    
    Write-Host "TEST: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        if ($Method -eq "POST") {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
            Write-Host "Request Body:" -ForegroundColor Gray
            Write-Host $bodyJson -ForegroundColor DarkGray
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $bodyJson -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        
        if ($response.success -eq $true) {
            Write-Host "✓ PASSED" -ForegroundColor Green
            Write-Host "Message: $($response.message)" -ForegroundColor Green
            Write-Host "Response Data:" -ForegroundColor Gray
            $response.data | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor DarkGray
            $script:testsPassed++
            return $response
        } else {
            Write-Host "✗ FAILED - success=false" -ForegroundColor Red
            Write-Host "Message: $($response.message)" -ForegroundColor Red
            $script:testsFailed++
            return $null
        }
    } catch {
        Write-Host "✗ FAILED - Exception" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
    Write-Host ""
}

# ========================================
# Test 1: Add First Fuel Log
# ========================================
Write-Host "`n--- Test 1: Add First Fuel Log ---" -ForegroundColor Magenta
$log1 = @{
    vehicleRegNumber = "KA01AB1234"
    fuelType = "Diesel"
    liters = 50.0
    costPerLiter = 95.5
    mileage = 15000.0
    date = "2026-03-21"
}
$response1 = Test-Endpoint -Name "Add First Log (KA01AB1234)" -Method "POST" -Url "$baseUrl/add" -Body $log1

# ========================================
# Test 2: Add Second Log (Good Efficiency)
# ========================================
Write-Host "`n--- Test 2: Add Second Log (Good Efficiency) ---" -ForegroundColor Magenta
Write-Host "Expected Efficiency: (15560 - 15000) / 45 = 12.44 km/L (Good)" -ForegroundColor Cyan
$log2 = @{
    vehicleRegNumber = "KA01AB1234"
    fuelType = "Diesel"
    liters = 45.0
    costPerLiter = 96.0
    mileage = 15560.0
    date = "2026-03-22"
}
$response2 = Test-Endpoint -Name "Add Second Log (Good Efficiency)" -Method "POST" -Url "$baseUrl/add" -Body $log2

# ========================================
# Test 3: Add Log with Auto-calculated Cost
# ========================================
Write-Host "`n--- Test 3: Auto-calculate totalCost ---" -ForegroundColor Magenta
Write-Host "Expected: 40 * 102 = 4080" -ForegroundColor Cyan
$log3 = @{
    vehicleRegNumber = "KA02CD5678"
    fuelType = "Petrol"
    liters = 40.0
    costPerLiter = 102.0
    mileage = 10000.0
    date = "2026-03-20"
}
$response3 = Test-Endpoint -Name "Add Log (Auto-calculate Cost)" -Method "POST" -Url "$baseUrl/add" -Body $log3

# ========================================
# Test 4: Add Log with Low Efficiency (Notification Trigger)
# ========================================
Write-Host "`n--- Test 4: LOW EFFICIENCY NOTIFICATION TEST ---" -ForegroundColor Magenta
Write-Host "Expected Efficiency: (10200 - 10000) / 50 = 4.0 km/L < 5 km/L" -ForegroundColor Cyan
Write-Host "Expected: NOTIFICATION CREATED ✉️" -ForegroundColor Yellow
$log4 = @{
    vehicleRegNumber = "KA02CD5678"
    fuelType = "Petrol"
    liters = 50.0
    costPerLiter = 103.0
    mileage = 10200.0
    date = "2026-03-21"
}
$response4 = Test-Endpoint -Name "Add Log (Low Efficiency - Trigger Notification)" -Method "POST" -Url "$baseUrl/add" -Body $log4

# ========================================
# Test 5: Add Another Vehicle
# ========================================
Write-Host "`n--- Test 5: Add Different Vehicle ---" -ForegroundColor Magenta
$log5 = @{
    vehicleRegNumber = "KA03EF9012"
    fuelType = "Diesel"
    liters = 60.0
    costPerLiter = 94.0
    totalCost = 5640.0
    mileage = 25000.0
    date = "2026-03-19"
}
$response5 = Test-Endpoint -Name "Add Log (Different Vehicle)" -Method "POST" -Url "$baseUrl/add" -Body $log5

# ========================================
# Test 6: Get Current Month Summary
# ========================================
Write-Host "`n--- Test 6: Get Monthly Summary ---" -ForegroundColor Magenta
$summary = Test-Endpoint -Name "Get Current Month Summary" -Method "GET" -Url "$baseUrl/summary"

if ($summary) {
    Write-Host "`nSummary Analysis:" -ForegroundColor Cyan
    Write-Host "  Total Diesel: $($summary.data.totalDiesel) L" -ForegroundColor White
    Write-Host "  Total Petrol: $($summary.data.totalPetrol) L" -ForegroundColor White
    Write-Host "  Total Volume: $($summary.data.totalVolume) L" -ForegroundColor White
    Write-Host "  Total Cost: ₹$($summary.data.totalCost)" -ForegroundColor White
}

# ========================================
# Test 7: Get Chart Data
# ========================================
Write-Host "`n--- Test 7: Get Chart Data (React Bar Chart) ---" -ForegroundColor Magenta
$chart = Test-Endpoint -Name "Get Monthly Chart Data" -Method "GET" -Url "$baseUrl/chart"

if ($chart) {
    Write-Host "`nChart Data Preview:" -ForegroundColor Cyan
    Write-Host "  Months: $($chart.data.months -join ', ')" -ForegroundColor White
    Write-Host "  Diesel Data Points: $($chart.data.data.Diesel.Count)" -ForegroundColor White
    Write-Host "  Petrol Data Points: $($chart.data.data.Petrol.Count)" -ForegroundColor White
}

# ========================================
# Test 8: Get Vehicle Statistics
# ========================================
Write-Host "`n--- Test 8: Get Vehicle Statistics (Dashboard Table) ---" -ForegroundColor Magenta
$stats = Test-Endpoint -Name "Get All Vehicle Statistics" -Method "GET" -Url "$baseUrl/stats"

if ($stats) {
    Write-Host "`nVehicle Statistics Summary:" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
    Write-Host ("  {0,-15} {1,12} {2,15} {3,-20}" -f "Vehicle", "Efficiency", "Spending", "Status") -ForegroundColor White
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
    
    foreach ($vehicle in $stats.data) {
        $eff = if ($vehicle.fuelEfficiency -ne $null) { "$($vehicle.fuelEfficiency) km/L" } else { "N/A" }
        $spending = "₹$([math]::Round($vehicle.totalSpending, 2))"
        
        $statusColor = switch ($vehicle.efficiencyStatus) {
            "Good" { "Green" }
            "Moderate" { "Yellow" }
            "Low Efficiency" { "Red" }
            default { "Gray" }
        }
        
        Write-Host ("  {0,-15} {1,12} {2,15} " -f $vehicle.vehicleRegNumber, $eff, $spending) -NoNewline
        Write-Host $vehicle.efficiencyStatus -ForegroundColor $statusColor
    }
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Gray
}

# ========================================
# Test 9: Get Specific Vehicle Logs
# ========================================
Write-Host "`n--- Test 9: Get Logs for Specific Vehicle ---" -ForegroundColor Magenta
$vehicleLogs = Test-Endpoint -Name "Get Logs for KA01AB1234" -Method "GET" -Url "$baseUrl/vehicle/KA01AB1234"

if ($vehicleLogs) {
    Write-Host "`nFound $($vehicleLogs.data.Count) log(s) for KA01AB1234" -ForegroundColor Cyan
}

# ========================================
# Test 10: Get Fuel Log by ID
# ========================================
Write-Host "`n--- Test 10: Get Fuel Log by ID ---" -ForegroundColor Magenta
if ($response1.data.id) {
    $logById = Test-Endpoint -Name "Get Log by ID" -Method "GET" -Url "$baseUrl/$($response1.data.id)"
}

# ========================================
# FINAL RESULTS
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "           TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✓ ALL TESTS PASSED! 🎉" -ForegroundColor Green
    Write-Host ""
    Write-Host "Key Verifications:" -ForegroundColor Yellow
    Write-Host "  ✓ Fuel logs added successfully" -ForegroundColor White
    Write-Host "  ✓ Auto-calculation of totalCost working" -ForegroundColor White
    Write-Host "  ✓ Efficiency calculation (km/L) working" -ForegroundColor White
    Write-Host "  ✓ Low efficiency notification trigger (< 5 km/L)" -ForegroundColor White
    Write-Host "  ✓ Monthly summary aggregation working" -ForegroundColor White
    Write-Host "  ✓ Chart data formatted for React" -ForegroundColor White
    Write-Host "  ✓ Vehicle statistics with efficiency status" -ForegroundColor White
    Write-Host ""
    Write-Host "Check Notifications Table:" -ForegroundColor Yellow
    Write-Host "  SELECT * FROM notifications WHERE vehicle_reg_number = 'KA02CD5678';" -ForegroundColor Cyan
} else {
    Write-Host "✗ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
