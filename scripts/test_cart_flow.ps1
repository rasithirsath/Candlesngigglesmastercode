$API = 'http://localhost:5000/api'
$testUser = @{ name = 'AI Test User'; email = 'ai-test+user@example.com'; password = 'password123' }

Write-Host '1) Signup (if not exists)'
try {
  Invoke-RestMethod -Method Post -Uri "$API/auth/signup" -Body ($testUser | ConvertTo-Json) -ContentType 'application/json' -ErrorAction Stop
  Write-Host ' Signup: success'
} catch {
  Write-Host ' Signup: may already exist'
}

Write-Host '2) Login'
$login = Invoke-RestMethod -Method Post -Uri "$API/auth/login" -Body (@{ email = $testUser.email; password = $testUser.password } | ConvertTo-Json) -ContentType 'application/json'
$token = $login.token
Write-Host " Token length: $($token.Length)"

Write-Host '3) Get initial cart'
try {
  $initial = Invoke-RestMethod -Uri "$API/user/cart" -Headers @{ Authorization = "Bearer $token" } -Method Get -ErrorAction Stop
  Write-Host ($initial | ConvertTo-Json -Depth 10)
} catch {
  Write-Host ' Failed to fetch initial cart'
}

Write-Host '4) Save test cart'
$testCart = @{ cart = @(@{ id = '1'; name = 'Crimson Romance'; price = 500; quantity = 2 }) }
Invoke-RestMethod -Method Post -Uri "$API/user/cart" -Body ($testCart | ConvertTo-Json -Depth 10) -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
Write-Host ' Saved test cart'

Write-Host '5) Get cart after save'
$after = Invoke-RestMethod -Uri "$API/user/cart" -Headers @{ Authorization = "Bearer $token" } -Method Get
Write-Host ($after | ConvertTo-Json -Depth 10)

Write-Host '6) Simulate logout and re-login'
$login2 = Invoke-RestMethod -Method Post -Uri "$API/auth/login" -Body (@{ email = $testUser.email; password = $testUser.password } | ConvertTo-Json) -ContentType 'application/json'
$token2 = $login2.token
Write-Host " Re-login token length: $($token2.Length)"

Write-Host '7) Get cart after re-login'
$after2 = Invoke-RestMethod -Uri "$API/user/cart" -Headers @{ Authorization = "Bearer $token2" } -Method Get
Write-Host ($after2 | ConvertTo-Json -Depth 10)

Write-Host 'Test complete'
