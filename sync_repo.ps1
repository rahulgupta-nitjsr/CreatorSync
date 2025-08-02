Write-Host "Starting repository synchronization..." -ForegroundColor Green

# Add .gitignore changes
git add .gitignore

# Remove progress.md from tracking if it exists
git rm --cached "memory-bank/progress.md" 2>$null

# Commit the changes
git commit -m "Update .gitignore to exclude progress.md"

# Push to remote repository
git push origin main

Write-Host "Synchronization completed!" -ForegroundColor Green
Read-Host "Press Enter to continue" 