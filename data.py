import json
import os
import textwrap
_all_products = None


class ProductData():
    """
    Our product records. In this case they come from a json file, but you could
    just as easily load them from a database, or anywhere else.
    """

    def __init__(self, id, content, category):
        self.id = id
        self.content = content
        self.category = category

    def __str__(self):
        return textwrap.dedent("""\
            Id: {}
            Content: {}
            Category: {}
        """).format(self.id, self.content, self.category)


def all_products():
    """
    Returns a list of ~20,000 ProductData objects, loaded from
    searchapp/products.json
    """

    global _all_products

    if _all_products is None:
        _all_products = []

        # Load the product json from the same directory as this file.
        dir_path = os.path.dirname(os.path.realpath(__file__))
        products_path = os.path.join(dir_path, 'book.json')
        with open(products_path) as product_file:
            for product in json.load(product_file):
                product_data = ProductData(product['id'], product['name'], product['category'])
                _all_products.append(product_data)

    return _all_products
