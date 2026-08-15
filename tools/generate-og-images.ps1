Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$root = Split-Path -Parent $PSScriptRoot
$palette = @{
  Background = [System.Drawing.Color]::FromArgb(247, 245, 240)
  Card = [System.Drawing.Color]::FromArgb(255, 255, 253)
  Ink = [System.Drawing.Color]::FromArgb(31, 34, 37)
  Muted = [System.Drawing.Color]::FromArgb(101, 111, 119)
  Green = [System.Drawing.Color]::FromArgb(36, 92, 83)
  Mint = [System.Drawing.Color]::FromArgb(229, 241, 237)
  Gold = [System.Drawing.Color]::FromArgb(241, 211, 116)
  Peach = [System.Drawing.Color]::FromArgb(240, 185, 151)
  Blue = [System.Drawing.Color]::FromArgb(142, 193, 203)
  Rose = [System.Drawing.Color]::FromArgb(233, 151, 169)
}

function New-RoundedPath([float]$x, [float]$y, [float]$w, [float]$h, [float]$radius) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $radius * 2
  $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
  $path.AddArc($x + $w - $diameter, $y, $diameter, $diameter, 270, 90)
  $path.AddArc($x + $w - $diameter, $y + $h - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($x, $y + $h - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Base($graphics, [string]$title, [string]$subtitle, [string]$tag) {
  $graphics.Clear($palette.Background)
  $cardPath = New-RoundedPath 52 52 1096 526 32
  $graphics.FillPath([System.Drawing.SolidBrush]::new($palette.Card), $cardPath)
  $graphics.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(221, 215, 202), 2), $cardPath)
  $graphics.FillRectangle([System.Drawing.SolidBrush]::new($palette.Green), 82, 104, 13, 390)
  $graphics.FillEllipse([System.Drawing.SolidBrush]::new($palette.Mint), 111, 106, 70, 70)
  $graphics.DrawString("DL", [System.Drawing.Font]::new("Arial", 21, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($palette.Green), 128, 126)
  $graphics.DrawString("Daily Logic Lab", [System.Drawing.Font]::new("Arial", 29, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($palette.Green), 205, 116)
  $graphics.DrawString($title, [System.Drawing.Font]::new("Arial", 45, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($palette.Ink), 108, 222)
  $graphics.DrawString($subtitle, [System.Drawing.Font]::new("Arial", 21), [System.Drawing.SolidBrush]::new($palette.Muted), [System.Drawing.RectangleF]::new(110, 294, 530, 76))
  $tagPath = New-RoundedPath 108 420 420 52 24
  $graphics.FillPath([System.Drawing.SolidBrush]::new($palette.Mint), $tagPath)
  $graphics.DrawString($tag, [System.Drawing.Font]::new("Arial", 17, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($palette.Green), [System.Drawing.RectangleF]::new(126, 432, 390, 30))
  $boardPath = New-RoundedPath 694 77 402 400 30
  $graphics.FillPath([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $boardPath)
  $graphics.DrawPath([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(215, 209, 198), 2), $boardPath)
}

function Draw-Tents($graphics) {
  $x = 756; $y = 130; $cell = 48; $size = 6
  $trees = @(@(0,1),@(1,4),@(2,2),@(3,5),@(4,0),@(5,3))
  $tents = @(@(0,3),@(1,0),@(2,5),@(3,2),@(4,4),@(5,1))
  for ($row = 0; $row -lt $size; $row++) {
    for ($col = 0; $col -lt $size; $col++) {
      $graphics.FillRectangle([System.Drawing.SolidBrush]::new($(if (($row + $col) % 2 -eq 0) { $palette.Mint } else { [System.Drawing.Color]::FromArgb(244, 248, 246) })), $x + $col*$cell, $y + $row*$cell, $cell, $cell)
      $graphics.DrawRectangle([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(188, 205, 198), 1), $x + $col*$cell, $y + $row*$cell, $cell, $cell)
    }
  }
  foreach ($tree in $trees) {
    $cx = $x + $tree[1]*$cell + 24; $cy = $y + $tree[0]*$cell + 23
    $graphics.FillEllipse([System.Drawing.SolidBrush]::new($palette.Green), $cx-13, $cy-17, 26, 28)
    $graphics.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(126, 84, 54)), $cx-3, $cy+6, 6, 12)
  }
  foreach ($tent in $tents) {
    $left = $x + $tent[1]*$cell + 11; $top = $y + $tent[0]*$cell + 12
    $points = [System.Drawing.Point[]]@([System.Drawing.Point]::new($left+13,$top),[System.Drawing.Point]::new($left+28,$top+27),[System.Drawing.Point]::new($left,$top+27))
    $graphics.FillPolygon([System.Drawing.SolidBrush]::new($palette.Peach), $points)
    $graphics.DrawPolygon([System.Drawing.Pen]::new($palette.Ink, 2), $points)
  }
}

function Draw-Hashi($graphics) {
  $pen1 = [System.Drawing.Pen]::new($palette.Green, 7); $pen2 = [System.Drawing.Pen]::new($palette.Gold, 5)
  $points = @(@(760,155,2),@(900,155,3),@(1030,155,1),@(760,280,3),@(900,280,4),@(1030,280,2),@(760,405,1),@(900,405,3),@(1030,405,2))
  foreach ($edge in @(@(0,1),@(1,2),@(0,3),@(1,4),@(1,4),@(2,5),@(3,4),@(4,5),@(3,6),@(4,7),@(4,7),@(5,8),@(6,7),@(7,8))) {
    $a=$points[$edge[0]]; $b=$points[$edge[1]]
    $graphics.DrawLine($(if ($edge[0] -eq 1 -and $edge[1] -eq 4) {$pen2} else {$pen1}), $a[0],$a[1],$b[0],$b[1])
  }
  foreach ($point in $points) {
    $graphics.FillEllipse([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $point[0]-24,$point[1]-24,48,48)
    $graphics.DrawEllipse([System.Drawing.Pen]::new($palette.Ink, 4), $point[0]-24,$point[1]-24,48,48)
    $graphics.DrawString([string]$point[2], [System.Drawing.Font]::new("Arial", 18, [System.Drawing.FontStyle]::Bold), [System.Drawing.SolidBrush]::new($palette.Ink), $point[0]-7,$point[1]-13)
  }
}

function Draw-Slitherlink($graphics) {
  $x=755; $y=130; $cell=48
  for($row=0;$row -le 6;$row++){for($col=0;$col -le 6;$col++){$graphics.FillEllipse([System.Drawing.SolidBrush]::new($palette.Ink),$x+$col*$cell-3,$y+$row*$cell-3,6,6)}}
  $numbers=@(@(0,0,2),@(0,2,1),@(0,4,3),@(1,1,2),@(1,3,2),@(2,0,1),@(2,2,3),@(2,5,2),@(3,1,2),@(3,4,1),@(4,0,3),@(4,3,2),@(4,5,2),@(5,2,1),@(5,4,3))
  foreach($n in $numbers){$graphics.DrawString([string]$n[2],[System.Drawing.Font]::new("Arial",18,[System.Drawing.FontStyle]::Bold),[System.Drawing.SolidBrush]::new($palette.Muted),$x+$n[1]*$cell+17,$y+$n[0]*$cell+13)}
  $loop=@(@(0,1),@(0,5),@(1,5),@(1,6),@(5,6),@(5,4),@(6,4),@(6,1),@(5,1),@(5,0),@(2,0),@(2,1),@(0,1))
  $pen=[System.Drawing.Pen]::new($palette.Green,8);$pen.StartCap='Round';$pen.EndCap='Round'
  for($i=0;$i -lt $loop.Count-1;$i++){$graphics.DrawLine($pen,$x+$loop[$i][1]*$cell,$y+$loop[$i][0]*$cell,$x+$loop[$i+1][1]*$cell,$y+$loop[$i+1][0]*$cell)}
}

function Draw-Nonogram($graphics) {
  $x=757; $y=132; $cell=29; $pattern=@(
    "0011001100","0111111110","1111111111","1111111111","0111111110",
    "0011111100","0001111000","0000110000","0000000000","0000000000")
  for($row=0;$row -lt 10;$row++){for($col=0;$col -lt 10;$col++){
    $color=$(if($pattern[$row][$col] -eq '1'){$palette.Green}else{[System.Drawing.Color]::FromArgb(240,244,242)})
    $graphics.FillRectangle([System.Drawing.SolidBrush]::new($color),$x+$col*$cell,$y+$row*$cell,$cell,$cell)
    $graphics.DrawRectangle([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190,201,196),1),$x+$col*$cell,$y+$row*$cell,$cell,$cell)
  }}
  $graphics.DrawString("2  4  4  2",[System.Drawing.Font]::new("Consolas",15,[System.Drawing.FontStyle]::Bold),[System.Drawing.SolidBrush]::new($palette.Muted),808,105)
}

function Draw-Killer($graphics) {
  $x=748; $y=118; $cell=35
  for($i=0;$i -le 9;$i++){
    $thickness=$(if($i%3 -eq 0){4}else{1});$pen=[System.Drawing.Pen]::new($palette.Ink,$thickness)
    $graphics.DrawLine($pen,$x+$i*$cell,$y,$x+$i*$cell,$y+9*$cell);$graphics.DrawLine($pen,$x,$y+$i*$cell,$x+9*$cell,$y+$i*$cell)
  }
  $cagePen=[System.Drawing.Pen]::new($palette.Green,2);$cagePen.DashStyle='Dash'
  foreach($rect in @(@(0,0,2,2),@(2,0,3,2),@(5,0,2,3),@(7,0,2,2),@(0,2,3,2),@(3,2,2,3),@(7,2,2,3),@(0,4,2,3),@(5,3,2,3),@(2,5,3,2),@(7,5,2,2),@(0,7,3,2),@(3,7,3,2),@(6,7,3,2))){$graphics.DrawRectangle($cagePen,$x+$rect[0]*$cell+3,$y+$rect[1]*$cell+3,$rect[2]*$cell-6,$rect[3]*$cell-6)}
  foreach($label in @(@(0,0,'10'),@(2,0,'15'),@(5,0,'12'),@(7,0,'8'),@(0,2,'17'),@(3,2,'20'),@(7,2,'14'),@(0,4,'23'),@(5,3,'16'),@(2,5,'19'),@(7,5,'11'),@(0,7,'18'),@(3,7,'21'),@(6,7,'24'))){$graphics.DrawString($label[2],[System.Drawing.Font]::new("Arial",8,[System.Drawing.FontStyle]::Bold),[System.Drawing.SolidBrush]::new($palette.Green),$x+$label[0]*$cell+5,$y+$label[1]*$cell+4)}
  foreach($digit in @(@(1,0,'4'),@(4,0,'7'),@(8,1,'6'),@(2,2,'8'),@(5,3,'5'),@(0,5,'9'),@(6,5,'2'),@(3,6,'6'),@(8,7,'1'),@(4,8,'3'))){$graphics.DrawString($digit[2],[System.Drawing.Font]::new("Arial",17,[System.Drawing.FontStyle]::Bold),[System.Drawing.SolidBrush]::new($palette.Ink),$x+$digit[0]*$cell+11,$y+$digit[1]*$cell+9)}
}

$cards = @(
  @{ File='og-tents-and-trees.png'; Title='Tents and Trees'; Subtitle='Place one tent beside every tree. Tents never touch.'; Tag='Daily + unlimited practice'; Draw=${function:Draw-Tents} },
  @{ File='og-hashi.png'; Title='Hashi'; Subtitle='Connect every island with one or two bridges.'; Tag='Bridges without crossings'; Draw=${function:Draw-Hashi} },
  @{ File='og-slitherlink.png'; Title='Slitherlink'; Subtitle='Draw one continuous loop from the number clues.'; Tag='One clean closed loop'; Draw=${function:Draw-Slitherlink} },
  @{ File='og-nonogram.png'; Title='Nonogram'; Subtitle='Reveal a picture from row and column clues.'; Tag='Picross logic puzzles'; Draw=${function:Draw-Nonogram} },
  @{ File='og-killer-sudoku.png'; Title='Killer Sudoku'; Subtitle='Find cage combinations by sum and cell count.'; Tag='Free combination calculator'; Draw=${function:Draw-Killer} }
)

foreach ($card in $cards) {
  $bitmap = [System.Drawing.Bitmap]::new($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  Draw-Base $graphics $card.Title $card.Subtitle $card.Tag
  & $card.Draw $graphics
  $bitmap.Save((Join-Path $root $card.File), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose()
}

Write-Output "Generated $($cards.Count) game-specific OG images"
