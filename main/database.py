import pymongo
import random
from bson.objectid import ObjectId

class MongoDB():
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb+srv://gnuhcouq:thaolinh@gnuhcouq.mtstm.mongodb.net/?retryWrites=true&w=majority")
        self.db = self.client["tktt"]
        self.collection = self.db["news_data"]
      
    def get_all_docs(self):
        docs = self.collection.find()

        return docs

    def get_n_random_docs(self, n):
        # Generate a random number between 0 and (number of documents in collection - n)

        # Use the aggregate method to retrieve n random documents
        total_docs = self.collection.count_documents({})

        # Get a list of n random documents
        random_docs = []
        for i in range(n):
            # Get a random number between 0 and total_docs
            rand_num = random.randint(0, total_docs - 1)

            # Get the document at the random index
            random_docs.append(self.collection.find().limit(-1).skip(rand_num).next())

        return random_docs
    
    def get_doc_by_id(self, id):
        docs = self.collection.find({"_id": ObjectId(id)})

        return docs
