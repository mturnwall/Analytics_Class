SRC = src/analytics.js

MOCHA = mocha-phantomjs

all: lint test docs build min

lint:
	@jshint --show-non-errors $(SRC)

test:
	$(MOCHA) test/index.html

docs:
	~/src/jsdoc/jsdoc $(SRC) -d docs

build: $(SRC)
	cat $^ > analytics.js

min: build
	uglifyjs -c --comments -o analytics.min.js analytics.js

.PHONY: test