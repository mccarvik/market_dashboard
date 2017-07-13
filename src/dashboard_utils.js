import { raw_data } from './data.js'
import $ from 'jquery';
// https://stackoverflow.com/questions/3139879/how-do-i-get-currency-exchange-rates-via-an-api-such-as-google-finance

var API_KEY = 'J4d6zKiPjebay-zW7T8X';
// yahoo live root alterred to utilize anyorigin.com
var yahoo_live_root = 'http://anyorigin.com/go?url=http%3A//download.finance.yahoo.com/d/quotes%3Fs%3D$$$$$%26f%3Dab&callback=?';
var quandl_lbma_root = 'https://www.quandl.com/api/v3/datasets/LBMA/$$$$$.json?api_key=*****&start_date=&&&&&';
var quandl_lppm_root = 'https://www.quandl.com/api/v3/datasets/lppm/$$$$$.json?api_key=*****&start_date=&&&&&';

// NOTES
//      
//      google_live_root = 'http://finance.google.com/finance/info?client=ig&q='; // in case we need later
//      yahoo_live_root = 'http://download.finance.yahoo.com/d/quotes?s=GCN17.CMX&f=ab'; // for reference
//      helpful URL for ^^^^ above link : https://greenido.wordpress.com/2009/12/22/work-like-a-pro-with-yahoo-finance-hidden-api/
//      var quandl_hist_root = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + API_KEY;
//      quandl commodities historical: https://www.quandl.com/api/v1/datasets/LBMA/GOLD.json
//
//      Live saving link for CORS workaround: http://anyorigin.com/



export function ticker_setup() {
    var ticker_groups = [];
    console.log('here');
    console.log(raw_data);
    
    for (var key in raw_data) {
        var tg = raw_data[key];
        var tg_name = key;
        var tickers = [];
        for (var tick_key in tg) {
            var tick_name = tick_key;
            var tick_els = tg[tick_key];
            tickers.push(new IndividualTicker(tick_name, tick_els[0], tick_els[1], tick_els[2], tick_els[3]));
        }
        console.log(tickers);
        var TG = new TickerGroup(tg_name, tickers);
        ticker_groups.push(TG);
    }
    
    return ticker_groups;
}

function IndividualTicker(name, live_ticker, live_url, hist_ticker, hist_url) {
    this.name = name;
    this.live_ticker = live_ticker;
    this.hist_ticker = hist_ticker;
    
    this.addZero = function(i) {
        if (parseInt(i, 10) < 10) {
            return "0" + i;
        } else {
            return i;
        }
    };
    
    this.setUpLiveTicker = function (url) {
        if (url === 'yahoolive') {
            url = yahoo_live_root.replace('$$$$$', this.live_ticker);
        }
        return url;
    };
    
    this.setUpHistTicker = function (url) {
        var endDate = new Date();
        var startDate = new Date();
        startDate.setYear(endDate.getFullYear() - 1);
        endDate = endDate.getFullYear() + '' + this.addZero(endDate.getMonth() + 1) + '' + this.addZero(endDate.getDate());
        startDate = startDate.getFullYear() + '' + this.addZero(startDate.getMonth() + 1) + '' + this.addZero(startDate.getDate());
        
        if (url === 'quandl_lbma') {
            url = quandl_lbma_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('&&&&&',startDate);
        } else if (url === 'quandl_llpm') {
            url = quandl_lppm_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('&&&&&',startDate);
        }
        return url;
    };
    
    this.live_url = this.setUpLiveTicker(live_url);
    this.hist_url = this.setUpHistTicker(hist_url);
}

function TickerGroup (name, tickers) {
    this.name = name;
    this.tickers = tickers;
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

export function getData(url_live, url_hist, object) {
    /*  This function takes a ticker and will retrieve different data from an api
        that will be used to create a bloomberg style ticker to display in the dashboard
        
        @params tick (string) - the ticker to be used
        
        @return data (obj) - dictionary with 52 week hi, 52 week low, current px, and %change from yesterday)
    */
    
    console.log(url_live);
    console.log(url_hist);
    
    
    // Look into using quandl api --> https://www.quandl.com/tools/api
    // JSONP used to work around Cross Origin Resource Sharing Problem
    return getHistData(url_hist).then(function (hist_ret) {
        return getHistStats(hist_ret['dataset']['data']);
    }).then(function (hist_stats) {
        getLiveData(url_live, hist_stats, object);
    }).then(function (){
        return true;
    });
}

function getLiveData(url, hist_stats, object) {
    // NEEEEEEEEED anyorigin.com to work around the CORS error
    // $.getJSON('http://anyorigin.com/go?url=http%3A//download.finance.yahoo.com/d/quotes%3Fs%3D' + ticker + '%26f%3Dab&callback=?', function(data){
    $.getJSON(url, function(data){
	    var vals = data.contents.split(',');
	    var live = (parseFloat(vals[0]) + parseFloat(vals[1]))/2;
	    object.handleLiveData(live, hist_stats);
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