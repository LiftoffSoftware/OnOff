help:
	@echo "Available targets:"
	@echo "  build:       produce the minified version of the script"
	@echo "  tests:       execute the tests in the suite"
	@echo "  watch-tests: execute the tests on every file change"
	@echo "Tip: If getting errors about missing modules you may need to set NODE_PATH..."
	@echo "  export NODE_PATH=/usr/lib/node_modules/ # Make sure path is correct"

build:
	@uglifyjs --mangle --compress -o onoff.min.js onoff.js

tests:
	@mocha --reporter list .

watch-tests:
	@mocha \
		--watch . \
		|| true   # Prevent make returning error on ^C


.PHONY: test watch-tests build
