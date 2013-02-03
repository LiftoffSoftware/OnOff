build:
	./node_modules/.bin/uglifyjs \
		--mangle --compress \
		-o onoff.min.js \
		onoff.js

test:
	./node_modules/.bin/mocha \
		--reporter list \
		.

.PHONY: test build