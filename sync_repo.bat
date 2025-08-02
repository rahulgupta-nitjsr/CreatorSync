@echo off
echo Starting repository synchronization...

REM Add .gitignore changes
git add .gitignore

REM Remove progress.md from tracking if it exists
git rm --cached "memory-bank/progress.md" 2>nul

REM Commit the changes
git commit -m "Update .gitignore to exclude progress.md"

REM Push to remote repository
git push origin main

echo Synchronization completed!
pause 