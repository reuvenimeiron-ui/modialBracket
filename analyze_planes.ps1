Add-Type -AssemblyName System.Drawing
$d = "c:\Users\meiron.reuveni\OneDrive - RADCOM Ltd\Documents\mondial bracket\modialBracket\public\new symbols"
$files = @("airplane.png","airplane-(2).png","take-off.png")
$results = @()

foreach($file in $files){
    $bmp = [System.Drawing.Bitmap]::new("$d\$file")
    $w=$bmp.Width; $h=$bmp.Height; $pts=@()
    for($x=0;$x-lt$w;$x++){
        $ys=@()
        for($y=0;$y-lt$h;$y++){
            $c=$bmp.GetPixel($x,$y)
            if($c.A-gt60 -and -not($c.R-gt220-and$c.G-gt220-and$c.B-gt220)){$ys+=$y}
        }
        if($ys.Count-gt10){
            $sorted=$ys|Sort-Object
            $med=$sorted[[int]($sorted.Count/2)]
            $pts+=[pscustomobject]@{X=$x;Y=$med}
        }
    }
    $bmp.Dispose()
    $n=$pts.Count
    if($n -gt 1){
        $sx=($pts|Measure-Object X -Sum).Sum
        $sy=($pts|Measure-Object Y -Sum).Sum
        $sxy=($pts|ForEach-Object{$_.X*$_.Y}|Measure-Object -Sum).Sum
        $sx2=($pts|ForEach-Object{$_.X*$_.X}|Measure-Object -Sum).Sum
        $slope=($n*$sxy-$sx*$sy)/($n*$sx2-$sx*$sx)
        $ang=[Math]::Round([Math]::Atan($slope)*180/[Math]::PI,2)
        $results += "$file  =>  angle=$ang  css=rotate($([Math]::Round(-$ang,2))deg)"
    } else {
        $results += "$file  =>  no data"
    }
}

$results | Out-File "c:\Users\meiron.reuveni\OneDrive - RADCOM Ltd\Documents\mondial bracket\modialBracket\plane_angles.txt" -Encoding UTF8
$results
