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

var callback = function(_return /* The json returned for yahooapis */) {
    var totalReturned = _return.query.count;
    console.log(totalReturned);
    //OR: var totalReturned = _return.query.results.quote.length;
    // for (var i = 0; i < totalReturned; ++i) {
    //     var stock = _return.query.results.quote[i];
    //     var symbol = stock.symbol;
    //     var percent_change = stock.Change_PercentChange;
    //     var changeRealTime = stock.ChangeRealtime;
    // }
};

function getData(symbol) {
    symbol = 'MSFT';
    console.log(symbol);
    
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var startDate = '2012-01-01';
    var endDate = '2012-01-08';
    var data = encodeURIComponent('select * from yahoo.finance.historicaldata where symbol in (' + symbol + ') and startDate = "' + startDate + '" and endDate = "' + endDate + '"');
    $.getJSON(url, 'q=' + data + "&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", callback);
}

