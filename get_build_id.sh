grep '[OK] Build' package_output.log | sed -E 's/^[OK] Build ([0-9]+) has been submitted!/\1/' > packaged_number.txt
