TESTS = test/*.js
REPORTER = dot

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 600 \
		$(TESTS)

.PHONY: test

build:
	./node_modules/.bin/uglifyjs -o parseArgs.min.js index.js
.PHONY: build
