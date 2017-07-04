import $ from 'jquery';

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
    console.log(data);
    return null;
}

function getData(symbol) {
    var endDate = new Date()
    var startDate = new Date();
    startDate.setYear(endDate.getFullYear() - 1);
    endDate = (endDate.getMonth() + 1) + '' + endDate.getDate() + '' + endDate.getFullYear();
    startDate = (startDate.getMonth() + 1) + '' + startDate.getDate() + '' + startDate.getFullYear();
    
    var url_live = 'http://finance.google.com/finance/info?client=ig&q=' + symbol;
    var url_hist = 'http://www.google.com/finance/historical?q=' + symbol + '&startdate=' + startDate + '&enddate=' + endDate + '&output=csv';
    var live;
    var hist;
    
    $.ajax({
        type: "GET",
        url: url_hist,
        dataType: "text",
        success: function(data) {
            hist = processData(data);
        }
    });
    console.log(hist);
    
    $.getJSON(url_live, function(data) {
        live = data;
    });
    console.log(live);
    
}


function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length === headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    return lines;
}

