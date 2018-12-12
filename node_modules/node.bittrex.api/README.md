# Cryptopia

A (unofficial) Node.js API client for the [Cryptopia][cryptopia].

The client supports public (unauthenticated) calls to the [Cryptopia][cryptopia-api]. Private calls coming soon.

For private calls, the user secret is never exposed to other parts of the program or over the Web. The user key is sent as a header to the API, along with a signed request.

Repo home: [github.com/sigwo/node-cryptopia][repo]


## License

This Library was created by using parts of [Adrian Soluch (@n0mad01)](https://github.com/n0mad01/) [soluch.us](http://soluch.us) [node.bittrex.api] (https://github.com/n0mad01/node.bittrex.api/blob/master/node.bittrex.api.js) MIT, open source. See LICENSE file.

## Clone from GitHub

    git clone https://github.com/sigwo/node-cryptopia.git
    cd node-cryptopia
    npm install


## Require as a module

In your app, require the module:

    var Cryptopia = require('cryptopia');

If not installed via NPM, then provide the path to cryptopia.js

## Create an instance of the client

If only public API calls are needed, then no API key or secret is required:

    var cryptopia = new Cryptopia();

## Make API calls

All [Cryptopia API][cryptopia-api] methods are supported (with some name changes to avoid naming collisions). All methods require a callback function.

```
cryptopia.getcurrencies(function(data) {
  console.log(data);
});
```
Response:
```
{ Success: true,
  Message: null,
  Data:
   [ { Id: 2, Name: 'Dotcoin', Symbol: 'DOT', Algorithm: 'Scrypt' },
     { Id: 3, Name: 'Litecoin', Symbol: 'LTC', Algorithm: 'Scrypt' },
     { Id: 4, Name: 'Dogecoin', Symbol: 'DOGE', Algorithm: 'Scrypt' },
     { Id: 6, Name: 'Potcoin', Symbol: 'POT', Algorithm: 'Scrypt' },
     { Id: 9, Name: 'PopularCoin', Symbol: 'POP', Algorithm: 'Scrypt' },
     { Id: 11, Name: 'Reddcoin', Symbol: 'RDD', Algorithm: 'Scrypt' },
     ...
    Error: null }
streamed from https://www.cryptopia.co.nz/api/GetCurrencies in: 0.587s
```
```
cryptopia.getmarket('100', function(data) {
  console.log(data);
});
```
Response:
```
{ Success: true,
  Message: null,
  Data:
   { TradePairId: 100,
     Label: 'DOT/BTC',
     AskPrice: 2.0000000000000004e-7,
     BidPrice: 1.8000000000000002e-7,
     Low: 1.7000000000000004e-7,
     High: 2.0000000000000004e-7,
     Volume: 2710673.8817330003,
     LastPrice: 1.8000000000000002e-7,
     LastVolume: 200,
     BuyVolume: 89786389.71749353,
     SellVolume: 33485774.14500672,
     Change: 0 },
  Error: null }
streamed from https://www.cryptopia.co.nz/api/GetMarket/100 in: 0.631s
```
The callback is passed in a data object, the response from the API

For the most up-to-date API documentation, see [cryptopia/api][cryptopia-api].

[repo]: https://github.com/sigwo/node-cryptopia
[cryptopia]: https://cryptopia.co.nz
[cryptopia-api]: https://www.cryptopia.co.nz/Forum/Thread/255

## Future Private API calls

To use Cryptopia's trading API, your API key and secret must be provided:

    var cryptopia = new Cryptopia('API_KEY', 'API_SECRET');
