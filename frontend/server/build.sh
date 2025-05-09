#!/bin/bash

cd "$(dirname "$0")"

# Clean previous builds
rm -rf dist

mkdir -p dist

# Build the server
echo "Building server..."
rsync -av --exclude='package*.json' --exclude='.gitignore' --exclude='dist' --exclude='build.sh' . dist 
