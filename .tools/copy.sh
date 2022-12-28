#!/bin/bash

# Helper script to copy a file from root to all packages.
declare -a packages=(auth core drupal-js-sdk error interfaces menu role settings storage xhr)

for pkg in "${packages[@]}"
do
  cp "${1}" "./packages/${pkg}/${1}"
done
