#!/bin/bash

# Helper script to copy a file from root to all packages.
declare -a packages=(auth core drupal-js-sdk error interfaces menu role settings storage xhr)

for pkg in "${packages[@]}"
do
  mv "./packages/${pkg}/test-build.js" "./packages/${pkg}/test-build.cjs"
done
