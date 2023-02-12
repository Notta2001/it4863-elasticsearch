from gensim.models import KeyedVectors, Word2Vec
from gensim.test.utils import datapath, get_tmpfile 
from vncorenlp import VnCoreNLP



print("start of everything")
# kv = KeyedVectors.load_word2vec_format(tmp_file)

model = KeyedVectors.load_word2vec_format('/home2/quytran/quytran/word2vec/model/word2vec_vi_words_300dims.txt', binary=False)
print("true af")
print(model.most_similar("bắt_đầu"))