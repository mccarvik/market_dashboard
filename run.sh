#!/bin/bash

while true;
do
    python ./src/scrape_live_data.py
    npm start
    sleep 30s
    kill
done