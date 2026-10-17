$ErrorActionPreference = 'Stop'
$destination = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\home'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$photos = @{
  'agriculture' = 'photo-1625246333195-78d9c38ad449'
  'textiles' = 'photo-1558171813-4c088753af8f'
  'chemicals' = 'photo-1532187863486-abf9dbad1b69'
  'machinery' = 'photo-1516937941344-00b4e0337589'
  'food-beverages' = 'photo-1586201375761-83865001e31c'
  'cargo-ship' = 'photo-1578575437130-527eed3abbec'
}
foreach ($photo in $photos.GetEnumerator()) {
  $width = if ($photo.Key -eq 'cargo-ship') { 1600 } else { 900 }
  $url = 'https://images.unsplash.com/' + $photo.Value + '?auto=format&fit=crop&w=' + $width + '&q=85'
  $fileName = if ($photo.Key -eq 'machinery') { 'industrial-machinery' } else { $photo.Key }
  & 'C:\Windows\System32\curl.exe' --fail --silent --show-error --location --connect-timeout 15 --max-time 60 $url --output (Join-Path $destination ($fileName + '.jpg'))
  if ($LASTEXITCODE -ne 0) { throw ('Download failed: ' + $photo.Key) }
  Write-Output ('Downloaded ' + $photo.Key)
}
& 'C:\Windows\System32\curl.exe' --fail --silent --show-error --location --connect-timeout 15 --max-time 60 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Pyrite-278315.jpg' --output (Join-Path $destination 'mineral-pyrite.jpg')
if ($LASTEXITCODE -ne 0) { throw 'Mineral photograph download failed' }
Write-Output 'Downloaded minerals'
& 'C:\Windows\System32\curl.exe' --fail --silent --show-error --location --connect-timeout 15 --max-time 60 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json' --output (Join-Path $destination 'world-countries.json')
if ($LASTEXITCODE -ne 0) { throw 'World geography download failed' }
Write-Output 'Downloaded world geography'