from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from flask import jsonify
from advanced_query import build_query
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from constants import INDEX_NAME
from database import MongoDB
import json

HEADERS = {'content-type': 'application/json'}

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
  if data["titleSearch"]:
     title_query = data["titleSearch"]
  else:
     title_query = None

  if data["contentSearch"]:
     content_query = data["contentSearch"]
  else:
     content_query = None

  if data["desSearch"]:
     des_query = data["desSearch"]
  else:
     des_query = None

  query = build_query(title_query=title_query, content_query=content_query, des_query=des_query)
  print(query)
  result = es.search(index=INDEX_NAME, body=query)
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



if __name__ == '__main__':
    app.run(debug = True)