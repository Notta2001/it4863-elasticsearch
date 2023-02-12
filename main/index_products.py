from elasticsearch import Elasticsearch
from constants import INDEX_NAME
from data import all_news, NewsData


def main():
    # Connect to localhost:9200 by default.
    es = Elasticsearch()
    es.indices.delete(index=INDEX_NAME, ignore=404)
    response = es.indices.create(
        index=INDEX_NAME,
        body={
            "settings": {
                "index": {
                    "number_of_shards" : 1,
                    "number_of_replicas" : 1,        
                "analysis": {
                    "analyzer": {
                    "my_analyzer": {
                        "tokenizer": "vi_tokenizer",
                        "char_filter":  [ "html_strip" ],
                        "filter": ["lowercase"]
                    }
                    }
                }
                }
            },
                "mappings": {
                    "properties" : {
                        "title" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "content" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "description" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        }
                    }            
                }
            }
    )
    if response['acknowledged']:
        print("Index created successfully")
    else:
        print("Index creation failed")
    index_news(es, all_news())


def index_news(es, news: NewsData):
    """Add a single product to the ProductData index."""

    for i, data in enumerate(news):
        print(data.title)
        index_data = {
            "title": data.title,
            "content": data.content,
            "description": data.description,
            "url": data.url,
            "image_url": data.image_url
        }
        es.index(index=INDEX_NAME, doc_type="_doc", id=i, body=index_data)

    # Don't delete this! You'll need it to see if your indexing job is working,
    # or if it has stalled.
    print("Indexed Done")


if __name__ == '__main__':
    main()
