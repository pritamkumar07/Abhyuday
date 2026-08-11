$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Prefixes.Add("http://127.0.0.1:8080/")
try {
    $listener.Start()
    Write-Host "Localhost server running at http://localhost:8080/"
} catch {
    Write-Host "Port 8080 busy, trying 8082"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8082/")
    $listener.Prefixes.Add("http://127.0.0.1:8082/")
    $listener.Start()
    Write-Host "Localhost server running at http://localhost:8082/"
}

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".jpg"  = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $rawUrl = $request.Url.AbsolutePath
        if ($rawUrl -eq "/") { $rawUrl = "/index.html" }
        
        $localPath = Join-Path (Get-Location) $rawUrl.TrimStart('/')
        
        if (Test-Path $localPath) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            }
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    } catch {
        # continue loop on non-fatal request errors
    }
}
