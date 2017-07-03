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


function getData(tick) {
    var url = 'http://query.yahooapis.com/v1/public/yql';
    var symbol = tick
    var data = encodeURIComponent("select * from yahoo.finance.quotes where symbol in ('" + symbol + "')");

    // $.getJSON(url, 'q=' + data + "&format=json&diagnostics=true&env=http://datatables.org/alltables.env")
    //     .done(function (data) {
    //         $('#result').text("Price: " + data.query.results.quote.LastTradePriceOnly);
    //     })
    //     .fail(function (jqxhr, textStatus, error) {
    //         var err = textStatus + ", " + error;
    //         console.log('Request failed: ' + err);
    //     });
}