#!/bin/sh

n=$1
for i in $(seq $n)
do
   mkdir $(printf "dir.%06d" $i)
done