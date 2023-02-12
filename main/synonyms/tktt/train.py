import gensim.models
import json

arr = []
with open("/home2/quytran/quytran/tktt/data_segment.json", "r") as f:
    data = json.load(f)
for j in data:
    arr.append(j.split())

model = gensim.models.Word2Vec(sentences=arr,  vector_size=256 , min_count=1, workers=16, compute_loss=True, sg = 0)

model.save("/home2/quytran/quytran/tktt/model/word2vec_cbow.model")