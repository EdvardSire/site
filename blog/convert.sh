#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Usage: $0 <input_file>"
    exit 1
fi

input_file="$1"
output_file="out.html"

pandoc --standalone --template template.html "$input_file" > "$output_file"
sed -i 's/^[ \t]*//' "$output_file"

