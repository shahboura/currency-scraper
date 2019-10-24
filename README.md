# currency-scrapper

Small currency scrapper RESTful API built on top of node, scrapping Egyptian banks to obtain current currency rates.

## System Requirements

1. Node v4.3.2 or higher installed.
2. docker installed.

## To Run

1. [Clone](https://github.com/shahboura/currency-scrapper.git) repository locally
2. From directory run `docker build -t currency-scrapper .`
3. From directory run `docker run -p {PORT}:8080 -t currency-scrapper`

## Endpoints

* All rates ordered by banks: http://localhost:{PORT}/api/banks
* All rates for specific bank: http://localhost:{PORT}/api/banks/BANQUE-DU-CAIRE
* All rates ordered by currencies: http://localhost:{PORT}/api/currencies
* All rates for specific currency: http://localhost:{PORT}/api/currencies/USD

## To debug with default node built-in inspector

    node --inspect --debug-brk app.js
