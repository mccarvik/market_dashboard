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
    'Rates' : ['US Rates', 'Other', 'Custom'],
    'Commodities' : ['Energy', 'Metals', 'Agriculture', 'Meat / Live Stock'],
    'Currencies' : ['G10 Currencies', 'EM Currencies'],
};

export var raw_data = {
    'G10 Currencies' : {
        'USD/EUR' : ['EUR=X', 'yahoolive', 'USDEUR', 'quandl_currfx', 1],
        'USD/JPY' : ['JPY=X', 'yahoolive', 'USDJPY', 'quandl_currfx', 1],
        'USD/GBP' : ['GBP=X', 'yahoolive', 'USDGBP', 'quandl_currfx', 1],
        'USD/CAD' : ['CAD=X', 'yahoolive', 'USDCAD', 'quandl_currfx', 1],
        'USD/CHF' : ['CHF=X', 'yahoolive', 'USDCHF', 'quandl_currfx', 1],
        'USD/AUD' : ['AUD=X', 'yahoolive', 'USDAUD', 'quandl_currfx', 1],
        // 'USD/NZD' : ['NZD=X', 'yahoolive', 'USDNZD', 'quandl_currfx', 1],
        'USD/SEK' : ['SEK=X', 'yahoolive', 'USDSEK', 'quandl_currfx', 1],
        // 'USD/NOK' : ['NOK=X', 'yahoolive', 'USDNOK', 'quandl_currfx', 1],
        // 'USD/DKK' : ['DKK=X', 'yahoolive', 'USDDKK', 'quandl_currfx', 1],
    },
    'EM Currencies' : {
        'USD/MXN' : ['USDMXN=X', 'yahoolive', 'USDMXN', 'quandl_currfx', 1],
        'USD/BRL' : ['BRL=X', 'yahoolive', 'USDBRL', 'quandl_currfx', 1],
        'USD/CNY' : ['CNY=X', 'yahoolive', 'USDCNY', 'quandl_currfx', 1],
        'USD/SGD' : ['SGD=X', 'yahoolive', 'USDSGD', 'quandl_currfx', 1],
        // 'USD/HKD' : ['HKD=X', 'yahoolive', 'USDHKD', 'quandl_currfx', 1],
        // 'USD/ZAR' : ['USDZAR=X', 'yahoolive', 'USDZAR', 'quandl_currfx', 1],
        // 'USD/TRY' : ['TRY=X', 'yahoolive', 'USDTRY', 'quandl_currfx', 1],
        'USD/KRW' : ['KRW=X', 'yahoolive', 'USDKRW', 'quandl_currfx', 1],
        'USD/RUB' : ['RUB=X', 'yahoolive', 'USDRUB', 'quandl_currfx', 1],
        // 'USD/INR' : ['INR=X', 'yahoolive', 'USDINR', 'quandl_currfx', 1],
        // 'USD/IDR' : ['IDR=X', 'yahoolive', 'USDIDR', 'quandl_currfx', 1],
        // 'USD/ARS' : ['ARS=X', 'yahoolive', 'USDARS', 'quandl_currfx', 1],
    },
    'US Equities' : {
        'S&P500' : ['ES=F', 'yahoolive', 'CME_ES1', 'quandl_chris', 4],
        'DJIA' : ['YM=F', 'yahoolive', 'CME_YM1', 'quandl_chris', 4],
        'NASDAQ' : ['NQ=F', 'yahoolive', 'CME_NQ1', 'quandl_chris', 4],
        'RUS2K' : ['TF=F', 'yahoolive', 'ICE_TF1', 'quandl_chris', 4],
    },
    'Global Equities' : {
        // 'MSCI Emerging' : ['^GSPC', 'yahoolive', 'EUREX_FMEM1', 'quandl_chris', 4],
        'Eurostoxx' : ['^STOXX50E', 'yahoolive', 'EUREX_FESX1', 'quandl_chris', 4],
        'FTSE' : ['^FTSE', 'yahoolive', 'LIFFE_Z1', 'quandl_chris', 4],
        'DAX' : ['^GDAXI', 'yahoolive', 'EUREX_FDAX1', 'quandl_chris', 4],
        'CAC' : ['^FCHI', 'yahoolive', 'LIFFE_MFC1', 'quandl_chris', 4],
        'Nikkei' : ['^N225', 'yahoolive', 'CME_NK1', 'quandl_chris', 4],
        'Hang Seng' : ['^HSI', 'yahoolive', 'HKEX_HSI1', 'quandl_chris', 4],
        'Canada S&P/TSX' : ['^GSPTSE', 'yahoolive', 'MX_SCF1', 'quandl_chris', 7],
    },
    'Energy' : {
        'WTI Crude' : ['CL=F', 'yahoolive', 'ICE_T1', 'quandl_chris', 4],
        'Brent Crude' : ['BZ=F', 'yahoolive', 'ICE_B1', 'quandl_chris', 4],
        'Natural Gas' : ['NG=F', 'yahoolive', 'CME_QG1', 'quandl_chris', 4],
        // 'Heating Oil' : ['HO=F', 'yahoolive', 'ICE_O1', 'quandl_chris', 4]
    },
    'Metals' : {
        'Gold' : ['GC=F', 'yahoolive', 'CME_GC1', 'quandl_chris', 4],
        'Silver' : ['SI=F', 'yahoolive', 'CME_SI1', 'quandl_chris', 4],
        'Copper' : ['HG=F', 'yahoolive', 'CME_HG1', 'quandl_chris', 4],
        // 'Platinum' : ['PL=F', 'yahoolive', 'PLAT', 'quandl_llpm', 4]
    },
    'Agriculture' : {
        'Corn' : ['C=F', 'yahoolive', 'CME_C1', 'quandl_chris', 4],
        'Sugar' : ['SB=F', 'yahoolive', 'ICE_SB1', 'quandl_chris', 4],
        'Wheat' : ['W=F', 'yahoolive', 'CME_W1', 'quandl_chris', 4],
        // 'Soybean' : ['S=F', 'yahoolive', 'CME_S1', 'quandl_chris', 4],
        // 'Cotton' : ['CT=F', 'yahoolive', 'ICE_CT1', 'quandl_chris', 4],
        // 'Cocoa' : ['CC=F', 'yahoolive', 'ICE_CC1', 'quandl_chris', 4],
        'Coffee' : ['KC=F', 'yahoolive', 'ICE_KC1', 'quandl_chris', 4]
    },
    'Meat / Live Stock' : {
        'Live Cattle' : ['LC=F', 'yahoolive', 'CME_LC1', 'quandl_chris', 4],
        'Lean Hogs' : ['LH=F', 'yahoolive', 'CME_LN1', 'quandl_chris', 4],
        // 'Feeder Cattle' : ['FC=F', 'yahoolive', 'CME_FC1', 'quandl_chris', 4],
    },
    'US Rates' : {
        '3M' : ['^IRX', 'yahoolive', 'YIELD', 'quandl_tsy', 2],
        '5Y' : ['^FVX', 'yahoolive', 'YIELD', 'quandl_tsy', 7],
        '10Y' : ['^TNX', 'yahoolive', 'YIELD', 'quandl_tsy', 9],
        '30Y' : ['^TYX', 'yahoolive', 'YIELD', 'quandl_tsy', 11],
    },
    'Other' : {
        'VIX' : ['^VIX', 'yahoolive', 'CBOE_VX1', 'quandl_chris', 4],
        'Dollar IDX' : ['DX-Y.NYB', 'yahoolive', 'ICE_DX1', 'quandl_chris', 4],
        'DJ Real Estate IDX' : ['RX=F', 'yahoolive', 'CME_JR1', 'quandl_chris', 4]
    },
    // Using a sample of a premium DB from quandl here, there is a free one but will
    // need to reconfigure some stuff to format the data
    'Custom' : {
        'AAPL' : ['AAPL', 'yahoolive', 'AAPL', 'quandl_eod', 4],
        'XOM' : ['XOM', 'yahoolive', 'XOM', 'quandl_eod', 4],
        'JPM' : ['JPM', 'yahoolive', 'JPM', 'quandl_eod', 4],
        'JNJ' : ['JNJ', 'yahoolive', 'JNJ', 'quandl_eod', 4],
        'MCD' : ['MCD', 'yahoolive', 'MCD', 'quandl_eod', 4],
    }
    
    
};