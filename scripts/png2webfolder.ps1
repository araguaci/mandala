param (
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$p1,

    [Parameter(Position = 1)]
    [ValidateRange(0, 100)]
    [int]$Quality = 80,

    [switch]$Recursive,
    [switch]$Overwrite,
    [switch]$DeleteOriginal
)

$converter = Join-Path $PSScriptRoot "convert_images_to_webp.py"
$pyArgs = @($converter, $p1, $Quality)

if ($Recursive) { $pyArgs += "--recursive" }
if ($Overwrite) { $pyArgs += "--overwrite" }
if ($DeleteOriginal) { $pyArgs += "--delete-original" }

$pythonCmd = if (Get-Command python -ErrorAction SilentlyContinue) { "python" } else { "py" }
& $pythonCmd @pyArgs
exit $LASTEXITCODE
