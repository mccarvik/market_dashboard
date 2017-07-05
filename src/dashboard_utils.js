import $ from 'jquery';
var googleFinance = require('google-finance');

export function ticker_setup() {
    var ticker_groups = [];
    var TG = new TickerGroup('US Equities', ['S&P 500', 'DJIA'], ['SPY', 'DIA']);
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

function getData(symbol) {
    var endDate = new Date();
    var startDate = new Date();
    startDate.setYear(endDate.getFullYear() - 1);
    endDate = (endDate.getMonth() + 1) + '' + endDate.getDate() + '' + endDate.getFullYear();
    startDate = (startDate.getMonth() + 1) + '' + startDate.getDate() + '' + startDate.getFullYear();
    
    var url_live = 'http://finance.google.com/finance/info?client=ig&q=' + symbol;
    var url_hist = 'http://www.google.com/finance/historical?q=' + symbol + '&startdate=' + startDate + '&enddate=' + endDate + '&output=csv';
    // console.log(url_hist);
    // console.log(url_live);
    var live;
    var hist;
    
    // Look into using quandl api
    // https://www.quandl.com/tools/api
    
    // JSONP used to work around Cross Origin Resource Sharing Problem
    console.log("bookend");
    $.ajax({
        url: url_live,
        dataType: 'jsonp',
        success: function(dataWeGotViaJsonp){
            console.log(dataWeGotViaJsonp);
            live = dataWeGotViaJsonp;
        }
    });
    
    $.ajax({
        url: url_hist,
        dataType: 'jsonp',
        success: function(dataWeGotViaJsonp){
            console.log('here');
            console.log(dataWeGotViaJsonp);
            hist = dataWeGotViaJsonp;
        }
    });
    
    console.log("bookend");
    return;
    
    // LOOK UP CORS
    
    // fetch(url_live, { 
    //   method: 'GET',
    //   headers:{
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Credentials':true,
    //     'Access-Control-Allow-Methods':'POST, GET'
    //   }
    // })
    // .then(function(response) {
    //     live = response;
    // }).then(console.log(live));
    // console.log("bookend");
    // return;
    
    
    // $.ajax({
    //     type: "GET",
    //     url: url_hist,
    //     dataType: "text",
    //     success: function(data) {
    //         hist = processData(data);
    //     }
    // });
    // console.log(hist);
    
    // $.getJSON(url_live).then((data) => {
    //     live = data;
    // });
    // console.log(live);
}
