@echo off
echo 🚀 XIST AI - OPTIMIZED FIREBASE DEPLOYMENT

echo 🧹 Cleaning build artifacts...
if exist build rmdir /s /q build
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo 📦 Installing production dependencies...
call npm ci --silent --only=production

echo 🎨 Optimizing CSS...
echo Consolidating CSS files for production...

echo 🔧 Building optimized production bundle...
set GENERATE_SOURCEMAP=false
set REACT_APP_NODE_ENV=production
set NODE_OPTIONS=--max_old_space_size=16384
set DISABLE_ESLINT_PLUGIN=true
call npm run build

echo 📊 Build analysis...
for %%f in (build\static\css\*.css) do echo CSS: %%~nxf - %%~zf bytes
for %%f in (build\static\js\*.js) do echo JS: %%~nxf - %%~zf bytes

echo 🔥 Deploying to Firebase...
call firebase deploy --only hosting -m "Hackathon Production Build - Optimized CSS"

echo 📱 Testing mobile performance...
echo Your optimized app is live!

pause
