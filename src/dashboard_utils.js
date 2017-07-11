import $ from 'jquery';
// https://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance

var API_KEY = 'J4d6zKiPjebay-zW7T8X';
var google_live_root = 'http://finance.google.com/finance/info?client=ig&q=';
// var quandl_hist_root = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + API_KEY;

export function ticker_setup() {
    var ticker_groups = [];
    
    var ticks;
    var TG = new TickerGroup('US Equities', ['DJIA'], ['DIA']);
    ticker_groups.push(TG);
    
    return ticker_groups;
}

function TickerConfig (name, hist_url, live_url) {
    this.name = name;
    this.hist_url = 
    this.live_url = google_live_root + '.INX';
}

function TickerGroup (name, labels, ticks) {
    this.name = name;
    this.tickers = {};
    for (var i=0; i<labels.length; i++) {
        this.tickers[labels[i]] = ticks[i];
    }
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

export function getData(symbol, object) {
    /*  This function takes a ticker and will retrieve different data from an api
        that will be used to create a bloomberg style ticker to display in the dashboard
        
        @params tick (string) - the ticker to be used
        
        @return data (obj) - dictionary with 52 week hi, 52 week low, current px, and %change from yesterday)
    */
    
    // var symbol = stats.tick;
    symbol = 'MCD';
    var endDate = new Date();
    var startDate = new Date();
    startDate.setYear(endDate.getFullYear() - 1);
    endDate = endDate.getFullYear() + '' + addZero(endDate.getMonth() + 1) + '' + addZero(endDate.getDate());
    startDate = startDate.getFullYear() + '' + addZero(startDate.getMonth() + 1) + '' + addZero(startDate.getDate());
    
    var url_live = 'http://finance.google.com/finance/info?client=ig&q=' + symbol;
    var url_hist = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + API_KEY;
    // var url_hist = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '/data.json?api_key=' + API_KEY;
    // console.log(url_hist);
    
    // Look into using quandl api --> https://www.quandl.com/tools/api
    // JSONP used to work around Cross Origin Resource Sharing Problem
    return getHistData(url_hist).then(function (hist_ret) {
        return getHistStats(hist_ret['dataset']['data']);
    }).then(function (hist_stats) {
        // console.log(hist_stats);
        getLiveData(url_live, hist_stats, object)
    }).then(function (){
        return true;
    });
}

function getLiveData(url, hist_stats, object) {
    $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(dataWeGotViaJsonp){
                var live = parseFloat(dataWeGotViaJsonp[0]['l'],10); 
                // console.log('live: ' + live);
                object.handleLiveData(live, hist_stats);
                }
    });
}

function getHistData(url) {
    return $.ajax({
                url: url,
                dataType: 'json',
                success: function(dataWeGotViaJsonp){
                    dataWeGotViaJsonp = dataWeGotViaJsonp['dataset']['data'];
                    // console.log('hist: ' + dataWeGotViaJsonp);
                    return getHistStats(dataWeGotViaJsonp);
                }
            }) 
}