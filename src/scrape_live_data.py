
import urllib3 as url
import certifi as cert
import time, pdb, json, csv
# import pandas as pd
from bs4 import BeautifulSoup
# from pyvirtualdisplay import Display
# from selenium import webdriver


# Dont think I need selenium but good to know


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
        chg = soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataGreen)").get_text()
    except:
        try:
            chg = soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataRed)").get_text()
        except:
            chg = soup.find("span", class_="Trsdu(0.3s) Fw(500) Pstart(10px) Fz(24px) C($dataBlack)").get_text()
    
    chg = reformatChg(chg)
    val = soup.find("span", class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").get_text()
    return (val, chg)
    
def reformatChg(chg):
    chg = chg.split(" ")[1]
    remove = ['(', ')', '%', '+']
    chg = float("".join([c for c in chg if c not in remove]))
    return chg

if __name__ == '__main__':
    with open('/home/ubuntu/workspace/market-dashboard/src/raw_data.json') as data_file:    
        data = json.load(data_file)
        data = data['raw_data']
    tickers = []
    
    for k, v in data.items():
        tickers += [(val[0], val[1][0]) for val in v.items()]

    live_data = {}
    for t in tickers:
        # need to write this to outfile
        results = get_stock_price(t[1])
        live_data[t[0]] = (float(str(results[0]).replace(",", "")), str(results[1]))
        # live_data.append([t[0], results[0], results[1]])
        print(t[0] + "   " + str(results[0]) + " " + str(results[1]))
        
    # with open("live_data.csv", "wb") as f:
    #     writer = csv.writer(f)
    #     writer.writerows(live_data)
    
    # Need to write this to JSON and we'll be golden
    with open('/home/ubuntu/workspace/market-dashboard/src/live_data.json', 'w') as fp:
        json.dump(live_data, fp)