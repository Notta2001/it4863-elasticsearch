import json
from tqdm import tqdm
from datetime import datetime
from crawl.src.url_functions import get_all_news_urls_from_topics_links, get_content_news_from_news_url
from crawl.src.utils import read_yaml
import pandas as pd
from bs4 import BeautifulSoup
import requests
from tqdm import tqdm
import time
import os 
from elasticsearch import Elasticsearch
from main.constants import INDEX_NAME, INDEX_SYN_NAME
import schedule

import pymongo
from pymongo import MongoClient

@schedule.repeat(schedule.every(300).seconds)
def crawl_and_index():
    es = Elasticsearch()
    dbname = MongoClient("mongodb+srv://gnuhcouq:thaolinh@gnuhcouq.mtstm.mongodb.net/test")["tktt"]
    collection_name = dbname["test3"]
    item_details = collection_name.find(limit=1)
    for item in item_details:
    # This does not give a very readable output
        print(item["image_url"])

    # read list of links for each topic
    topics_links = read_yaml('/home/notta/Desktop/Coding/hust-20221/it4863-elasticsearch/crawl/src/links.yaml')

    # get the list of links of news for each topic
    print('Get the list of links of news for each topic')
    topics_links = get_all_news_urls_from_topics_links(topics_links, n_pages_per_topic=1)

    # the number of news links per topic
    for k, v in topics_links.items():
        print(f'topic: {k} - No.samples: {len(v)}')

    # set output path
    OUTPUT = 'crawl/data/crawl_data'
    os.makedirs(OUTPUT, exist_ok=True)

    print('\nGet news content and save to storage')

    for topic, links in topics_links.items():
        print(f'topic: {topic} - No.samples: 10')
        count = 0
        file_path = os.path.join(OUTPUT, f'{topic}.txt')
        with open(file_path, 'w') as f:
            for link in tqdm(links):
                if(count == 10):
                    break
                s = get_content_news_from_news_url(link)
                try:
                    docs = collection_name.find_one( { "title": s['title'] } )
                    if docs:
                        continue
                    else:
                        collection_name.insert_one(s)
                        index_data = {
                            "id": s.id,
                            "title": s.title,
                            "content": s.content,
                            "description": s.description,
                            "url": s.url,
                            "image_url": s.image_url,
                            "time": s.time}
                        es.index(index=INDEX_NAME, doc_type="_doc", id=s.id, body=index_data)
                        es.index(index=INDEX_SYN_NAME, doc_type="_doc", id=s.id, body=index_data)
                        count += 1
                except:
                    print(s)

while True:
    schedule.run_pending()
