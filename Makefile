help:
	@echo "Available targets:"
	@echo "  build:       produce the minified version of the script"
	@echo "  tests:       execute the tests in the suite"
	@echo "  watch-tests: execute the tests on every file change"

build:
	./node_modules/.bin/uglifyjs \
		--mangle --compress \
		-o onoff.min.js \
		onoff.js

tests:
	@./node_modules/.bin/mocha \
		--reporter list \
		.

watch-tests:
	@./node_modules/.bin/mocha \
		--watch \
		. \
		|| true   # Prevent make returning error on ^C


.PHONY: test watch-tests build