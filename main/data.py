import json
import os
import textwrap
from database import MongoDB
_all_news = None

mongo = MongoDB()

class NewsData():
    """
    Our product records. In this case they come from a json file, but you could
    just as easily load them from a database, or anywhere else.
    """

    def __init__(self, _id, title, image_url, description, content, url, timestamp):
        self.id = _id
        self.title = title
        self.description = description
        self.content = content
        self.url = url
        self.image_url = image_url
        self.timestamp = timestamp

    def __str__(self):
        return textwrap.dedent("""\
            Id: {}
            Url: {}
            Image url: {}
            Title: {}
            Description: {}
            Content: {}
        """).format(self.id, self.url, self.image_url, self.title, self.description, self.content)


def all_news():

    global _all_news

    if _all_news is None:
        _all_news = []

        # Load the product json from the same directory as this file.
        docs = mongo.get_all_docs()
        for i, doc in enumerate(docs):
            news_data = NewsData(str(doc["_id"]), doc['title'], doc['image_url'], doc['description'], doc['contents'], doc['url'], doc['timestamp'])
            _all_news.append(news_data)

    return _all_news
