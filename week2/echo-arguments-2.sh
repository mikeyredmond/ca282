#!/bin/sh

n=1
for i in "$@"
do
   echo $n. $i
   n=$((n + 1))
done
