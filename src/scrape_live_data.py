import urllib3 as url
import certifi as cert
import time, pdb, json, csv, datetime, requests, signal
from functools import wraps
# import pandas as pd
from bs4 import BeautifulSoup
# from pyvirtualdisplay import Display
# from selenium import webdriver


# Dont think I need selenium but good to know

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


@timeout(30)
def get_stock_price(name):
    # display = Display(visible=0, size=(1024, 768))
    # display.start()
    # browser = webdriver.Firefox()
    # actions = webdriver.ActionChains(browser)
    # browser.get('https://finance.yahoo.com/quote/' + name + '?p=' + name)
    # time.sleep(5) # sleep for 5 seconds
    # content = browser.find_element_by_id('content') # Error on this line
    
    http = url.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=cert.where())
    html_doc = http.request('GET', 'https://finance.yahoo.com/quote/' + name + '?p=' + name)
    soup = BeautifulSoup(html_doc.data, 'html.parser')
    
    # Need this for diff values if stock is up or down
    try:
        chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataGreen)").get_text())
    except:
        try:
            chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataRed)").get_text())
        except:
            try:
                chg = reformatChg(soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataBlack)").get_text())
            except:
                chg = 0
                
    try:
        val = soup.find("span", class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").get_text()
    except:
        val = 0
    
    try:
        matches = soup.findAll("td", class_="Ta(end) Fw(b) Lh(14px)")
        for m in matches:
            if "FIFTY_TWO_WK_RANGE" in str(m):
                rng = m.get_text()
        lo, hi = rng.split(" - ")
    except Exception as e:
        hi=0
        lo=0
    return [val, chg, lo, hi]

    
def reformatChg(chg):
    chg = chg.split(" ")[1]
    remove = ['(', ')', '%', '+']
    chg = round(float("".join([c for c in chg if c not in remove])), 2)
    return chg


@timeout(30)
def get_quandl_data(ticker, t_ind):
    start_date = (datetime.datetime.today() - datetime.timedelta(days=365)).date()
    url = quandl_chris_root.format(ticker, API_KEY, start_date)
    try:
        data = json.loads(requests.get(url).content)['dataset']['data']
        data = [d[t_ind] for d in data if d[t_ind is not None]]
        return min(data), max(data)
    except:
        return 0, 0


if __name__ == '__main__':
    with open('/home/ubuntu/workspace/market-dashboard/src/raw_data.json') as data_file:    
        data = json.load(data_file)
        data = data['raw_data']
    tickers = []
    
    for k, v in data.items():
        tickers += [(val[0], val[1][0], val[1][2], val[1][4]) for val in v.items()]

    live_data = {}
    for t in tickers:
        try:
            # need to write this to outfile
            results = get_stock_price(t[1])
            
            # need this for reaching quandl for tickers that dont have min max off of yahoo
            if results[2] == 0 and results[3] == 0:
                results[2], results[3] = get_quandl_data(t[2], t[3])
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
    with open('/home/ubuntu/workspace/market-dashboard/src/live_data.json', 'w') as fp:
        json.dump(live_data, fp)
    
    print(datetime.datetime.now())