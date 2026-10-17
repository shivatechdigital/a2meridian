$ErrorActionPreference = 'Stop'
$destination = Join-Path (Split-Path $PSScriptRoot -Parent) 'public\about'
New-Item -ItemType Directory -Force -Path $destination | Out-Null
$photos = @{
  'warehouse' = 'photo-1586528116311-ad8dd3c8310d'
  'company-office' = 'photo-1560179707-f14e90ef3623'
  'office-interior' = 'photo-1497366216548-37526070297c'
  'dispatch' = 'photo-1553413077-190dd305871c'
  'profile-founder' = 'photo-1560250097-0b93528c311a'
  'profile-operations' = 'photo-1573496359142-b8d87734a5a2'
  'profile-exports' = 'photo-1472099645785-5658abf4ff4e'
  'profile-imports' = 'photo-1580489944761-15a19d654956'
  'documents' = 'photo-1450101499163-c8848c66ca85'
}
foreach ($photo in $photos.GetEnumerator()) {
  $width = if ($photo.Key.StartsWith('profile-')) { 650 } else { 1600 }
  $url = 'https://images.unsplash.com/' + $photo.Value + '?auto=format&fit=crop&w=' + $width + '&q=85'
  & 'C:\Windows\System32\curl.exe' --fail --silent --show-error --location --connect-timeout 15 --max-time 60 $url --output (Join-Path $destination ($photo.Key + '.jpg'))
  if ($LASTEXITCODE -ne 0) { throw ('Download failed: ' + $photo.Key) }
  Write-Output ('Downloaded ' + $photo.Key)
}