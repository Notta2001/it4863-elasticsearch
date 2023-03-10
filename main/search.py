from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from typing import List

from constants import DOC_TYPE, INDEX_NAME

HEADERS = {'content-type': 'application/json'}


class SearchResult():
    """Represents a product returned from elasticsearch."""
    def __init__(self, id_, title, description, ):
        self.id = id_
        self.name = name
        self.category = category

    def from_doc(doc) -> 'SearchResult':
        return SearchResult(
                id_ = doc.meta.id,
                name = doc.name,
                category= doc.category
            )


def search(term: str, count: int) -> List[SearchResult]:
    client = Elasticsearch()

    # Elasticsearch 6 requires the content-type header to be set, and this is
    # not included by default in the current version of elasticsearch-py
    client.transport.connection_pool.connection.headers.update(HEADERS)

    s = Search(using=client, index=INDEX_NAME, doc_type=DOC_TYPE)
    name_query = {'match': {"name": term}}
    docs = s.query(name_query)[:count].execute()


    return [SearchResult.from_doc(d) for d in docs]

def searchByCategory(term: str, count: int) -> List[SearchResult]:
    client = Elasticsearch()

    # Elasticsearch 6 requires the content-type header to be set, and this is
    # not included by default in the current version of elasticsearch-py
    client.transport.connection_pool.connection.headers.update(HEADERS)

    s = Search(using=client, index=INDEX_NAME, doc_type=DOC_TYPE)
    name_query = {'match': {"category": term}}
    docs = s.query(name_query)[:count].execute()
    print(docs)

    return [SearchResult.from_doc(d) for d in docs]

def searchByCategoryAndTerm(term: str, category: str, count: int) -> List[SearchResult]:
    client = Elasticsearch()

    # Elasticsearch 6 requires the content-type header to be set, and this is
    # not included by default in the current version of elasticsearch-py
    client.transport.connection_pool.connection.headers.update(HEADERS)

    s = Search(using=client, index=INDEX_NAME, doc_type=DOC_TYPE)
    name_query = {'bool': {
        "must": [
            {
                "match":  {
                    "name": term,
                }
            },
            {
                "match": {
                    "category": category,
                }
            }
        ]
    }}
    docs = s.query(name_query)[:count].execute()

    return [SearchResult.from_doc(d) for d in docs]