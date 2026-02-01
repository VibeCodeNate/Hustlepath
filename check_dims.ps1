Add-Type -AssemblyName System.Drawing
$files = @(
    "public/assets/shop/rogues.png",
    "public/assets/shop/monsters.png",
    "public/assets/shop/items.png",
    "public/assets/shop/dino_vita.png",
    "public/assets/shop/dino_mort.png"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        try {
            $img = [System.Drawing.Image]::FromFile((Get-Item $f).FullName)
            Write-Output "$f : $($img.Width) x $($img.Height)"
            $img.Dispose()
        } catch {
            Write-Error "Failed to read $f"
        }
    } else {
        Write-Warning "File not found: $f"
    }
}
