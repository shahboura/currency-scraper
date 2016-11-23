# currency-scrapper
Small currency scrapper RESTfull API built on top of node, scrapping Egyptian banks to obtain current currency rates.

# System Requirements
1. Running instance of [monogoDb](https://www.mongodb.com/)
2. Node v4.3.2 or higher

# To install

1. [Clone](https://github.com/shahboura/currency-scrapper.git) repository locally
2. Install [Gulp](https://www.npmjs.com/package/gulp) npm package globally
    `npm install -g gulp`
3. Install [PhantomJs](https://www.npmjs.com/package/phantomjs-prebuilt) npm package globally
    `npm install -g phantomjs-prebuilt`
4. Navigate to directory and run `npm install`

# To Run
1. From directory run `gulp`
2. From browser: http://localhost:8000/api/currencies

# To debug with default node built-in inspector
    node --inspect --debug-brk app.js
