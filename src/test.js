var request = require('request');
// var http = require('http');
    
export function getCookie() {
    console.log('here2');
    var link ='http://anyorigin.com/go?url=https://finance.yahoo.com/quote/KO/history?p=KO&callback=?';
    // http.get(link, function(response) {
    //     // console.log(response);
    //     cookie = response.headers['set-cookie'];
    // });
    
    request.get(link,function(err, res, body) {
            if(err) {
                console.log('GET request failed here is error');
                console.log(res);
            }
            
            // console.log(res);
            //Get cookies from response
            var responseCookies = res.headers['set-cookie'];
            console.log(responseCookies[0])
            // var requestCookies='';
            // for(var i=0; i<responseCookies.length; i++){
            //     var oneCookie = responseCookies[i];
            //     oneCookie = oneCookie.split(';');
            //     requestCookies= requestCookies + oneCookie[0]+';';
            // }
    });
}