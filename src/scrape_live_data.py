"""
Script scrapes data from htmls of yahoo finance,
google finance and quandl API
"""
import pdb
import json
import datetime
# import pandas as pd
from time import monotonic
import requests
from bs4 import BeautifulSoup
from yahoofinancials import YahooFinancials


# Google Finance MSCI ticker - EFS:INDEXCBOE
HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'}
COMMS = ["CL=F", "BZ=F", "NG=F", "HO=F", "PL=F", "HG=F", "GC=F", "SI=F",
        "ZC=F", "SB=F", "KE=F", "KC=F", "ZS=F", "CT=F", "CC=F", "LBS=F",
        "LE=F", "HE=F", "FC=F", "^IRX", "^FVX", "^TNX", "^TYX"]
RANGE_TICKS = ['XTL:NYSEARCA', "VWO:NYSEARCA", "VPL:NYSEARCA", "VRP:NYSEARCA",
               "DJUSRE:INDEXDJX", "SPGSCI:INDEXSP", "EFS:INDEXCBOE", "VGK:NYSEARCA"]

# SELENUM TOO SLOW
# import selenium

# for currency data
# https://blog.quandl.com/api-for-currency-data
# quandl_chris_root = 'https%3A//www.quandl.com/api/v3/datasets/CHRIS/{}.json%3Fapi_key%3D{}%26start_date%3D{}';
QUANDL_CHRIS_ROOT = 'https://www.quandl.com/api/v3/datasets/CHRIS/{}.json?api_key={}&start_date={}'
API_KEY = 'J4d6zKiPjebay-zW7T8X'


CHG_IND = {
    9: [".INX:INDEXSP"],
    7: [".DJI:INDEXDJX"],
    10: ['.IXIC:INDEXNASDAQ'],
    12: ['RUT:INDEXRUSSELL'],
    28: ['SPY:NYSEARCA']
}


def get_goog_stock_price(name):
    """
    Get the google price of a stock ticker from google finance
    """
    url_name = 'https://www.google.com/finance/quote/' + name
    # resp = urllib.request.urlopen(url_name)
    resp = requests.get(url_name)
    resp_doc = resp.content
    # resp_doc = resp.read()
    soup = BeautifulSoup(resp_doc, 'html.parser')

    try:
        anchor = "AF_initDataCallback"
        scr2 = soup.find_all("script")
        ind = 18
        if name in scr2[ind].string:
            ind = 18
        else:
            ind = 19
        jsc = scr2[ind].string[scr2[ind].string.find(anchor):][len(anchor)+1:]
        jsc = jsc[jsc.find("data")+5:jsc.find("sideChannel")-2]
        # data = json.loads(js[js.find("data")+5:][:501])
        data_json = json.loads(jsc)
        chg = data_json[0][0][0][5][2]
        chg = reformat_goog_chg(str(chg))
        # print(data[0][0][0][5][2])
    except Exception as exc:
        print(exc)
        chg = None

    # Need this for diff values if stock is up or down
    # try:
    #     # chg = get_goog_chg(soup)
    #     ind = configure_ind(name)
    #     chg = None
    #     # chg = soup.find_all("div", jsname="m6NnIb")[-1].get_text()
    #     # chg= reformat_goog_chg(soup.find_all("div", class_="JwB6zf")[-1].get_text())
    # except Exception as e:
    #     chg = None
    #     # <span class="Z63m9d yoGq8">

    try:
        val = soup.find("div", class_="YMlKec fxKbKc").get_text()
        val = val.replace("$","")
    except Exception as exc:
        print(exc)
        val = None

    try:
        if name in RANGE_TICKS:
            rng = soup.findAll("div", class_="P6K39c")[2].get_text().replace("$","")
        else:
            matches = soup.findAll("div", class_="P6K39c")[0]
            for mat in matches:
                rng = mat.get_text()
        low, high = rng.split(" - ")
    except Exception as exc:
        print(exc)
        high = None
        low = None

    return [val, chg, low, high]


def get_goog_chg(soup):
    """
    Need specific method in goog to find change
    """
    for elem in soup.find_all("div", jsname="m6NnIb"):
        print(elem.get_text())


def configure_ind(name):
    """
    Needed for specific chg values
    """
    for key, val in CHG_IND.items():
        if name in val:
            return key
    return 2


def get_stock_price(name, res, print_html=False, exc_print=False):
    """
    Pulls the yahoo price data from the webpage
    """
    # url = 'https://finance.yahoo.com/quote/' + name + '?p=' + name
    resp = requests.get('https://finance.yahoo.com/quote/' + name + '?p=' + name, headers=HEADERS)
    soup = BeautifulSoup(resp.text, 'html.parser')
    # html_doc = http.request('GET', 'https://finance.yahoo.com/quote/' + name + '?p=' + name+ "?guccounter=1")
    # soup = BeautifulSoup(html_doc.data, 'html.parser')

    # Need this for diff values if stock is up or down
    if res[1] is None:
        # Print out the html for analysis
        if print_html:
            with open("o.txt", "w", encoding='utf-8') as file:
                try:
                    file.write(str(soup))
                except Exception as exc:
                    print(exc)
        try:
            if name in COMMS:
                chg = reformat_chg(soup.find_all("fin-streamer", {"data-field": "regularMarketChangePercent"})[-1].get_text(), exc_print)
            else:
                chg = reformat_chg(soup.find_all("fin-streamer", {"data-field": "regularMarketChangePercent"})[-1].get_text(), exc_print)
                # legacy solutions
                # chg = reformat_chg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)").get_text())
                # chg = reformat_chg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)").get_text())
                # chg = reformat_chg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataBlack)").get_text())
        except Exception as exc:
            if exc_print:
                print(exc)
            chg = 0
    else:
        chg = res[1]

    
    if res[0] is None:
        try:
            if name in COMMS:
                val = soup.find_all("fin-streamer", {"data-field": "regularMarketPrice"})[-1].get_text()
            else:
                val =  soup.find("fin-streamer", class_="Fw(b) Fz(36px) Mb(-4px) D(ib)").get_text()
        except Exception as exc:
            print(exc)
            val = 0
    else:
        val = res[0]

    if res[2] is None or res[3] is None:
        try:
            # first effort
            low, high = None, None
            matches = soup.findAll("td", class_="Ta(end) Fw(600) Lh(14px)")
            for mat in matches:
                if "FIFTY_TWO_WK_RANGE" in str(mat):
                    rng = mat.get_text()
                    low, high = rng.split(" - ")

            # second effort
            if low is None or high is None:
                scripts = soup.findAll("script")
                for scrpt in scripts:
                    if "fiftyTwoWeekRange" in scrpt.get_text():
                        # pdb.set_trace()
                        # 6 index is a guess here, 1 for commodities
                        if name in COMMS:
                            nums = scrpt.get_text().split("fiftyTwoWeekRange")[1].split("\"")[4].split("-")
                        else:
                            nums = scrpt.get_text().split("fiftyTwoWeekRange")[6].split("\"")[4].split("-")
                        low = nums[0]
                        high = nums[1]
                        break
            
            # third effort
            if low is None or high is None:
                tod = datetime.datetime.now().strftime("%Y-%m-%d")
                yearago = (datetime.datetime.now() - datetime.timedelta(days=365)).strftime("%Y-%m-%d")
                yahoo_financials = YahooFinancials(name)
                prices = yahoo_financials.get_historical_price_data(yearago, tod, 'daily')
                low, high = min_max(prices[name]['prices'])

        except Exception as exc:
            print(exc)
            high = None
            low = None
    else:
        low = res[2]
        high = res[3]

    return [val, chg, low, high]


def min_max(price_list):
    """
    quickly sort min and max prices
    """
    pxs_low = [pr['low'] for pr in price_list if pr['low'] is not None]
    pxs_high = [pr['high'] for pr in price_list if pr['high'] is not None]
    return round(min(pxs_low),2), round(max(pxs_high),2)


def reformat_chg(chg, exc_print):
    """
    Reformats the change string value
    """
    try:
        chg = chg.split(" ")[1]
    except Exception as exc:
        if exc_print:
            print(exc)
        chg = chg.split(" ")[0]
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


def reformat_goog_chg(chg):
    """
    Reformats the change string value
    """
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


# @timeout(30)
def get_quandl_data(ticker, t_ind, t_src):
    """
    Utilizing Quandl API for data
    """
    start_date = (datetime.datetime.today() - datetime.timedelta(days=365)).date()
    if t_src == 'quandl_boefx':
        root = "http://data.nasdaq.com/api/v3/datasets/BOE/{}?api_key={}&start_date={}"
        # root = "http://www.quandl.com/api/v3/datasets/BOE/{}?api_key={}&start_date={}"
        url = root.format(ticker, API_KEY, start_date)
    elif t_src == 'quandl_fredfx':
        root = "http://data.nasdaq.com/api/v3/datasets/FRED/{}?api_key={}&start_date={}"
        # root = "http://www.quandl.com/api/v3/datasets/FRED/{}?api_key={}&start_date={}"
        url = root.format(ticker, API_KEY, start_date)
    else:
        root = QUANDL_CHRIS_ROOT
        url = root.format(ticker, API_KEY, start_date)

    try:
        content = requests.get(url, headers=HEADERS).content
        data_json = json.loads(content)
        data_json = data_json['dataset']['data']
        data_json = [d[t_ind] for d in data_json if d[t_ind is not None]]
        data_json = [d for d in data_json if d is not None]
        # exception as we cant find USD/EUR, only EUR/USD
        if ticker == 'DEXUSEU':
            data_json = [1/d for d in data_json]
        return min(data_json), max(data_json)
    except Exception as exc:
        print(exc)
        print("Bug retrieving Quandl data: " + str(t[0]))
        return 0, 0


def time_check(t1_start):
    """
    Check the time of a run
    """
    print(datetime.datetime.now())
    t1_stop = monotonic()
    mins = str(int((t1_stop-t1_start)/60))
    secs = int((t1_stop-t1_start) % 60)
    if secs < 10:
        secs = "0" + str(secs)
    else:
        secs = str(secs)
    print("Run time:", mins + ":" + secs)


if __name__ == '__main__':
    T1_START = monotonic()
    with open('C:\\Users\\Kevin McCarville\\market_dashboard\\src\\raw_data.json', encoding='utf-8') as data_file:
        data = json.load(data_file)
        data = data['raw_data']
    tickers = []

    for k, v in data.items():
        # if k != "Energy":
        #     continue
        tickers += [(val[0], val[1][0], val[1][2], val[1][4], val[1][5], val[1][3]) for val in v.items()]

    live_data = {}
    for t in tickers:
        # pdb.set_trace()
        try:
            # Google grab - dont need for now
            # results = get_goog_stock_price(t[4])
            results = [None, None, None, None]

            YAHOO = False
            for resy in results:
                if resy is None:
                    YAHOO = True
                    break
            if YAHOO:
                results = get_stock_price(t[1], results)

            # need this for reaching quandl for tickers that dont have
            # min max off of yahoo or google - dont need for now
            if results[2] is None and results[3] is None:
                results[2], results[3] = 0, 0
            #     print("quandl")
            #     results[2], results[3] = get_quandl_data(t[2], t[3], t[5])
        except Exception as exc_outer:
            print("1. Bug with " + str(t[0]) + ": " + str(exc_outer))
            # live_data[t[0]] = ('0','0','0','0')
            # continue

        try:
            live_data[t[0]] = (float(str(results[0]).replace(",", "")),
                            str(results[1]).replace(",", ""),
                            float(str(results[2]).replace(",", "")),
                            float(str(results[3]).replace(",", "")))
            # live_data.append([t[0], results[0], results[1]])
            print(t[0] + "   " + str(results[0]) + " " + str(results[1]) +
                " " + str(results[2]) + " " + str(results[3]))
        except Exception as exc_outer:
            print("2. Bug with " + str(t[0]) + ": " + str(exc_outer))
            live_data[t[0]] = ('0','0','0','0')
            continue

    # with open("live_data.csv", "wb") as f:
    #     writer = csv.writer(f)
    #     writer.writerows(live_data)

    # Need to write this to JSON and we'll be golden
    drawdown = (live_data['S&P500'][-1] - live_data['S&P500'][0]) / live_data['S&P500'][0] * 100
    print("Drawdown:  {}".format(round(drawdown, 3)))
    with open('C:\\Users\\Kevin McCarville\\market_dashboard\\src\\live_data.json', 'w',
            encoding='utf-8') as fp:
        json.dump(live_data, fp)
    time_check(T1_START)
