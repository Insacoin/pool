/* ============================================================
 * node.bittrex.api
 * https://github.com/n0mad01/node.bittrex.api
 *
 * ============================================================
 * Copyright 2014-2015, Adrian Soluch - http://soluch.us/
 * Released under the MIT License
 * ============================================================ */
var NodeCryptopia = function() {

    'use strict';

    var request = require('request'),
        hmac_sha512 = require('./hmac-sha512.js'),
        JSONStream = require('JSONStream'),
        es = require('event-stream');

    var start,
        request_options = {
            method: 'GET',
            agent: false,
            headers: {
                "User-Agent": "Mozilla/4.0 (compatible; SIGBOT Cryptopia API)",
                "Content-type": "application/x-www-form-urlencoded"
            }
        };

    var opts = {
        baseUrl: 'https://www.cryptopia.co.nz/api/',
        apikey: 'APIKEY',
        apisecret: 'APISECRET',
        verbose: false,
        cleartext: false,
        stream: false
    };

    var getNonce = function() {
        return Math.floor(new Date().getTime() / 1000);
    };

    var extractOptions = function(options) {

        var o = Object.keys(options),
            i;
        for (i = 0; i < o.length; i++) {
            opts[o[i]] = options[o[i]];
        }
    };

    var apiCredentials = function(uri) {

        var options = {
            apikey: opts.apikey,
            nonce: getNonce()
        };

        return setRequestUriGetParams(uri, options);
    };

    var setRequestUriGetParams = function(uri, options) {
        var op;
        if (typeof(uri) === 'object') {
            op = uri;
            uri = op.uri;
        } else {
            op = request_options;
        }


        var o = Object.keys(options),
            i;
        for (i = 0; i < o.length; i++) {
            uri = updateQueryStringParameter(uri, o[i], options[o[i]]);
        }

        op.headers.apisign = hmac_sha512.HmacSHA512(uri, opts.apisecret); // setting the HMAC hash `apisign` http header
        op.uri = uri;

        return op;
    };

    var updateQueryStringParameter = function(uri, key, value) {

        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";

        if (uri.match(re)) {
            uri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            uri = uri + separator + key + "=" + value;
        }

        return uri;
    };

    var sendRequestCallback = function(callback, op) {
        start = Date.now();

        switch (opts.stream) {

            case true:
                request(op)
                    .pipe(JSONStream.parse())
                    .pipe(es.mapSync(function(data) {
                        callback(data);
                        ((opts.verbose) ? console.log("streamed from " + op.uri + " in: %ds", (Date.now() - start) / 1000) : '');
                    }));
                break;
            case false:
                request(op, function(error, result, body) {
                    if (!body || !result || result.statusCode != 200) {
                        console.error(error);
                    } else {
                        callback(((opts.cleartext) ? body : JSON.parse(body)));
                        ((opts.verbose) ? console.log("requested from " + result.request.href + " in: %ds", (Date.now() - start) / 1000) : '');

                    }
                });
                break;
        }
    };

    return {
        options: function(options) {
            extractOptions(options);
        },
        sendCustomRequest: function(request_string, callback, credentials) {
            var op;

            if (credentials === true) {
                op = apiCredentials(request_string);
            } else {
                op = request_options;
                op.uri = request_string;
            }
            sendRequestCallback(callback, op);
        },

// Starts Cryptopia
        getmarkets: function(callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetMarkets';
            sendRequestCallback(callback, op);
        },
        getcurrencies: function(callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetCurrencies';
            sendRequestCallback(callback, op);
        },
        gettradepairs: function(callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetTradePairs';
            sendRequestCallback(callback, op);
        },
        getmarket: function(options, callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetMarket/' + options;
            sendRequestCallback(callback, op);
        },
        getmarkethistory: function(options, callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetMarketHistory/' + options;
            sendRequestCallback(callback, op);
        },
        getmarketorders: function(options, callback) {
            var op = request_options;
            op.uri = opts.baseUrl + 'GetMarketOrders/' + options;
            sendRequestCallback(callback, op);
        },

// Starts Private API - unfinished

        getbalances: function(callback) {
            var op = apiCredentials(opts.baseUrl + 'GetBalance/');
            sendRequestCallback(callback, op);
        },
        getbalance: function(options, callback) {
            var op = setRequestUriGetParams(apiCredentials(opts.baseUrl + 'GetBalance/'), options);
            sendRequestCallback(callback, op);
        },

// End of calls
    };

}();
