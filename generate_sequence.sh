#!/bin/bash
output_file="output.txt"
# Clear the file or create it if it doesn't exist
> "$output_file"

# Generate elements from a to y with comma and space
for char in {a..y}
do
  printf "%s0 preto 333, " "$char" >> "$output_file"
done

# Generate the last element (z) without comma and space
printf "z0 preto 333" >> "$output_file"

echo "Sequence generated in $output_file" 