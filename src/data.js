//      data is a dictionary of different ticker groups
//      Name of ticker group = key of the dictionary
//      Each ticker group holds a dictionary of its ticker items
//      Each ticker item name = key of dictionary
//      Each ticker will have a list of items in the order:
//          1. Live ticker, 2. live url, 3. hist ticker, 4. hist url
//          Urls may be actual url or code name for some framework, still
//          figuring that out

export var asset_classes = {
    "Equities" : ["US Equities", "Global Equities"],
    "Rates" : ["US Rates", "Other", "Custom"],
    "Commodities" : ["Energy", "Metals", "Agriculture", "Meat / Live Stock"],
    "Currencies" : ["G10 Currencies", "EM Currencies"],
    "Sectors" : ["US Equity Sectors"]
};

export var raw_data = {
    "G10 Currencies" : {
        "USD/EUR" : ["EUR=X", "yahoolive", "USDEUR", "quandl_currfx", 1, 0.5],
        "USD/JPY" : ["JPY=X", "yahoolive", "USDJPY", "quandl_currfx", 1, 0.5],
        "USD/GBP" : ["GBP=X", "yahoolive", "USDGBP", "quandl_currfx", 1, 0.5],
        "USD/CAD" : ["CAD=X", "yahoolive", "USDCAD", "quandl_currfx", 1, 0.5],
        "USD/CHF" : ["CHF=X", "yahoolive", "USDCHF", "quandl_currfx", 1, 0.5],
        "USD/AUD" : ["AUD=X", "yahoolive", "USDAUD", "quandl_currfx", 1, 0.5],
        // "USD/NZD" : ["NZD=X", "yahoolive", "USDNZD", "quandl_currfx", 1, 0.5],
        "USD/SEK" : ["SEK=X", "yahoolive", "USDSEK", "quandl_currfx", 1, 0.5],
        // "USD/NOK" : ["NOK=X", "yahoolive", "USDNOK", "quandl_currfx", 1, 0.5],
        // "USD/DKK" : ["DKK=X", "yahoolive", "USDDKK", "quandl_currfx", 1, 0.5],
    },
    "EM Currencies" : {
        "USD/MXN" : ["USDMXN=X", "yahoolive", "USDMXN", "quandl_currfx", 1, 0.5],
        "USD/BRL" : ["BRL=X", "yahoolive", "USDBRL", "quandl_currfx", 1, 0.5],
        "USD/CNY" : ["CNY=X", "yahoolive", "USDCNY", "quandl_currfx", 1, 0.5],
        "USD/SGD" : ["SGD=X", "yahoolive", "USDSGD", "quandl_currfx", 1, 0.5],
        // "USD/HKD" : ["HKD=X", "yahoolive", "USDHKD", "quandl_currfx", 1, 0.5],
        // "USD/ZAR" : ["USDZAR=X", "yahoolive", "USDZAR", "quandl_currfx", 1, 0.5],
        // "USD/TRY" : ["TRY=X", "yahoolive", "USDTRY", "quandl_currfx", 1, 0.5],
        "USD/KRW" : ["KRW=X", "yahoolive", "USDKRW", "quandl_currfx", 1, 0.5],
        "USD/RUB" : ["RUB=X", "yahoolive", "USDRUB", "quandl_currfx", 1, 0.5],
        // "USD/INR" : ["INR=X", "yahoolive", "USDINR", "quandl_currfx", 1, 0.5],
        // "USD/IDR" : ["IDR=X", "yahoolive", "USDIDR", "quandl_currfx", 1, 0.5],
        // "USD/ARS" : ["ARS=X", "yahoolive", "USDARS", "quandl_currfx", 1, 0.5],
    },
    "US Equities" : {
        "S&P500" : ["^GSPC", "yahoolive", "CME_ES1", "quandl_chris", 4, 1],
        "DJIA" : ["^DJI", "yahoolive", "CME_YM1", "quandl_chris", 4, 1],
        "NASDAQ" : ["^IXIC", "yahoolive", "CME_NQ1", "quandl_chris", 4, 1],
        "RUS2K" : ["^RUT", "yahoolive", "ICE_TF1", "quandl_chris", 4, 1],
    },
    "Global Equities" : {
        // "MSCI Emerging" : ["^GSPC", "yahoolive", "EUREX_FMEM1", "quandl_chris", 4, 1],
        "Eurostoxx" : ["^STOXX50E", "yahoolive", "EUREX_FESX1", "quandl_chris", 4, 1],
        "FTSE" : ["^FTSE", "yahoolive", "LIFFE_Z1", "quandl_chris", 4, 1],
        "DAX" : ["^GDAXI", "yahoolive", "EUREX_FDAX1", "quandl_chris", 4, 1],
        "CAC" : ["^FCHI", "yahoolive", "LIFFE_MFC1", "quandl_chris", 4, 1],
        "Nikkei" : ["^N225", "yahoolive", "CME_NK1", "quandl_chris", 4, 1],
        "Hang Seng" : ["^HSI", "yahoolive", "HKEX_HSI1", "quandl_chris", 4, 1],
        "Kospi" : ["^KS11", "yahoolive", "", "quandl_chris", 4, 1],
        "Canada S&P/TSX" : ["^GSPTSE", "yahoolive", "MX_SCF1", "quandl_chris", 7, 1],
        "Ibovespa" : ["^BVSP", "yahoolive", "CME_IBV1", "quandl_chris", 4, 1],
    },
    "Energy" : {
        "WTI Crude" : ["CL=F", "yahoolive", "ICE_T1", "quandl_chris", 4, 2],
        "Brent Crude" : ["BZ=F", "yahoolive", "ICE_B1", "quandl_chris", 4, 2],
        "Natural Gas" : ["NG=F", "yahoolive", "CME_QG1", "quandl_chris", 4, 1],
        // "Heating Oil" : ["HO=F", "yahoolive", "ICE_O1", "quandl_chris", 4, 1]
    },
    "Metals" : {
        "Gold" : ["GC=F", "yahoolive", "CME_GC1", "quandl_chris", 4, 1],
        "Silver" : ["SI=F", "yahoolive", "CME_SI1", "quandl_chris", 4, 1],
        "Copper" : ["HG=F", "yahoolive", "CME_HG1", "quandl_chris", 4, 1],
        // "Platinum" : ["PL=F", "yahoolive", "PLAT", "quandl_llpm", 4, 1]
    },
    "Agriculture" : {
        "Corn" : ["C=F", "yahoolive", "CME_C1", "quandl_chris", 4, 1],
        "Sugar" : ["SB=F", "yahoolive", "ICE_SB1", "quandl_chris", 4, 1],
        "Wheat" : ["W=F", "yahoolive", "CME_W1", "quandl_chris", 4, 1],
        // "Soybean" : ["S=F", "yahoolive", "CME_S1", "quandl_chris", 4, 1],
        // "Cotton" : ["CT=F", "yahoolive", "ICE_CT1", "quandl_chris", 4, 1],
        // "Cocoa" : ["CC=F", "yahoolive", "ICE_CC1", "quandl_chris", 4, 1],
        "Coffee" : ["KC=F", "yahoolive", "ICE_KC1", "quandl_chris", 4, 1]
    },
    "Meat / Live Stock" : {
        "Live Cattle" : ["LC=F", "yahoolive", "CME_LC1", "quandl_chris", 4, 1],
        "Lean Hogs" : ["LH=F", "yahoolive", "CME_LN1", "quandl_chris", 4, 1],
        // "Feeder Cattle" : ["FC=F", "yahoolive", "CME_FC1", "quandl_chris", 4, 1],
    },
    "US Rates" : {
        "3M" : ["^IRX", "yahoolive", "YIELD", "quandl_tsy", 2, 1],
        "5Y" : ["^FVX", "yahoolive", "YIELD", "quandl_tsy", 7, 1],
        "10Y" : ["^TNX", "yahoolive", "YIELD", "quandl_tsy", 9, 1],
        "30Y" : ["^TYX", "yahoolive", "YIELD", "quandl_tsy", 11, 1],
    },
    "Other" : {
        "VIX" : ["^VIX", "yahoolive", "CBOE_VX1", "quandl_chris", 4, 5],
        "Dollar IDX" : ["DX-Y.NYB", "yahoolive", "ICE_DX1", "quandl_chris", 4, 1],
        "DJ Real Estate IDX" : ["RX=F", "yahoolive", "CME_JR1", "quandl_chris", 4, 1]
    },
    // Using a sample of a premium DB from quandl here, there is a free one but will
    // need to reconfigure some stuff to format the data
    "Custom" : {
        "AAPL" : ["AAPL", "yahoolive", "AAPL", "quandl_eod", 4, 1],
        "XOM" : ["XOM", "yahoolive", "XOM", "quandl_eod", 4, 1],
        "JPM" : ["JPM", "yahoolive", "JPM", "quandl_eod", 4, 1],
        "JNJ" : ["JNJ", "yahoolive", "JNJ", "quandl_eod", 4, 1],
        "MCD" : ["MCD", "yahoolive", "MCD", "quandl_eod", 4, 1],
    },
    "US Equity Sectors" : {
        "Technology" : ["^SP500-45", "yahoolive", "", "quandl_eod", 4, 1],
        "Financials" : ["^SP500-40", "yahoolive", "", "quandl_eod", 4, 1],
        "Healthcare" : ["^SP500-35", "yahoolive", "", "quandl_eod", 4, 1],
        "Industrials" : ["^SP500-20", "yahoolive", "", "quandl_eod", 4, 1],
        "Consumer Discretionary" : ["^SP500-25", "yahoolive", "", "quandl_eod", 4, 1],
        "Consumer Staples" : ["^SP500-30", "yahoolive", "", "quandl_eod", 4, 1],
        "Energy" : ["^GSPE", "yahoolive", "", "quandl_eod", 4, 1],
        "Utilities" : ["^SP500-55", "yahoolive", "", "quandl_eod", 4, 1],
        "Real Estate" : ["^SP500-60", "yahoolive", "", "quandl_eod", 4, 1],
        "Materials" : ["^SP500-15", "yahoolive", "", "quandl_eod", 4, 1],
        "Telecom" : ["^SP500-50", "yahoolive", "", "quandl_eod", 4, 1],
    }
    
    
    
};