#!/bin/bash

while true;
do
    python3 ./src/scrape_live_data.py
    echo FINISHED WITH SCRAPE
    sleep 4m
done
