import urllib3 as url
import certifi as cert
import requests
import time, pdb, json, csv, datetime, requests, signal
from functools import wraps
# import pandas as pd
from bs4 import BeautifulSoup

# Google Finance MSCI ticker - EFS:INDEXCBOE

headers = {
    'User-Agent': 'Mozilla/5.0',
    'From': 'youremail@domain.com'  # This is another valid field
}


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
quandl_chris_root = 'https://www.quandl.com/api/v3/datasets/CHRIS/{}.json?api_key={}&start_date={}'
API_KEY = 'J4d6zKiPjebay-zW7T8X'


CHG_IND = {
    9: [".INX:INDEXSP"],
    7: [".DJI:INDEXDJX"],
    10: ['.IXIC:INDEXNASDAQ'],
    12: ['RUT:INDEXRUSSELL'],
    28: ['SPY:NYSEARCA']
}


def timeout(seconds=10, error_message="API CALL TOOK TOO LONG"):
    def decorator(func):
        def _handle_timeout(signum, frame):
            raise Exception(error_message)

        def wrapper(*args, **kwargs):
            signal.signal(signal.SIGALRM, _handle_timeout)
            signal.alarm(seconds)
            try:
                result = func(*args, **kwargs)
            finally:
                signal.alarm(0)
            return result
        return wraps(func)(wrapper)
    return decorator


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
        s2 = soup.find_all("script")
        ind = 18
        if name in s2[ind].string:
            ind = 18
        else:
            ind = 19
        js = s2[ind].string[s2[ind].string.find(anchor):][len(anchor)+1:]
        jss = js[js.find("data")+5:js.find("sideChannel")-2] 
        # data = json.loads(js[js.find("data")+5:][:501])
        data = json.loads(jss)
        chg = data[0][0][0][5][2]
        chg = reformatGoogChg(str(chg))
        # print(data[0][0][0][5][2])
    except Exception as e:
        # print(e)
        chg = None

    # Need this for diff values if stock is up or down
    # try:
    #     # chg = getGoogChg(soup)
    #     ind = configureInd(name)
    #     chg = None
    #     # chg = soup.find_all("div", jsname="m6NnIb")[-1].get_text()
    #     # chg= reformatGoogChg(soup.find_all("div", class_="JwB6zf")[-1].get_text())
    # except Exception as e:
    #     chg = None
    #     # <span class="Z63m9d yoGq8">
    
    try:
        val = soup.find("div", class_="YMlKec fxKbKc").get_text()
        val = val.replace("$","")
    except:
        val = None

    try:
        if name in RANGE_TICKS:
            rng = soup.findAll("div", class_="P6K39c")[2].get_text().replace("$","")
        else:    
            matches = soup.findAll("div", class_="P6K39c")[0]
            for m in matches:
                rng = m.get_text()
        lo, hi = rng.split(" - ")
    except Exception as e:
        hi=None
        lo=None

    return [val, chg, lo, hi]


def getGoogChg(soup):
    """
    Need specific method in goog to find change
    """
    # <div class="T4LgNb"
     # soup.find_all("div", jsname="m6NnIb")[29].findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().get("class")
    # <div class="ivZBbf ygUjEc" jsname="QRHKC">After Hours:<span class="tO2BSb eExqnb DnMTof"><span class=""><div jsname="ip75Cb" class="kf1m0"><div class="YMlKec fxKbKc">$452.64</div></div></span></span><span class="tO2BSb dHlEwc">(<span class="JwB6zf Ez2Ioe P2Luy DnMTof" style="font-size: 14px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="14" height="14" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.091%</span>)</span><span class="tO2BSb"><span class="P2Luy Ez2Ioe DnMTof">+0.41</span></span></div>
    # <div jsaction="oFr1Ad:uxt3if" jscontroller="NdbN0c" jsname="AS5Pxb" data-mid="/g/1q62h0x10" data-entity-type="0" data-is-crypto="false" data-exchange="NYSEARCA" data-currency-code="USD" data-last-price="452.23" data-last-normal-market-timestamp="1630362600" data-tz-offset="-14400000"><div class="rPF6Lc" jsname="OYCkv"><div class="ln0Gqe"><div jsname="LXPcOd" class=""><div class="AHmHk"><span class=""><div jsname="ip75Cb" class="kf1m0"><div class="YMlKec fxKbKc">$452.23</div></div></span></div></div><div jsname="CGyduf" class=""><div class="enJeMd"><span jsname="Fe7oBc" class="NydbP nZQ6l tnNmPe" data-disable-percent-toggle="true" data-multiplier-for-price-change="1" aria-label="Up by 0.44%"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 16px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="16" height="16" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.44%</div></div></span><span class="P2Luy Ez2Ioe ZYVHBb">+1.98 Today</span></div></div></div></div><div class="ivZBbf ygUjEc" jsname="QRHKC">After Hours:<span class="tO2BSb eExqnb DnMTof"><span class=""><div jsname="ip75Cb" class="kf1m0"><div class="YMlKec fxKbKc">$452.64</div></div></span></span><span class="tO2BSb dHlEwc">(<span class="JwB6zf Ez2Ioe P2Luy DnMTof" style="font-size: 14px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="14" height="14" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.091%</span>)</span><span class="tO2BSb"><span class="P2Luy Ez2Ioe DnMTof">+0.41</span></span></div><div class="ygUjEc" jsname="Vebqub">Closed: Aug 30, 7:00:00 PM UTC-4 · USD · NYSEARCA · <a href="https://www.google.com/intl/en_US/googlefinance/disclaimer/"><span class="koPoYd">Disclaimer</span></a></div></div>
    # <div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 16px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="16" height="16" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.43%</div></div>
    # <div jsname="CGyduf" class=""><div class="enJeMd"><span jsname="Fe7oBc" class="NydbP nZQ6l tnNmPe" data-disable-percent-toggle="true" data-multiplier-for-price-change="1" aria-label="Up by 0.43%"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 16px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="16" height="16" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.43%</div></div></span><span class="P2Luy Ez2Ioe ZYVHBb">+19.42 Today</span></div></div>
    # <div class="ln0Gqe"><div jsname="LXPcOd" class=""><div class="AHmHk"><span class=""><div jsname="ip75Cb" class="kf1m0"><div class="YMlKec fxKbKc">4,528.79</div></div></span></div></div><div jsname="CGyduf" class=""><div class="enJeMd"><span jsname="Fe7oBc" class="NydbP nZQ6l tnNmPe" data-disable-percent-toggle="true" data-multiplier-for-price-change="1" aria-label="Up by 0.43%"><div jsname="m6NnIb" class="zWwE1"><div class="JwB6zf" style="font-size: 16px;"><span class="V53LMb" aria-hidden="true"><svg focusable="false" width="16" height="16" viewBox="0 0 24 24" class=" NMm5M"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path></svg></span>0.43%</div></div></span><span class="P2Luy Ez2Ioe ZYVHBb">+19.42 Today</span></div></div></div>
    # parents = soup.find_all("div", class_="rPF6Lc")[0].findChildren("div", recursive=True)
    # for SPY:
    for el in soup.find_all("div", jsname="m6NnIb"):
        print(el.get_text())
    return
    elem = soup.find_all("div", jsname="m6NnIb")[29].findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent()
    elem2 = soup.find_all("div", jsname="m6NnIb")[28].findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent().findParent()
    # elem = soup.find_all("div", jsname="m6NnIb")[29]
    for par in parents:
        found = None
        childs = par.findChildren("span")
        for chld in childs:
            if chld.get("class")[0] == 'V53LMb':
                val = reformatGoogChg(par.getText())
                if "M20" in str(chld.findChildren("svg")[0].path):
                    found = "up"
                elif "M4" in str(chld.findChildren("svg")[0].path):
                    found = "down"
                    val = val * -1
                return val
    return None


def configureInd(name):
    for k,v in CHG_IND.items():
        if name in v:
            return k
    return 2


def get_stock_price(name, results):
    # browser.get('https://finance.yahoo.com/quote/' + name + '?p=' + name)
    # time.sleep(5) # sleep for 5 seconds
    # content = browser.find_element_by_id('content') # Error on this line
    # resp = requests.get('https://finance.yahoo.com/quote/' + name + '?p=' + name)
    http = url.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=cert.where())
    html_doc = http.request('GET', 'https://finance.yahoo.com/quote/' + name + '?p=' + name+ "?guccounter=1")
    soup = BeautifulSoup(html_doc.data, 'html.parser')
    
    # anchor = "root.App.main = "
    # s2 = soup.find_all("script")
    # for sss in s2:
    #     if sss.string is not None and anchor in sss.string:
    #         # Extract the JSON.
    #         j2 = sss.string[sss.string.find(anchor)+len(anchor):]
    #         j2 = j2[:-12]
    #         # Load the JSON.
    #         data = json.loads(j2)
    #         chg = data['context']['dispatcher']['stores']['StreamDataStore']['quoteData'][name]['regularMarketChangePercent']['raw']
    #         print(name + "   " + str(chg))
    #         # break

    # Need this for diff values if stock is up or down
    if results[1] is None:
        try:
            if name in COMMS:
                chg = reformatChg(soup.find_all("fin-streamer", {"data-field": "regularMarketChangePercent"})[-1].get_text())
            else:
                chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($positiveColor)").get_text())
        except Exception as e:
            try:
                chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($negativeColor)").get_text())
            except Exception as e2:
                try:
                    chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataBlack)").get_text())
                except Exception as e3:
                    chg = 0
    else:
        chg = results[1]
    
    if results[0] is None:
        try:
            if name in COMMS:
                val = soup.find_all("fin-streamer", {"data-field": "regularMarketPrice"})[-1].get_text()
            else:
                val = soup.find("span", class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").get_text()
        except:
            val = 0
    else:
        val = results[0]
    
    if results[2] is None or results[3] is None:
        try:
            matches = soup.findAll("td", class_="Ta(end) Fw(600) Lh(14px)")
            for m in matches:
                if "FIFTY_TWO_WK_RANGE" in str(m):
                    rng = m.get_text()
            lo, hi = rng.split(" - ")
        except Exception as e:
            hi=None
            lo=None
    else:
        lo = results[2]
        hi = results[3]

    return [val, chg, lo, hi]

    
def reformatChg(chg):
    try:
        chg = chg.split(" ")[1]
    except Exception as e:
        chg = chg.split(" ")[0]
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


def reformatGoogChg(chg):
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


# @timeout(30)
def get_quandl_data(ticker, t_ind, t_src):
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
        root = quandl_chris_root
        url = root.format(ticker, API_KEY, start_date)
    
    try:
        content = requests.get(url, headers=headers).content
        data = json.loads(content)
        data = data['dataset']['data']
        data = [d[t_ind] for d in data if d[t_ind is not None]]
        data = [d for d in data if d is not None]
        # exception as we cant find USD/EUR, only EUR/USD
        if ticker == 'DEXUSEU':
            data = [1/d for d in data]
        return min(data), max(data)
    except Exception as e:
        print(e)
        print("Bug retrieving Quandl data: " + str(t[0]))
        return 0, 0


if __name__ == '__main__':
    with open('C:\\Users\\19739\\Python\\market_dashboard\\src\\raw_data.json') as data_file:    
        data = json.load(data_file)
        data = data['raw_data']
    tickers = []
    
    for k, v in data.items():
        # if k != "Energy":
        #     continue
        tickers += [(val[0], val[1][0], val[1][2], val[1][4], val[1][5], val[1][3]) for val in v.items()]
        
    live_data = {}
    for t in tickers:
        try:
            results = get_goog_stock_price(t[4])
            # results = get_goog_stock_price(t[4])

            # need to write this to outfile
            yahoo = False
            for res in results:
                if res is None:
                    yahoo = True
                    break
            if yahoo:
                results = get_stock_price(t[1], results)
            
            # need this for reaching quandl for tickers that dont have min max off of yahoo or google
            if results[2] is None and results[3] is None:
                results[2], results[3] = get_quandl_data(t[2], t[3], t[5])
        except Exception as e:
            print("1. Bug with " + str(t[0]) + ": " + str(e))
            # live_data[t[0]] = ('0','0','0','0')
            # continue
            
        try:
            live_data[t[0]] = (float(str(results[0]).replace(",", "")), str(results[1]).replace(",", ""),
                            float(str(results[2]).replace(",", "")), float(str(results[3]).replace(",", "")))
            # live_data.append([t[0], results[0], results[1]])
            print(t[0] + "   " + str(results[0]) + " " + str(results[1]) + " " + str(results[2]) + " " + str(results[3]))
        except Exception as e:
            print("2. Bug with " + str(t[0]) + ": " + str(e))
            live_data[t[0]] = ('0','0','0','0')
            continue
        
    # with open("live_data.csv", "wb") as f:
    #     writer = csv.writer(f)
    #     writer.writerows(live_data)
    
    # Need to write this to JSON and we'll be golden
    drawdown = (live_data['S&P500'][-1] - live_data['S&P500'][0]) / live_data['S&P500'][0] * 100
    print("Drawdown:  {}".format(round(drawdown, 3)))
    with open('C:\\Users\\19739\\Python\\market_dashboard\\src\\live_data.json', 'w') as fp:
        json.dump(live_data, fp)
    
    print(datetime.datetime.now())