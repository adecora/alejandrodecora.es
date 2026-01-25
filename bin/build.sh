#!/usr/bin/sh

yarn install  || exit 1
bin/build-posts.js || exit 2
bin/build.js || exit 3

sed -E "s/\/(app\.(css|js))/\/build\/\1/" -i httpdocs/index.html
sed -E "s/\/blog\.js/\/build\/blog.js/" -i httpdocs/til.html
sed -E "s/\/stylesheets\/blog\.css/\/build\/blog.css/" -i httpdocs/til.html
