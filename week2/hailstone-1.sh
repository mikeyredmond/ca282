#!/bin/sh

read n
echo $n
i=1
while [ $i -lt 20 ]
do
   if [ $((n % 2)) -eq 1 ]
   then
      n=$((n * 3 + 1))
      echo $n
   else
      n=$((n / 2))
      echo $n
   fi
   i=$((i + 1))

done