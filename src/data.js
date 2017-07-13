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
        'USD/JPY' : ['JPY=X', 'yahoolive', 'USDJPY', 'quandl_currfx'],
        'USD/GBP' : ['GBP=X', 'yahoolive', 'USDGBP', 'quandl_currfx'],
        'USD/CAD' : ['CAD=X', 'yahoolive', 'USDCAD', 'quandl_currfx'],
        'USD/CHF' : ['CHF=X', 'yahoolive', 'USDCHF', 'quandl_currfx'],
        'USD/AUD' : ['AUD=X', 'yahoolive', 'USDAUD', 'quandl_currfx'],
        'USD/NZD' : ['NZD=X', 'yahoolive', 'USDNZD', 'quandl_currfx'],
        'USD/SEK' : ['SEK=X', 'yahoolive', 'USDSEK', 'quandl_currfx'],
        'USD/NOK' : ['NOK=X', 'yahoolive', 'USDNOK', 'quandl_currfx'],
        'USD/DKK' : ['DKK=X', 'yahoolive', 'USDDKK', 'quandl_currfx'],
    },
    'EM Currencies' : {
        'USD/MXN' : ['USDMXN=X', 'yahoolive', 'USDMSN', 'quandl_currfx'],
        'USD/BRL' : ['BRL=X', 'yahoolive', 'USDBRL', 'quandl_currfx'],
        'USD/CNY' : ['CNY=X', 'yahoolive', 'USDCNY', 'quandl_currfx'],
        'USD/SGD' : ['SGD=X', 'yahoolive', 'USDSGD', 'quandl_currfx'],
        'USD/HKD' : ['HKD=X', 'yahoolive', 'USDHKD', 'quandl_currfx'],
        'USD/ZAR' : ['USDZAR=X', 'yahoolive', 'USDZAR', 'quandl_currfx'],
        'USD/TRY' : ['TRY=X', 'yahoolive', 'USDTRY', 'quandl_currfx'],
        'USD/KRW' : ['KRW=X', 'yahoolive', 'USDKRW', 'quandl_currfx'],
        'USD/RUB' : ['RUB=X', 'yahoolive', 'USDRUB', 'quandl_currfx'],
        'USD/INR' : ['INR=X', 'yahoolive', 'USDINR', 'quandl_currfx'],
        'USD/IDR' : ['IDR=X', 'yahoolive', 'USDIDR', 'quandl_currfx'],
        'USD/ARS' : ['ARS=X', 'yahoolive', 'USDARS', 'quandl_currfx'],
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