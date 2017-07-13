//      data is a dictionary of different ticker groups
//      Name of ticker group = key of the dictionary
//      Each ticker group holds a dictionary of its ticker items
//      Each ticker item name = key of dictionary
//      Each ticker will have a list of items in the order:
//          1. Live ticker, 2. live url, 3. hist ticker, 4. hist url
//          Urls may be actual url or code name for some framework, still
//          figuring that out

export var raw_data = {
    'G10 Currencies' : {
        'USD/EUR' : ['EUR=X', 'yahoolive', 'USDEUR', 'quandl_currfx'],
        'USD/GBP' : ['GBP=X', 'yahoolive', 'USDGBP', 'quandl_currfx'],
        'USD/JPY' : ['JPY=X', 'yahoolive', 'USDJPY', 'quandl_currfx'],
    },
    // 'US Equities' : {
    //     'DJIA' : ['^DJI', 'yahoolive'
    // },
    'Precious Metals' : {
        'Gold' : ['GCN17.CMX', 'yahoolive', 'GOLD', 'quandl_lbma'],
        'Silver' : ['SIN17.CMX', 'yahoolive', 'SILVER', 'quandl_lbma'],
        'Platinum' : ['PLQ17.NYM', 'yahoolive', 'PLAT', 'quandl_llpm']
    }
    
    
};