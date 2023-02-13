import json
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from constants import INDEX_NAME

HEADERS = {'content-type': 'application/json'}

# def build_query(query_type, fields, query=None, should_query=None, must_query=None, must_not_query=None, synonyms=None, boost=None, fuzziness=None, minimum_should_match=1,
#                 use_bool=False, use_wildcard=False, use_regexp=False, match_phrase=False, function_score=False,
#                 more_like_this=False, analyzer="my_analyzer"):
def build_query(normal=None, title_query=None, content_query=None, des_query=None, minimum_should_match=0, scoring_function= "tf-idf", analyzer="my_analyzer"):
    s = Search()
    client = Elasticsearch(["http://localhost:9200"])
    bool_query = []
    must_query = []
    must_not_query = []
    if normal:
        bool_query.append({"match": {'title': {"query": normal, "analyzer": analyzer}}})
        bool_query.append({"match": {'content': {"query": normal, "analyzer": analyzer}}})
        bool_query.append({"match": {'description': {"query": normal, "analyzer": analyzer}}})

    if title_query:
        if title_query['match']:
            must_query.append({"match": {'title': {"query": title_query['match'], "boost": title_query['boosting']}}})
        if title_query['any']:
            for value in title_query['any']: 
                bool_query.append({"match": {'title': {"query": value, "boost": title_query['boosting']}}})
        if title_query['term']:
            must_query.append({"term": {'title': title_query['term']}})
        if title_query['fuzzy']:
            must_query.append({"match": {'title': {"query": title_query['fuzzy'][0], "fuzziness": title_query['fuzzy'][1], "analyzer": analyzer}}})
        if title_query['must_not']:
            for value in title_query['must_not']:
                must_not_query.append({"match": {'title': {"query": value, "analyzer": analyzer}}})
        if title_query['wildcard']:
            must_query.append({"wildcard": {'title': title_query['wildcard']}})

    if content_query:
        if content_query['match']:
            must_query.append({"match": {'content': {"query": content_query['match'], "boost": content_query['boosting']}}})
        if content_query['any']:
            for value in content_query['any']: 
                bool_query.append({"match": {'content': {"query": value, "boost": content_query['boosting']}}})
        if content_query['term']:
            must_query.append({"term": {'content': content_query['term']}})
        if content_query['fuzzy']:
            must_query.append({"match": {'content': {"query": content_query['fuzzy'][0], "fuzziness": content_query['fuzzy'][1], "analyzer": analyzer}}})
        if content_query['must_not']:
            for value in content_query['must_not']:
                must_not_query.append({"match": {'content': {"query": value, "analyzer": analyzer}}})
        if content_query['wildcard']:
            must_query.append({"wildcard": {'content': content_query['wildcard']}})
        # if content_query['more_like_this']:
        #     must_query.append({"more_like_this": {'fields': ["content"], "like": content_query['more_like_this'][0], "min_term_freq": content_query['more_like_this'][1], "max_query_terms": content_query['more_like_this'][2]}})
            

    if des_query:
        if des_query['match']:
            must_query.append({"match": {'description': {"query": des_query['match'], "boost": des_query['boosting']}}})
        if des_query['any']:
            for value in des_query['any']: 
                bool_query.append({"match": {'description': {"query": value, "boost": des_query['boosting']}}})
        if des_query['term']:
            must_query.append({"term": {'description': des_query['term']}})
        if des_query['fuzzy']:
            must_query.append({"match": {'description': {"query": des_query['fuzzy'][0], "fuzziness": des_query['fuzzy'][1], "analyzer": analyzer}}})
        if des_query['must_not']:
            for value in des_query['must_not']:
                must_not_query.append({"match": {'description': {"query": value, "analyzer": analyzer}}})
        if des_query['wildcard']:
            must_query.append({"wildcard": {'description': des_query['wildcard']}})

    s = s.query("bool", should=bool_query, must=must_query, must_not=must_not_query, minimum_should_match=minimum_should_match)

    s = s.highlight_options(pre_tags="<em>", post_tags="</em>")
    if title_query: 
        s = s.highlight("title", fragment_size=300, number_of_fragments=1)
    if content_query:
        s = s.highlight("content", fragment_size=300, number_of_fragments=1)
    if des_query:
        s = s.highlight("description", fragment_size=300, number_of_fragments=1)
    
    if normal: 
        s = s.highlight("title", fragment_size=300, number_of_fragments=1)
        s = s.highlight("content", fragment_size=300, number_of_fragments=1)
        s = s.highlight("description", fragment_size=300, number_of_fragments=1)
        
    # if scoring_function == "tf-idf":
    #     s = s.query("function_score", should=bool_query, must=must_query, must_not=must_not_query, minimum_should_match=0, query=s.to_dict(), functions=[{"script_score": {"script": {"source": "1.0 + ln(doc['title'].value + 1.0)"}}}])
    # elif scoring_function == "bm25":
    #     s = s.query("function_score", should=bool_query, must=must_query, must_not=must_not_query, minimum_should_match=0, query=s.to_dict(), functions=[{"bm25": {"boost_mode": "multiply", "field": "title"}}])
    # s = s.highlight("content", fragment_size=300, number_of_fragments=100)
    return s.to_dict()

# es = Elasticsearch()
# es.transport.connection_pool.connection.headers.update(HEADERS)

# # # Boost
# # query = build_query(content_query={"match": None, "boosting": 1, "any": ["nhân", "lan"], "term": "theo", "fuzzy": ["chuyn", 1], "must_not": ["Chinh"], "wildcard": "tr?*", "more_like_this": ["Phạm Minh Chính Chính Phạm Minh Phạm Minh Phạm Minh", 1, 1]})
# query = build_query(content_query={"match": "Thủ tướng", "boosting": 1, "any": None, "term": None, "fuzzy": None, "must_not": None, "wildcard": None, "more_like_this": None})
# print(query)
# result = es.search(index=INDEX_NAME, body=query)
# print(result)

# print(result)