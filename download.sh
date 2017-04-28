set -e
NEXT_WAIT_TIME=0
until ionic package download `cat packaged_number.txt` || [ $NEXT_WAIT_TIME -eq 16 ]; do
   sleep $(( NEXT_WAIT_TIME++ ))
done
ls *.ipa
