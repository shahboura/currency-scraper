# currency-scrapper
Small currency scrapper RESTfull API built on top of node, scrapping Egyptian banks to obtain current currency rates.

# System Requirements
1. Node v4.3.2 or higher installed

# To install

1. [Clone](https://github.com/shahboura/currency-scrapper.git) repository locally
2. Navigate to directory and run `npm install`

# To Run
1. From directory run `npm run gulp`
2. All rates ordered by banks: http://localhost:8000/api/banks
3. All rates for specific bank: http://localhost:8000/api/banks/BANQUE-DU-CAIRE
4. All rates ordered by currencies: http://localhost:8000/api/currencies
5. All rates for specific currency: http://localhost:8000/api/currencies/USD

# To debug with default node built-in inspector
    node --inspect --debug-brk app.js
