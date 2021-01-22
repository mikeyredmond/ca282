#!/bin/sh

n=`cat access.current | grep user`
touch file.txt

cut -b 44-52 access.current | grep user > file.txt
sort -u file.txt