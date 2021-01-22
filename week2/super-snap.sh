#!/bin/sh

cat | awk 's[$0]++ {print;exit}' 