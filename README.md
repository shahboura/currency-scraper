# currency-scrapper
Small currency scrapper RESTfull API built on top of node, scrapping Egyptian banks to obtain current currency rates.

#To install

1. Grab and install [monogoDb](https://www.mongodb.com/)
2. Make sure db isntance is running using `mongod` command
3. [Clone](https://github.com/shahboura/currency-scrapper.git) repository locally
4. Install [Gulp](https://www.npmjs.com/package/gulp) npm package globally
    `npm install -g gulp`
5. Install [PhantomJs](https://www.npmjs.com/package/phantomjs-prebuilt) npm package globally
    `npm install -g phantomjs-prebuilt`
6. Navigate to directory and run `npm install`
7. After finish simply run `gulp`

#To debug with default node built-in inspector
    node --inspect --debug-brk app.js
