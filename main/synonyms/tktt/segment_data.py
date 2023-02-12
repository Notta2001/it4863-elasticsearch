from vncorenlp import VnCoreNLP
import json

rdrsegmenter = VnCoreNLP("/home2/quytran/quytran/tktt/VnCoreNLP/VnCoreNLP-1.1.1.jar", port = 1324, annotators="wseg", max_heap_size='-Xmx500m')
def wseg(text):
    sentences = rdrsegmenter.tokenize(text) 
    result = ""
    for sentence in sentences:
        result += " ".join(sentence)+ " "
    return result
result = []
with open("/home2/quytran/quytran/tktt/data.json", "r") as f:
    data = json.load(f)
for text in data:
    result.append(wseg(text))
with open("data_segment.json", "w") as f:
    json.dump(result, f, ensure_ascii=False)