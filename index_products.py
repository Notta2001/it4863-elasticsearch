from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk

from constants import DOC_TYPE, INDEX_NAME
from data import all_products, ProductData


def main():
    # Connect to localhost:9200 by default.
    es = Elasticsearch()
    es.indices.delete(index=INDEX_NAME, ignore=404)
    es.indices.create(
        index=INDEX_NAME,
        body={
            'mappings': {},
            'settings': {},
        },
    )

    index_product(es, all_products())


def index_product(es, products: ProductData):
    """Add a single product to the ProductData index."""

    bulk_data = []
    for product in products:
        bulk_data.append({
            "_index": INDEX_NAME,
            "_id": product.id,
            "_source": {
                "name": product.content,
            }
        })
    bulk(es, bulk_data)
    # Don't delete this! You'll need it to see if your indexing job is working,
    # or if it has stalled.
    print("Indexed {}".format("A Great Product"))


if __name__ == '__main__':
    main()
