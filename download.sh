NEXT_WAIT_TIME=0
until ionic package download || [ $NEXT_WAIT_TIME -eq 10 ]; do
   sleep $(( NEXT_WAIT_TIME++ ))
done
