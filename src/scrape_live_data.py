import urllib3 as url
import certifi as cert
import requests
import time, pdb, json, csv, datetime, requests, signal
from functools import wraps
# import pandas as pd
from bs4 import BeautifulSoup

# for currency data
# https://blog.quandl.com/api-for-currency-data
# quandl_chris_root = 'https%3A//www.quandl.com/api/v3/datasets/CHRIS/{}.json%3Fapi_key%3D{}%26start_date%3D{}';
quandl_chris_root = 'https://www.quandl.com/api/v3/datasets/CHRIS/{}.json?api_key={}&start_date={}'
API_KEY = 'J4d6zKiPjebay-zW7T8X'


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
    resp = requests.get('https://www.google.com/finance/quote/' + name)
    resp_doc = resp.content
    soup = BeautifulSoup(resp_doc, 'html.parser')

    # Need this for diff values if stock is up or down
    try:
        chg = reformatGoogChg(soup.find_all("span", class_="Z63m9d yoGq8")[1].get_text())
    except Exception as e:
        chg = None
        # <span class="Z63m9d yoGq8">
    try:
        val = soup.find("div", class_="YMlKec fxKbKc").get_text()
        val = val.replace("$","")
    except:
        val = None

    try:
        if name in ['XTL:NYSEARCA', "VWO:NYSEARCA", "VPL:NYSEARCA", "VRP:NYSEARCA"]:
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

# @timeout(60)
def get_stock_price(name, results):
    # browser.get('https://finance.yahoo.com/quote/' + name + '?p=' + name)
    # time.sleep(5) # sleep for 5 seconds
    # content = browser.find_element_by_id('content') # Error on this line
    # resp = requests.get('https://finance.yahoo.com/quote/' + name + '?p=' + name)
    http = url.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=cert.where())
    html_doc = http.request('GET', 'https://finance.yahoo.com/quote/' + name + '?p=' + name)
    soup = BeautifulSoup(html_doc.data, 'html.parser')
    
    # Need this for diff values if stock is up or down
    if results[1] is None:
        try:
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
    chg = chg.split(" ")[1]
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


def reformatGoogChg(chg):
    remove = ['(', ')', '%', '+', "-"]
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


# @timeout(30)
def get_quandl_data(ticker, t_ind, t_src):
    start_date = (datetime.datetime.today() - datetime.timedelta(days=365)).date()
    if t_src == 'quandl_boefx':
        root = "http://www.quandl.com/api/v3/datasets/BOE/{}?api_key={}&start_date={}"
        url = root.format(ticker, API_KEY, start_date)
    elif t_src == 'quandl_fredfx':
        root = "http://www.quandl.com/api/v3/datasets/FRED/{}?api_key={}&start_date={}"
        url = root.format(ticker, API_KEY, start_date)
    else:
        root = quandl_chris_root
        url = root.format(ticker, API_KEY, start_date)
    try:
        data = json.loads(requests.get(url).content)
        data = data['dataset']['data']
        data = [d[t_ind] for d in data if d[t_ind is not None]]
        data = [d for d in data if d is not None]
        # exception as we cant find USD/EUR, only EUR/USD
        if ticker == 'DEXUSEU':
            data = [1/d for d in data]
        return min(data), max(data)
    except Exception as e:
        print(e)
        if 'quandl_error' in data.keys():
            print("Hitting API too much: " + str(t[0]))
        else:
            print("Bug retrieving Quandl data: " + str(t[0]))
        return 0, 0


if __name__ == '__main__':
    with open('C:\\Users\\19739\\Python\\market_dashboard\\src\\raw_data.json') as data_file:    
        data = json.load(data_file)
        data = data['raw_data']
    tickers = []
    
    for k, v in data.items():
        tickers += [(val[0], val[1][0], val[1][2], val[1][4], val[1][5], val[1][3]) for val in v.items()]
        
    live_data = {}
    for t in tickers:
        try:
            results = get_goog_stock_price(t[4])
            # results = get_goog_stock_price(t[4])

            # need to write this to outfile
            results = get_stock_price(t[1], results)
            
            # need this for reaching quandl for tickers that dont have min max off of yahoo or google
            if results[2] is None and results[3] is None:
                results[2], results[3] = get_quandl_data(t[2], t[3], t[5])
        except Exception as e:
            print("Bug with " + str(t[0]) + ": " + str(e))
            live_data[t[0]] = ('0','0','0','0')
            continue
            
        try:
            live_data[t[0]] = (float(str(results[0]).replace(",", "")), str(results[1]).replace(",", ""),
                            float(str(results[2]).replace(",", "")), float(str(results[3]).replace(",", "")))
            # live_data.append([t[0], results[0], results[1]])
            print(t[0] + "   " + str(results[0]) + " " + str(results[1]) + " " + str(results[2]) + " " + str(results[3]))
        except Exception as e:
            print("Bug with " + str(t[0]) + ": " + str(e))
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