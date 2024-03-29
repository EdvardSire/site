#!/bin/bash

# Get the first 7 characters of the latest commit hash
commit_hash=$(git rev-parse --short HEAD)

# Print the first 7 characters of the commit hash
sed -i "s|<footer>commit here</footer>|<footer>$commit_hash</footer>|" exported/index.html

# Dotfiles
GET=exported/get-dotfiles.sh
curl -sS https://raw.githubusercontent.com/EdvardSire/dotfiles/main/Dockerfile | awk 'NR > 4 {sub(/^RUN /,"",$0); print}' > $GET
sed -i 's/\bapt\b/sudo &/g; s/\bmake\b/sudo &/g' $GET
echo -e '\necho "Remember to :PackerSync"' >> $GET

REMOVE=exported/remove-dotfiles.sh
curl -sS https://raw.githubusercontent.com/EdvardSire/dotfiles/main/remove-dotfiles.sh > $REMOVE



