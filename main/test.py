from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from constants import DOC_TYPE, INDEX_NAME

HEADERS = {'content-type': 'application/json'}

client = Elasticsearch()

    # Elasticsearch 6 requires the content-type header to be set, and this is
    # not included by default in the current version of elasticsearch-py
client.transport.connection_pool.connection.headers.update(HEADERS)

# s = Search(using=client, index=INDEX_NAME, doc_type=DOC_TYPE)
name_query = {"query":{
        "match": {"description": "<a>Phó thủ tướng Chính!@#</a>"}
        ,"highlight": {
        "fields": {
                "description" : {
                    "fragment_size" : 150,
                    "number_of_fragments" : 3
                }
        }
        }  
}}
query = {
    "query": {
      "match": {
         "content": {
             "query": "<a>Phó thủ tướng Chính!@#</a>",
         }
      }
    },
   "highlight": {
       "fields": {
             "content" : {
                 "fragment_size" : 150,
                 "number_of_fragments" : 3
             }
       }
    }
}
results = client.search(index=INDEX_NAME, body=query)
# docs = s.query(name_query).execute()
for hit in results['hits']['hits']:
  print(results['hits']['hits'][0]['highlight']['content'])
# print("Number of documents found:", docs['hits'])