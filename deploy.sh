#!/bin/bash

# Get the first 7 characters of the latest commit hash
commit_hash=$(git rev-parse --short HEAD)

# Print the first 7 characters of the commit hash
sed -i "s|<footer>commit here</footer>|<footer>$commit_hash</footer>|" exported/index.html
