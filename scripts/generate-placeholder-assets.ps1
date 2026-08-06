param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\assets\pets\placeholder\idle')
)

Add-Type -AssemblyName System.Drawing

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$frameCount = 8
$canvasSize = 512

for ($frameIndex = 0; $frameIndex -lt $frameCount; $frameIndex++) {
  $phase = 2 * [Math]::PI * $frameIndex / $frameCount
  $breath = [Math]::Sin($phase)
  $tailSwing = [Math]::Sin($phase)
  $bodyLift = [Math]::Round(3 * $breath)

  $bitmap = [System.Drawing.Bitmap]::new($canvasSize, $canvasSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $outline = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 76, 52, 34), 12)
  $outline.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $outline.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $fur = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 223, 157, 79))
  $cream = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 250, 224, 177))
  $dark = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 66, 45, 31))
  $pink = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 224, 117, 114))

  $tailBaseX = 360
  $tailBaseY = 305 + $bodyLift
  $tailTipX = 409 + [Math]::Round(20 * $tailSwing)
  $tailTipY = 235 - [Math]::Round(9 * [Math]::Cos($phase))
  $graphics.DrawBezier($outline, $tailBaseX, $tailBaseY, 410, 298, $tailTipX + 9, 264, $tailTipX, $tailTipY)

  $bodyHeight = 196 + [Math]::Round(5 * $breath)
  $graphics.FillEllipse($fur, 139, 238 + $bodyLift, 236, $bodyHeight)
  $graphics.DrawEllipse($outline, 139, 238 + $bodyLift, 236, $bodyHeight)

  $graphics.FillEllipse($cream, 190, 286 + $bodyLift, 134, 118 + [Math]::Round(4 * $breath))

  $graphics.FillEllipse($fur, 160, 104 + $bodyLift, 192, 210 + [Math]::Round(3 * $breath))
  $graphics.DrawEllipse($outline, 160, 104 + $bodyLift, 192, 210 + [Math]::Round(3 * $breath))

  $leftEar = [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(187, 143 + $bodyLift),
    [System.Drawing.Point]::new(132, 88 + $bodyLift),
    [System.Drawing.Point]::new(142, 223 + $bodyLift)
  )
  $rightEar = [System.Drawing.Point[]]@(
    [System.Drawing.Point]::new(325, 143 + $bodyLift),
    [System.Drawing.Point]::new(380, 88 + $bodyLift),
    [System.Drawing.Point]::new(370, 223 + $bodyLift)
  )
  $graphics.FillPolygon($fur, $leftEar)
  $graphics.DrawPolygon($outline, $leftEar)
  $graphics.FillPolygon($fur, $rightEar)
  $graphics.DrawPolygon($outline, $rightEar)

  $graphics.FillEllipse($cream, 202, 185 + $bodyLift, 108, 82)
  $graphics.FillEllipse($dark, 207, 177 + $bodyLift, 17, 22)
  $graphics.FillEllipse($dark, 288, 177 + $bodyLift, 17, 22)
  $graphics.FillEllipse($dark, 245, 211 + $bodyLift, 23, 18)
  $graphics.DrawArc($outline, 232, 218 + $bodyLift, 48, 38, 22, 136)
  $graphics.FillEllipse($pink, 249, 247 + $bodyLift, 15, 21)

  $graphics.FillEllipse($fur, 157, 374 + $bodyLift, 84, 83)
  $graphics.DrawEllipse($outline, 157, 374 + $bodyLift, 84, 83)
  $graphics.FillEllipse($fur, 271, 374 + $bodyLift, 84, 83)
  $graphics.DrawEllipse($outline, 271, 374 + $bodyLift, 84, 83)

  $path = Join-Path $resolvedOutput ('idle_{0:D4}.png' -f ($frameIndex + 1))
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $outline.Dispose()
  $fur.Dispose()
  $cream.Dispose()
  $dark.Dispose()
  $pink.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Write-Output "Generated $frameCount transparent PNG frames in $resolvedOutput"
