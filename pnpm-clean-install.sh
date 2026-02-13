#!/bin/bash

# pnpm-clean-install.sh
# Script to clean node_modules and package-lock.json then reinstall dependencies

echo "🧹 Cleaning up pnpm dependencies..."

# Remove node_modules directory if it exists
if [ -d "node_modules" ]; then
    echo "Removing node_modules directory..."
    rm -rf node_modules
    echo "✅ node_modules removed"
else
    echo "ℹ️  node_modules directory not found"
fi

# Remove pnpm-lock.yaml if it exists
if [ -f "pnpm-lock.yaml" ]; then
    echo "Removing pnpm-lock.yaml..."
    rm pnpm-lock.yaml
    echo "✅ pnpm-lock.yaml removed"
else
    echo "ℹ️  pnpm-lock.yaml not found"
fi

# Remove package-lock.yaml if it exists
if [ -f "package-lock.yaml" ]; then
    echo "Removing package-lock.yaml..."
    rm package-lock.yaml
    echo "✅ package-lock.yaml removed"
else
    echo "ℹ️  package-lock.yaml not found"
fi

# Run pnpm install
echo "📦 Running pnpm install..."
pnpm install

if [ $? -eq 0 ]; then
    echo "✅ pnpm install completed successfully!"
    echo "🔒 Running pnpm approve-builds..."
    (sleep 2; echo "a"; sleep 2; echo "y") | pnpm approve-builds
else
    echo "❌ pnpm install failed!"
    exit 1
fi
