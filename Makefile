install:
	npm install

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npm run webpack
	
test:
	npm test

publish:
	npm publish

lint:
	npx eslint .