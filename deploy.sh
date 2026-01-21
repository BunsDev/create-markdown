#!/bin/bash

# Default to patch if no argument provided
VERSION_TYPE="${1:-patch}"

if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Error: Argument must be 'patch', 'minor', or 'major'"
  exit 1
fi

# Bump version
npm version "$VERSION_TYPE" --no-git-tag-version

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

echo "✅ Successfully deployed v$NEW_VERSION with $VERSION_TYPE version bump!"
