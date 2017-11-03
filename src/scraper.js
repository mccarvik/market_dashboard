import $ from 'jquery';


export function scrape() {
    var url = "https://finance.yahoo.com/quote/%5EDJI?p=^DJI"
    $.get(anyOriginIt(url), function(data) {
        console.log(data);
    });
}

function anyOriginIt(url) {
    return 'http://anyorigin.com/go?url=' + url + '&callback=?';
}