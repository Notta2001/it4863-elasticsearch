import json
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from constants import INDEX_NAME

HEADERS = {'content-type': 'application/json'}

def build_query(query_type, fields, query=None, should_query=None, must_query=None, must_not_query=None, synonyms=None, boost=None, fuzziness=None, minimum_should_match=1,
                use_bool=False, use_wildcard=False, use_regexp=False, match_phrase=False, function_score=False,
                more_like_this=False, analyzer="my_analyzer"):
    
    s = Search()
    
    if query_type == "multimatch":
        if synonyms:
            s = s.query("multi_match", fields=fields, query=query, type="phrase", analyzer="synonym")
        
        if boost:
            s = s.query("multi_match", fields=boost, query=query, type="most_fields")

        else:
            s = s.query("multi_match", fields=fields, query=query)
            
    elif query_type == "term":
        for field, value in zip(fields, query):
            s = s.query("term", **{field: value})
        
    elif query_type == "fuzzy":
        for field, value in zip(fields, query):
            s = s.query("match", **{field: { "query": value, "fuzziness": fuzziness, "analyzer": analyzer }})
        
    elif query_type == "bool": 
        bool_query = []
        if should_query:
            for query in should_query:
                bool_query.append({"match": {query[0]: query[1]}})
        if must_not_query:
            for query in must_not_query:
                bool_query.append({"bool": {"must_not": {"match": {query[0]: { "query": query[1], "analyzer": analyzer }}}}})
        s = s.query("bool", should=bool_query, minimum_should_match=2)
        
    elif query_type == "wildcard":
        for field, value in zip(fields, query):
            s = s.query("wildcard", **{field: {"value": value}})
         
    elif query_type == "regexp":
        s = s.query("regexp", **{fields: {"value": query}})
        
    elif query_type == "matchphrase":
        s = s.query("match_phrase", fields=fields, query=query)

    elif query_type == "matchphraseprefix":
        s = s.query("match_phrase", fields=fields, query=query)
            
    elif query_type == "function_score":
        s = s.query("function_score", query=Q("match", fields=fields, query=query))
            
    elif query_type == "more_like_this":
        s = s.query("more_like_this", fields=fields, like=query, min_term_freq=1, max_query_terms=12)
    

    s = s.highlight_options(pre_tags="<em>", post_tags="</em>")
    for field in fields:
        s = s.highlight(field, fragment_size=150, number_of_fragments=1)
    return s.to_dict()

es = Elasticsearch()
es.transport.connection_pool.connection.headers.update(HEADERS)

# Boost
# query = build_query("multimatch", ["content", "title"], "<a>Phó thủ tướng@#</a>", boost=["content^2.0", "title"])

# Term 
# query = build_query("term", fields=["title"], query=["Thủ tướng Minh"])

# Fuzzy (phai them analyzer)
# 0: Exact match.
# 1: One character difference allowed.
# 2: Two character differences allowed.
# query = build_query("fuzzy", ["content", "title"], ["Thu tướng Phạm Minh", "Thủ tướng Phạm Minh"], fuzziness=2)

# Bool
# minimum_should_match là một tùy chọn của câu truy vấn Boolean 
# trong Elasticsearch. Nó cho biết số lượng tối thiểu của các clause 
# should mà cần phải tìm thấy trong kết quả tìm kiếm để câu truy vấn trả về kết quả.
# query = build_query("bool", fields=["title"], should_query=[["title", "Thủ tướng Phạm Minh"]], must_not_query=[["title", "lan"]])

# Wilcard
# Kí tự ? có nghĩa là match bất cứ kí tự nào và * match 0 hoặc nhiều kí tự.
# query = build_query("wildcard", ["content", "title"], ["khuy?"])

# # Regexp

# print(query)
# result = es.search(index=INDEX_NAME, body=query)
# for data in result['hits']['hits']:
#     print(data["_source"]['title'])