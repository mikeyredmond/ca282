#!/bin/sh

n=`cat access.current | grep user`
touch file.txt

cut -b 21-25 access.current | grep '[0-9]' > file.txt
sort -u file.txt