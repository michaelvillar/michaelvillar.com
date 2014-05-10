w:
	coffee -w -c -o public/js/ public/coffee

all:
	coffee -c -o public/js/ public/coffee
	uglifyjs public/js/index.js -m -c > public/js/index.min.js
