SRC = src/analytics.js \
		src/providers/google.js

MOCHA = mocha-phantomjs
PHANTOM = phantomjs

all: lint test docs build min

lint:
	@jshint --show-non-errors $(SRC)

test:
	$(MOCHA) test/index.html

build: $(SRC)
	cat $^ > analytics.js

docs: build
	~/src/jsdoc/jsdoc analytics.js -d docs

min: build
	uglifyjs -c --comments --mangle -o analytics.min.js analytics.js

integration: 
	$(PHANTOM) test/integration_testing/phantom_runner.js

.PHONY: docs test integration