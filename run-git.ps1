$log = "C:\Users\srsew\websites\git-command-log.txt"
$repo = "C:\Users\srsew"
$lines = @("=== Git log $(Get-Date -Format o) ===", "Repo: $repo")

function Run-Git($args) {
  $cmd = "git $($args -join ' ')"
  $lines += "", "> $cmd"
  Push-Location $repo
  $out = & git @args 2>&1 | ForEach-Object { "$_" }
  $code = $LASTEXITCODE
  Pop-Location
  if ($out) { $lines += $out } else { $lines += "(no output)" }
  $lines += "exit: $code"
  return $code
}

if (-not (Test-Path "$repo\.git")) {
  $lines += "", "> git init (no .git found)"
  Push-Location $repo
  $out = git init 2>&1 | ForEach-Object { "$_" }
  Pop-Location
  $lines += $out
}

$c1 = Run-Git @("status")
$c2 = Run-Git @("add", ".")
$c3 = Run-Git @("commit", "-m", "Added website 002")
$c4 = -1
if ($c3 -eq 0) { $c4 = Run-Git @("push") }
else { $lines += "", "push skipped (commit exit $c3)" }

$lines += "", "SUMMARY: status=$c1 add=$c2 commit=$c3 push=$c4"
$lines -join "`n" | Set-Content $log -Encoding utf8
