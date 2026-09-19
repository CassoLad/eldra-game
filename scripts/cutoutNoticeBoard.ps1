param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Destination
)

Add-Type -AssemblyName System.Drawing
$inputImage = [System.Drawing.Bitmap]::new($Source)
try {
  $left = $inputImage.Width
  $top = $inputImage.Height
  $right = 0
  $bottom = 0
  for ($y = 0; $y -lt $inputImage.Height; $y++) {
    for ($x = 0; $x -lt $inputImage.Width; $x++) {
      $pixel = $inputImage.GetPixel($x, $y)
      if ([Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B)) -lt 225) {
        $left = [Math]::Min($left, $x)
        $top = [Math]::Min($top, $y)
        $right = [Math]::Max($right, $x)
        $bottom = [Math]::Max($bottom, $y)
      }
    }
  }
  $pad = 3
  $left = [Math]::Max(0, $left - $pad)
  $top = [Math]::Max(0, $top - $pad)
  $right = [Math]::Min($inputImage.Width - 1, $right + $pad)
  $bottom = [Math]::Min($inputImage.Height - 1, $bottom + $pad)
  $outputImage = [System.Drawing.Bitmap]::new($right - $left + 1, $bottom - $top + 1, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  try {
    for ($y = $top; $y -le $bottom; $y++) {
      for ($x = $left; $x -le $right; $x++) {
        $pixel = $inputImage.GetPixel($x, $y)
        $minimum = [Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B))
        $spread = [Math]::Max($pixel.R, [Math]::Max($pixel.G, $pixel.B)) - $minimum
        $alpha = if ($minimum -ge 245 -and $spread -le 12) { 0 } elseif ($minimum -gt 230 -and $spread -le 12) { [int](255 * (245 - $minimum) / 15) } else { 255 }
        $outputImage.SetPixel($x - $left, $y - $top, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
      }
    }
    $outputImage.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $outputImage.Dispose()
  }
} finally {
  $inputImage.Dispose()
}
