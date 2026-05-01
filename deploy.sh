#!/bin/bash
echo "Resetting git repository to remove large files from history..."
rm -rf .git
git init
git add .
git commit -m "Clean commit for deployment"
git branch -M main
git remote add origin https://github.com/ssupyafa/MyAgri.git
echo "Pushing to GitHub..."
git push -u origin main --force
echo "Done!"
