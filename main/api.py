from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from flask import jsonify
from advanced_query import build_query
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from constants import INDEX_NAME, INDEX_SYN_NAME
from database import MongoDB
import json

HEADERS = {'content-type': 'application/json'}


global_result = []

es = Elasticsearch()
es.transport.connection_pool.connection.headers.update(HEADERS)

mongo = MongoDB()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# Multimatch, synonyms, and boost
@app.route('/search', methods = ['POST'])
def getMultiMatch():
  data = request.json
  minimum_should_match = 0
  if data["titleSearch"]:
      title_query = data["titleSearch"]
      if len(title_query['any']) > 0:
        minimum_should_match += 1
  else:
      title_query = None

  if data["contentSearch"]:
      content_query = data["contentSearch"]
      if len(content_query['any']) > 0:
          minimum_should_match += 1
  else:
     content_query = None

  if data["desSearch"]:
      des_query = data["desSearch"]
      if len(des_query['any']) > 0:
          minimum_should_match += 1
  else:
      des_query = None

  query = build_query(title_query=title_query, content_query=content_query, des_query=des_query, minimum_should_match=minimum_should_match)
  print(query)
  if (data['synonyms']):
    result = es.search(index=INDEX_SYN_NAME, body=query, size=10000)
  else:
    result = es.search(index=INDEX_NAME, body=query, size=10000)
  global global_result
  cur_result = []
  if len(result['hits']['hits']) > 0:
    if 'highlight' in result['hits']['hits'][0]:
      for doc in result['hits']['hits']:
        cur_result.append({
          'id': doc['_source']['id'],
          'title': doc['_source']['title'],
          'description': doc['_source']['description'],
          'content': doc['_source']['content'],
          'image_url': doc['_source']['image_url'],
          'highlight': doc['highlight']})
  print(cur_result)
  global_result = cur_result
  print(len(result['hits']['hits']))
  return result

@app.route('/random', methods = ['GET'])
def getRandom():
  data = mongo.get_n_random_docs(3)
  result = []
  for doc in data: 
     result.append({
        "id": str(doc["_id"]),
        "title": doc["title"],
        "description": doc["description"],
        "content": doc["contents"],
        "image_url": doc["image_url"],
        "url": doc["url"]
     })
  return json.dumps(result)

@app.route('/normal', methods = ['POST'])
def getNormal():
  data = request.json['value']
  query = build_query(normal=data, title_query=None, content_query=None, des_query=None)
  print(query)
  result = es.search(index=INDEX_NAME, body=query, size=10000)
  global global_result 
  cur_result = []
  if len(result['hits']['hits']) > 0:
    if 'highlight' in result['hits']['hits'][0]:
      for doc in result['hits']['hits']:
        cur_result.append({
          'id': doc['_source']['id'],
          'title': doc['_source']['title'],
          'description': doc['_source']['description'],
          'content': doc['_source']['content'],
          'image_url': doc['_source']['image_url'],
          'highlight': doc['highlight']})
  global_result = cur_result
  return result

@app.route('/<_id>', methods = ['GET'])
def getSingle(_id):
  global global_result 
  result = []
  for doc in global_result:
    if(doc['id'] == _id):
      result.append(doc)
      count = 0
      for doc in global_result:
        if(doc['id'] != _id):
          count += 1
          result.append(doc)
          if (count == 4): 
            break
      break
  if len(result) != 0:
    return json.dumps(result)
  else:
    data = mongo.get_doc_by_id(_id)
    res = []
    for doc in data: 
      res.append({
          "id": str(doc["_id"]),
          "title": doc["title"],
          "description": doc["description"],
          "content": doc["contents"],
          "image_url": doc["image_url"],
          "url": doc["url"],
      })
    return json.dumps(res)
  return result

if __name__ == '__main__':
    app.run(debug = True)