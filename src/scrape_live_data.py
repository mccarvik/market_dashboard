from bs4 import BeautifulSoup
import urllib3 as url
import certifi as cert
import time, pdb
from pyvirtualdisplay import Display
from selenium import webdriver

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
    val = float(soup.find("span", class_="Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)").get_text())
    return (val, chg)
    
def reformatChg(chg):
    print(chg)
    chg = chg.split(" ")[1]
    remove = ['(', ')', '%', '+']
    chg = float("".join([c for c in chg if c not in remove]))
    return chg

if __name__ == '__main__':
    print(get_stock_price('aapl'))