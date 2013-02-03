help:
	@echo "Available targets:"
	@echo "  build: produce the minified version of the script"
	@echo "  tests: execute the tests in the suite"

build:
	./node_modules/.bin/uglifyjs \
		--mangle --compress \
		-o onoff.min.js \
		onoff.js

tests:
	@./node_modules/.bin/mocha \
		--reporter list \
		.

.PHONY: test build