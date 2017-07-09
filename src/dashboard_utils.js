import $ from 'jquery';
// var googleFinance = require('google-finance');

var API_KEY = 'J4d6zKiPjebay-zW7T8X';

export function ticker_setup() {
    var ticker_groups = [];
    var TG = new TickerGroup('US Equities', ['DJIA'], ['DIA']);
    ticker_groups.push(TG);
    return ticker_groups;
}

function TickerGroup (name, labels, ticks) {
    this.name = name;
    this.tickers = {};
    for (var i=0; i<labels.length; i++) {
        this.tickers[labels[i]] = ticks[i];
    }
}

export function get_values(tick) {
    /*  This function takes a ticker and will retrieve different data from an api
        that will be used to create a bloomberg style ticker to display in the dashboard
        
        @params tick (string) - the ticker to be used
        
        @return data (obj) - dictionary with 52 week hi, 52 week low, current px, and %change from yesterday)
    */
    var data = getData(tick);
    return data;
}

function addZero(i) {
    if (parseInt(i, 10) < 10) {
        return "0" + i;
    } else {
        return i;
    }
}

function getHistStats(data) {
    var max; var min;
    for (var i=0; i < data.length; i++) {
        if (min === undefined || data[i][1] < min) {
            min = data[i][1];
        }
        
        if (max === undefined || data[i][1] > max) {
            max = data[i][1];
        }
    }
    var last = data[0][1];
    return [last, min, max];
}

function getData(symbol) {
    symbol = 'FB';
    var endDate = new Date();
    var startDate = new Date();
    startDate.setYear(endDate.getFullYear() - 1);
    endDate = endDate.getFullYear() + '' + addZero(endDate.getMonth() + 1) + '' + addZero(endDate.getDate());
    startDate = startDate.getFullYear() + '' + addZero(startDate.getMonth() + 1) + '' + addZero(startDate.getDate());
    
    var url_live = 'http://finance.google.com/finance/info?client=ig&q=' + symbol;
    var url_hist = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + API_KEY;
    // var url_hist = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '/data.json?api_key=' + API_KEY;
    // console.log(url_hist);
    var live;
    var hist;
    
    // Look into using quandl api --> https://www.quandl.com/tools/api
    
    // JSONP used to work around Cross Origin Resource Sharing Problem
    $.ajax({
        url: url_live,
        dataType: 'jsonp',
        success: function(dataWeGotViaJsonp){
            live = dataWeGotViaJsonp[0]['l'];
            console.log('live: ' + live);
        }
    });
    
    $.ajax({
        url: url_hist,
        dataType: 'json',
        success: function(dataWeGotViaJsonp){
            console.log('here');
            dataWeGotViaJsonp = dataWeGotViaJsonp['dataset']['data'];
            hist = getHistStats(dataWeGotViaJsonp);
            hist.unshift(parseFloat(live,10));
            console.log(hist);
        }
    });
    return hist;
}
