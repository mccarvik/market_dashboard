//      data is a dictionary of different ticker groups
//      Name of ticker group = key of the dictionary
//      Each ticker group holds a dictionary of its ticker items
//      Each ticker item name = key of dictionary
//      Each ticker will have a list of items in the order:
//          1. Live ticker, 2. live url, 3. hist ticker, 4. hist url
//          Urls may be actual url or code name for some framework, still
//          figuring that out

export var asset_classes = {
    'Equities' : ['US Equities', 'Global Equities'],
    'Rates' : ['US Rates', 'Other'],
    'Commodities' : ['Energy', 'Metals', 'Agriculture'],
    'Currencies' : ['G10 Currencies', 'EM Currencies'],
};

export var raw_data = {
    'G10 Currencies' : {
        'USD/EUR' : ['EUR=X', 'yahoolive', 'USDEUR', 'quandl_currfx'],
        'USD/JPY' : ['JPY=X', 'yahoolive', 'USDJPY', 'quandl_currfx'],
        'USD/GBP' : ['GBP=X', 'yahoolive', 'USDGBP', 'quandl_currfx'],
        'USD/CAD' : ['CAD=X', 'yahoolive', 'USDCAD', 'quandl_currfx'],
        // 'USD/CHF' : ['CHF=X', 'yahoolive', 'USDCHF', 'quandl_currfx'],
        // 'USD/AUD' : ['AUD=X', 'yahoolive', 'USDAUD', 'quandl_currfx'],
        // 'USD/NZD' : ['NZD=X', 'yahoolive', 'USDNZD', 'quandl_currfx'],
        // 'USD/SEK' : ['SEK=X', 'yahoolive', 'USDSEK', 'quandl_currfx'],
        // 'USD/NOK' : ['NOK=X', 'yahoolive', 'USDNOK', 'quandl_currfx'],
        // 'USD/DKK' : ['DKK=X', 'yahoolive', 'USDDKK', 'quandl_currfx'],
    },
    'EM Currencies' : {
        'USD/MXN' : ['USDMXN=X', 'yahoolive', 'USDMXN', 'quandl_currfx'],
        'USD/BRL' : ['BRL=X', 'yahoolive', 'USDBRL', 'quandl_currfx'],
        'USD/CNY' : ['CNY=X', 'yahoolive', 'USDCNY', 'quandl_currfx'],
        // 'USD/SGD' : ['SGD=X', 'yahoolive', 'USDSGD', 'quandl_currfx'],
        // 'USD/HKD' : ['HKD=X', 'yahoolive', 'USDHKD', 'quandl_currfx'],
        // 'USD/ZAR' : ['USDZAR=X', 'yahoolive', 'USDZAR', 'quandl_currfx'],
        // 'USD/TRY' : ['TRY=X', 'yahoolive', 'USDTRY', 'quandl_currfx'],
        // 'USD/KRW' : ['KRW=X', 'yahoolive', 'USDKRW', 'quandl_currfx'],
        // 'USD/RUB' : ['RUB=X', 'yahoolive', 'USDRUB', 'quandl_currfx'],
        // 'USD/INR' : ['INR=X', 'yahoolive', 'USDINR', 'quandl_currfx'],
        // 'USD/IDR' : ['IDR=X', 'yahoolive', 'USDIDR', 'quandl_currfx'],
        // 'USD/ARS' : ['ARS=X', 'yahoolive', 'USDARS', 'quandl_currfx'],
    },
    'US Equities' : {
        'S&P500' : ['ES=F', 'yahoolive', 'CME_ES1', 'quandl_chris'],
        'DJIA' : ['YM=F', 'yahoolive', 'CME_YM1', 'quandl_chris'],
        'NASDAQ' : ['NQ=F', 'yahoolive', 'CME_NQ1', 'quandl_chris'],
        'RUS2K' : ['TF=F', 'yahoolive', 'ICE_TF1', 'quandl_chris'],
    },
    'Global Equities' : {
        // 'MSCI Emerging' : ['^GSPC', 'yahoolive', 'EUREX_FMEM1', 'quandl_chris'],
        // 'Eurostoxx' : ['^GSPC', 'yahoolive', 'EUREX_FESX1', 'quandl_chris'],
        // 'FTSE' : ['^GSPC', 'yahoolive', 'LIFFE_Z1', 'quandl_chris'],
        // 'DAX' : ['^GSPC', 'yahoolive', 'EUREX_FDAX1', 'quandl_chris`'],
        // 'CAC' : ['^GSPC', 'yahoolive', 'LIFFE_MFC1', 'quandl_chris'],
        // 'Nikkei' : ['^GSPC', 'yahoolive', 'CME_NK1', 'quandl_chris`'],
        // 'Canada TSX' : ['^GSPC', 'yahoolive', 'MX_SCF1', 'quandl_chris`'],
    },
    'Energy' : {
        'WTI Crude' : ['CL=F', 'yahoolive', 'ICE_T1', 'quandl_chris'],
        'Brent Crude' : ['BZ=F', 'yahoolive', 'ICE_B1', 'quandl_chris'],
        'Natural Gas' : ['NG=F', 'yahoolive', 'CME_QG1', 'quandl_chris'],
        // 'Heating Oil' : ['HO=F', 'yahoolive', 'ICE_O1', 'quandl_chris']
    },
    'Metals' : {
        'Gold' : ['GC=F', 'yahoolive', 'GOLD', 'quandl_lbma'],
        'Silver' : ['SI=F', 'yahoolive', 'SILVER', 'quandl_lbma'],
        // 'Platinum' : ['PL=F', 'yahoolive', 'PLAT', 'quandl_llpm'],
        // 'Copper' : ['HG=F', 'yahoolive', 'CME_HG1', 'quandl_chris']
    },
    'Agriculture' : {
        'Corn' : ['C=F', 'yahoolive', 'CME_C1', 'quandl_chris'],
        'Sugar' : ['SB=F', 'yahoolive', 'ICE_SB1', 'quandl_chris'],
        // 'Wheat' : ['W=F', 'yahoolive', 'CME_W1', 'quandl_chris'],
        // 'Soybean' : ['S=F', 'yahoolive', 'CME_S1', 'quandl_chris'],
        'Cotton' : ['CT=F', 'yahoolive', 'ICE_CT1', 'quandl_chris'],
        // 'Cocoa' : ['CC=F', 'yahoolive', 'ICE_CC1', 'quandl_chris']
    },
    'Other' : {
        'VIX' : ['^VIX', 'yahoolive', 'CBOE_VX1', 'quandl_chris'],
        'Dollar IDX' : ['DX-Y.NYB', 'yahoolive', 'ICE_DX1', 'quandl_chris']
    },
    'Rates' : {
        '5Y' : ['^FVX', 'yahoolive', ['YIELD', 6], 'quandl_tsy'],
        '10Y' : ['^TNX', 'yahoolive', ['YIELD', 8], 'quandl_tsy'],
        '30Y' : ['^TYX', 'yahoolive', ['YIELD10', 10], 'quandl_tsy'],
    }
    
    
};