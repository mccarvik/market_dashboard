var request = require('request');
var rp = require('request-promise');
var http = require('http');

function getCookie(link) {
    console.log('getting cookie');
    var cookie;
    var crumb;
    
    return rp.get(link,function(err, res, body) {
        if(err) {
            console.log('GET request failed here is error');
            console.log(err);
        }
            
        // console.log(res);
        // console.log(body);
        // console.log(res.rawHeaders);
        var responseCookies = res.headers['set-cookie'];
        cookie = responseCookies[0].split(';')[0];
        console.log(cookie);
    }).then(function(data){
        var url = 'http://anyorigin.com/go?url=https://query1.finance.yahoo.com/v7/finance/download/^GSPC?period1=1468540800&period2=1500076800&interval=1d&events=history&crumb=$$$$$&callback='.replace('$$$$$', crumb);
        // console.log(url);
        // return $.getJSON(url, function(data){
        //     // console.log(data);
        // });
    });
        
}

// var link = 'https://finance.yahoo.com/quote/KO/history?p=KO';   
// getCookie(link);