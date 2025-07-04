#!/usr/bin/sh

npm install  || exit 1
bin/build.js || exit 2

sed -E "s/\/(app\.(css|js))/\/build\/\1/" -i httpdocs/index.html
