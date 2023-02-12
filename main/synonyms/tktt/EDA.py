import pymongo
from pymongo import MongoClient
import json

dbname = MongoClient("mongodb+srv://gnuhcouq:thaolinh@gnuhcouq.mtstm.mongodb.net/test")
db = dbname["hung"]
collection_name = db["hungsd"]
item_details = collection_name.find()
result = []
for item in item_details:
   print(item)
   result.append(item["contents"])
print(len(result))

with open("data.json", "w") as f:
    json.dump(result, f, ensure_ascii=False)