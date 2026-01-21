#!/bin/bash

# Default to patch if no argument provided
VERSION_TYPE="${1:-patch}"

if [[ "$VERSION_TYPE" != "patch" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "major" ]]; then
  echo "Error: Argument must be 'patch', 'minor', or 'major'"
  exit 1
fi

# Bump version
npm version "$VERSION_TYPE" --no-git-tag-version

# Build
bun run clean && bun run build

# Publish
bun publish --access public

echo "✅ Successfully deployed with $VERSION_TYPE version bump!"
