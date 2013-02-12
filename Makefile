SRC = src/analytics.js \
		src/providers/google.js

MOCHA = mocha-phantomjs

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
	uglifyjs -c --comments -o analytics.min.js analytics.js

.PHONY: docs test