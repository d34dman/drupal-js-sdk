#!/bin/bash

# Helper script to update package.json

declare -a packages=(auth core drupal-js-sdk error interfaces menu role settings storage xhr)

# Eg. jq '.type="module" | .main="./dist/index.js"' "$file" > "$tmp" && mv "$tmp" "$file"
for pkg in "${packages[@]}"
do
  file="./packages/${pkg}/package.json"
  tmp=$(mktemp)
  # jq '.scripts.build="rollup -c"' "$file" > "$tmp" && mv "$tmp" "$file"
  # jq 'del(.exports)' "$file" > "$tmp" && mv "$tmp" "$file"
  # jq '.scripts."test-build"="pnpm run build && node test-build.cjs"' "$file" > "$tmp" && mv "$tmp" "$file"
  # jq '.scripts."test-build"="pnpm run build && node test-build.js"' "$file" > "$tmp" && mv "$tmp" "$file"
  jq 'del(.scripts.tsc)' "$file" > "$tmp" && mv "$tmp" "$file"
done
