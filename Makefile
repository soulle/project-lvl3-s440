install:
	npm install

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack
	
test:
	npm test

publish:
	npm publish

lint:
	npx eslint .

deploy:
	make build
	surge ./dist --domain rss-reader-soulle.surge.sh
