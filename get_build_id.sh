grep 'Build ID' package_output.log | sed -E 's/^Build ID: ([0-9]+)/\1/' > packaged_number.txt
