@echo off
cd /d C:\Users\srsew
echo === GIT LOG %DATE% %TIME% === > C:\Users\srsew\websites\git-out.txt
if exist .git (echo REPO: C:\Users\srsew >> C:\Users\srsew\websites\git-out.txt) else (echo NO .git in C:\Users\srsew >> C:\Users\srsew\websites\git-out.txt)
git status >> C:\Users\srsew\websites\git-out.txt 2>&1
git add . >> C:\Users\srsew\websites\git-out.txt 2>&1
git commit -m "recreated website 001" >> C:\Users\srsew\websites\git-out.txt 2>&1
git push >> C:\Users\srsew\websites\git-out.txt 2>&1
echo DONE exit=%ERRORLEVEL% >> C:\Users\srsew\websites\git-out.txt
