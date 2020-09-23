#!/bin/bash

while true;
do
    python ./src/scrape_live_data.py
    echo FINISHED WITH SCRAPE
    sleep 3m
done
