#!/bin/bash

SCRIPT_DIR="./dist"
DEPLOY_DIR="./deploy"

cp -r "$SCRIPT_DIR"/* "$DEPLOY_DIR"

cd "$DEPLOY_DIR"

git init
git add .
commit_message=$(date +"Site deployed: %Y-%m-%d %H:%M:%S")
git commit -m "$commit_message"
git remote add origin git@github.com:vonbrank/syntactic-parsing-playground.git
git branch -M gh-page
git push -f origin gh-page:gh-page

cd ..
rm -rf "$DEPLOY_DIR"