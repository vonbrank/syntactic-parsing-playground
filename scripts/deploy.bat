@echo off

set SCRIPT_DIR=%~dp0
set DEPLOY_DIR=%SCRIPT_DIR%\..\deploy

xcopy /E /I /Y "%CD%\dist\*" "%DEPLOY_DIR%"

set year=%date:~0,4%
set month=%date:~5,2%
set day=%date:~8,2%
set hour=%time:~0,2%
if "%hour:~0,1%"==" " set hour=0%hour:~1,1%
set minute=%time:~3,2%
set second=%time:~6,2%
set timestamp=%year%-%month%-%day% %hour%:%minute%:%second%

cd "%DEPLOY_DIR%"
git init
git add .
git commit -m "Site deployed: %timestamp%"
git remote add origin git@github.com:vonbrank/Syntactic-Parsing-Playground.git
git branch -M gh-page
git push -f origin gh-page:gh-page

cd "%SCRIPT_DIR%\.."
rmdir /S /Q "%DEPLOY_DIR%"
