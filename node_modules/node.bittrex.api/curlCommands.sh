#!/bin/bash
# Public:
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetCurrencies
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetTradePairs
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarkets
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarkets/6
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarket/100
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarket/100/6
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarketHistory/100
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarketOrders/100
# curl -H "Content-Type: application/json" -X GET https://www.cryptopia.co.nz/api/GetMarketOrders/100

##############################

# Private:
API_KEY='put your api key here'
API_SECRET='put your api secret here'

api_query(){
 method="$1"
 post_data="$2"
 [ -z "$post_data" ] && post_data="{}"
 url="https://www.cryptopia.co.nz/Api/$method"
 nonce="$(date +%s)"
 requestContentBase64String="$( printf "$post_data" | openssl dgst -md5 -binary | base64 )"
 url_encoded=$( printf $url | curl -Gso /dev/null -w %{url_effective} --data-urlencode @- "" | cut -c 3- | awk '{print tolower($0)}')
 signature="${API_KEY}POST${url_encoded}${nonce}${requestContentBase64String}"
 hmacsignature=$(echo -n $signature | openssl sha256 -binary -hmac "$(echo -n $API_SECRET | base64 -d)" | base64 )
 header_value="amx ${API_KEY}:${hmacsignature}:${nonce}"

 curl \
 --header "Authorization: $header_value" \
 --header "Content-Type: application/json; charset=utf-8" \
 --request 'POST' \
 --data "${post_data}" \
 "${url}"
}

#api_query SubmitTip '{"Currency": "INFX", "ActiveUsers": "10", "Amount": "20"}'
#api_query SubmitWithdraw '{"Currency": "INFX", "Address": "i7nCGp3G9SmGZ8HXprGuvdpHjXqHGF45n8", "Amount": "15"}'
#api_query GetBalance
echo
