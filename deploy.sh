#!/bin/bash

# Get the new version from package.json
NEW_VERSION=$(node -p "require('./package.json').version")

# Build
bun run clean && bun run build

# Commit, tag, and push to GitHub
git add package.json
git commit -m "v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
git push origin main
git push origin "v$NEW_VERSION"

# Publish
bun publish --access public

echo "✅ Successfully deployed v$NEW_VERSION!"
