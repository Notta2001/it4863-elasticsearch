from gensim.models import Word2Vec
from gensim.models import KeyedVectors
from gensim import models
Tmodel = Word2Vec.load("/home2/quytran/quytran/tktt/model/word2vec_cbow.model")
# Tmodel = KeyedVectors.load_word2vec_format("/home2/quytran/quytran/word2vec/model/word2vec.model", binary=True)
print(Tmodel.wv.most_similar("bắt_đầu"))