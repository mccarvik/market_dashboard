import { raw_data, asset_classes } from './data.js';
// import { getCookie } from './test.js';
// var request = require('request');
// var http = require('http');
import $ from 'jquery';

var API_KEY = 'J4d6zKiPjebay-zW7T8X';
var yahoo_crumble = {};

// download.finance.yahoo.com/d/quotes?s=^VIX&f=ab
var yahoo_live_root = 'http%3A//download.finance.yahoo.com/d/quotes%3Fs%3D$$$$$%26f%3Dl1p2kj';
var quandl_lbma_root = 'https%3A//www.quandl.com/api/v3/datasets/LBMA/$$$$$.json%3Fapi_key%3D*****%26start_date%3D^^^^^';
var quandl_lppm_root = 'https://www.quandl.com/api/v3/datasets/LPPM/$$$$$.json%3Fapi_key%3D*****%26start_date%3D^^^^^';
var quandl_currfx_root = 'https%3A//www.quandl.com/api/v3/datasets/CURRFX/$$$$$.json%3Fapi_key%3D*****%26start_date%3D^^^^^';
var quandl_chris_root = 'https%3A//www.quandl.com/api/v3/datasets/CHRIS/$$$$$.json%3Fapi_key%3D*****%26start_date%3D^^^^^'
var quandl_tsy_root = 'https://www.quandl.com/api/v3/datasets/USTREASURY/$$$$$.json%3Fapi_key%3D*****%26start_date%3D^^^^^';
var yahoo_hist_root = 'https://query1.finance.yahoo.com/v7/finance/download/$$$$$?period1=^^^^^&period2=*****&interval=1d&events=history&crumb=#####';


// CHRIS free historical futures : https://www.quandl.com/data/CHRIS-Wiki-Continuous-Futures
// NOTES
//      
//      google_live_root = 'http://finance.google.com/finance/info?client=ig&q='; // in case we need later
//      yahoo_live_root = 'http://download.finance.yahoo.com/d/quotes?s= <ENTER TICKER HERE> &f=ab'; // for reference
//      helpful URL for ^^^^ above link : https://greenido.wordpress.com/2009/12/22/work-like-a-pro-with-yahoo-finance-hidden-api/
//      var quandl_hist_root = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json?column_index=4&start_date=' + startDate + '&end_date=' + endDate + '&api_key=' + API_KEY;
//      quandl commodities historical: https://www.quandl.com/api/v1/datasets/LBMA/GOLD.json
//
//      Live saving link for CORS workaround: http://anyorigin.com/
// https://stackoverflow.com/questions/44044263/yahoo-finance-historical-data-downloader-url-is-not-working <---- might need this






export function ticker_setup(asset) {
    var accepted_assets = asset_classes[asset];
    var ticker_groups = [];
    // console.log(raw_data);
    
    for (var key in raw_data) {
        var tg = raw_data[key];
        var tg_name = key;
        
        // Check if ticker_group is in requested asset class
        if (accepted_assets.indexOf(tg_name) < 0) { continue; }
        
        var tickers = [];
        for (var tick_key in tg) {
            var tick_name = tick_key;
            
            var tick_els = tg[tick_key];
            tickers.push(new IndividualTicker(tick_name, tick_els[0], tick_els[1], tick_els[2], tick_els[3], tick_els[4]));
        }
        var TG = new TickerGroup(tg_name, tickers);
        ticker_groups.push(TG);
    }
    
    return ticker_groups;
}

function IndividualTicker(name, live_ticker, live_url, hist_ticker, hist_url, data_ind) {
    this.name = name;
    this.data_ind = data_ind;
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
            url = anyOriginIt(yahoo_live_root.replace('$$$$$', this.live_ticker));
        }
        // console.log(url);
        return url;
    };
    
    this.setUpHistTicker = function (url) {
        var endDate = new Date();
        var startDate = new Date();
        startDate.setYear(endDate.getFullYear() - 1);
        var endDate_unix = endDate.getFullYear() + '-' + this.addZero(endDate.getMonth() + 1) + '-' + this.addZero(endDate.getDate());
        var startDate_unix = startDate.getFullYear() + '-' + this.addZero(startDate.getMonth() + 1) + '-' + this.addZero(startDate.getDate());
        endDate = endDate.getFullYear() + '' + this.addZero(endDate.getMonth() + 1) + '' + this.addZero(endDate.getDate());
        startDate = startDate.getFullYear() + '' + this.addZero(startDate.getMonth() + 1) + '' + this.addZero(startDate.getDate());
        
        startDate_unix = new Date(startDate_unix).getTime();
        endDate_unix = new Date(endDate_unix).getTime();
        startDate_unix = startDate_unix.toString().slice(0,10);
        endDate_unix = endDate_unix.toString().slice(0,10);
        
        if (url === 'quandl_lbma') {
            url = anyOriginIt(quandl_lbma_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('^^^^^',startDate));
        } else if (url === 'quandl_llpm') {
            url = anyOriginIt(quandl_lppm_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('^^^^^',startDate));
        } else if (url === 'quandl_currfx') {
            url = anyOriginIt(quandl_currfx_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('^^^^^',startDate));
        } else if (url === 'quandl_chris') {
            url = anyOriginIt(quandl_chris_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('^^^^^',startDate));
        } else if (url === 'quandl_tsy') {
            url = anyOriginIt(quandl_tsy_root.replace('$$$$$', this.hist_ticker).replace('*****',API_KEY).replace('^^^^^',startDate));
        } else if (url === 'yahoo_hist') {
            // console.log(yahoo_hist_root.replace('$$$$$', this.hist_ticker).replace('*****',endDate_unix).replace('^^^^^',startDate_unix).replace('#####', yahoo_crumble));
            // url = anyOriginIt(yahoo_hist_root.replace('$$$$$', this.hist_ticker).replace('*****',endDate_unix).replace('^^^^^',startDate_unix).replace('#####', yahoo_crumble));
            url = anyOriginIt(yahoo_hist_root.replace('$$$$$', this.hist_ticker).replace('*****',endDate_unix).replace('^^^^^',startDate_unix).replace('#####', yahoo_crumble));
        }
        // console.log(url);
        return url;
    };
    
    this.live_url = this.setUpLiveTicker(live_url);
    this.hist_url = this.setUpHistTicker(hist_url);
}

function TickerGroup (name, tickers) {
    this.name = name;
    this.tickers = tickers;
}

function getHistStats(data, data_ind=1, ticker) {
    var max; var min;
    
    // HUGE hack for bad data with real estate
    if (ticker === 'DJ Real Estate IDX') {
        for (var a=0; a < data.length; a++) {
            if (data[a][data_ind] > 2800) {
                data[a][data_ind] = undefined;
                console.log(a + " removed");
            }
        }
    }
    
    
    for (var i=0; i < data.length; i++) {
        if (min === undefined || data[i][data_ind] < min) {
            if (data[i][data_ind] !== null && data[i][data_ind] !== 0) {
                min = data[i][data_ind];
            }
        }
        
        if (max === undefined || data[i][data_ind] > max) {
            max = data[i][data_ind];
        }
    }
    
    var last;
    for (var x=0; x<10; x++) {    
        last = data[x][data_ind];
        if (last !== null) {
            break;
        }
    }
    return [last, min, max];
}

function anyOriginIt(url) {
    return 'http://anyorigin.com/go?url=' + url + '&callback=?';
}

function whateverOriginIt(url) {
    return 'http://www.whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?'
}

function getData(url_live, url_hist, object, data_ind, callback) {
    /*  This function takes a ticker and will retrieve different data from an api
        that will be used to create a bloomberg style ticker to display in the dashboard
        
        @params tick (string) - the ticker to be used
        
        @return data (obj) - dictionary with 52 week hi, 52 week low, current px, and %change from yesterday)
    */
    
    // console.log(url_live);
    // console.log(url_hist);
    var check;
    getHistData(url_hist).then(function (hist_ret) {
        if (hist_ret.contents['dataset'] === undefined) {
            console.log('No historical for ' + object.props.name);
            callback(new Error('Missing historical data for ' + object.props.name), null);
        }
        check = getHistStats(hist_ret.contents['dataset']['data'], data_ind, object.props.name);
        return check;
    }).then(function (hist_stats) {
        getLiveData(url_live, hist_stats, object);
    }).then(function (){
        return true;
    });
    
    callback(null, true);
}
    
function getLiveData(url, hist_stats, object) {
    // NEEEEEEEEED anyorigin.com to work around the CORS error
    $.getJSON(url, function(data){
        // console.log(data);
	    var vals = data.contents.split(",");
	    var live = (parseFloat(vals[0]));
	    var chg = vals[1];
	    var hi = vals[2];
	    var lo = vals[3];
	    object.handleLiveData(live, chg, hi, lo, hist_stats);
    });
}

function getHistData(url) {
    // NEEEEEEEEED anyorigin.com to work around the CORS error
    return $.getJSON(url, function(data){
        // console.log(data);
    });
}

export function getYahooCrumble() {
    var link = anyOriginIt('https://finance.yahoo.com/quote/KO/history?p=KO');
    console.log(link);
    
    $.ajax({
      url: link,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      crossDomain: true,
      success: function(data, textStatus, jqXHR){
          console.log('getting crumb');
            var crumble_regex = /CrumbStore":{"crumb":"(.*?)"}/;
            // var cookie_regex = /Set-Cookie: (.*?)/;
            // console.log(data);
            yahoo_crumble.crumb = crumble_regex.exec(data.contents)[1];
            console.log(yahoo_crumble.crumb);
      },
    }).then(function() {
        var url = anyOriginIt('https://query1.finance.yahoo.com/v7/finance/download/^GSPC?period1=1468540800&period2=1500076800&interval=1d&events=history&crumb=$$$$$').replace('$$$$$', yahoo_crumble.crumb);
        console.log(url)
        console.log('here');
        $.ajax({
            url: url,
            headers : { 'Access-Control-Allow-Origin' : 'http://market-dashboard-mccarvik.c9users.io:8080/',
                        'Cookie' : 'B=4ekf4edcmn2ba&b=3&s=o5'},
            dataType: 'json',
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function(data, textStatus, jqXHR){
                console.log(data);
            }
        })
    });
    
}



function requestRetry(data, retryTimes, callback) {
    var cntr = 0;

    function run() {
        // try your async operation
        getData(data[0], data[1], data[2], data[3], function(err, new_data) {
            if (err) {
                ++cntr;
                var retryDelay = cntr * Math.random() * (2000 - 500) + 500;
                console.log(data[2].props.name + " failed on try: " + cntr);
                if (cntr >= retryTimes) {
                    // if it fails too many times, just send the error out
                    callback(err);
                } else {
                    // try again after a delay
                    setTimeout(run, retryDelay);
                }
            } else {
                // success, send the data out
                callback(null, new_data);
            }
        });
    }
    // start our first request
    run();
}


export function requestData(live_url, hist_url, object, data_ind, callback) {
    var data = [live_url, hist_url, object, data_ind];
    requestRetry(data, 3, callback)
}