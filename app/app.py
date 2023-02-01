from flask import Flask, render_template, request

from data import all_products
from app.search import search, searchByCategory, searchByCategoryAndTerm

app = Flask(__name__)


@app.route('/')
@app.route('/index')
def index():
    """
    Search for products across a variety of terms, and show 9 results for each.
    """
    search_terms = [
        'doi-song',
        'thoi-su',
    ]
    # t = 'doi-song'
    num_results = 2
    products_by_category = [[(t, enumerate(searchByCategory(t, num_results), 1))] for t in search_terms]
    return render_template(
        'home.html',
        products_by_category=products_by_category,
        number_of_results=num_results,
    )


@app.route('/search', methods=['GET', 'POST'])
def search_single_product():
    """
    Execute a search for a specific search term.

    Return the top 50 results.
    """
    query = request.args.get('search')
    num_results = int(request.args.get('nor'))
    category = request.args.get('category')
    if category != "":
        products_by_category = [[(query, enumerate(search(query, num_results), 1))]]
    else: 
        products_by_category = [[(query, enumerate(searchByCategoryAndTerm(query, category, num_results), 1))]]
    return render_template(
        'index.html',
        products_by_category=products_by_category,
        search_term=query,
        number_of_results=num_results,
        category=category,
    )


@app.route('/product/<int:product_id>')
def single_product(product_id):
    """
    Display information about a specific product
    """

    product = all_products()[product_id - 1].content
    category = all_products()[product_id - 1].category
    print(type(product))

    return render_template(
        'product.html',
        product_content=product,
        product_category=category,
        search_term='',
    )
