from elasticsearch import Elasticsearch
from constants import INDEX_NAME, INDEX_SYN_NAME
from data import all_news, NewsData


def main():
    # Connect to localhost:9200 by default.
    es = Elasticsearch()
    es.indices.delete(index=INDEX_NAME, ignore=404)
    es.indices.delete(index=INDEX_SYN_NAME, ignore=404)
    response = es.indices.create(
        index=INDEX_NAME,
        body={
            "settings": {
                "index": {
                    "number_of_shards" : 1,
                    "number_of_replicas" : 1,        
                "analysis": {
                    "analyzer": {
                    "my_analyzer": {
                        "tokenizer": "vi_tokenizer",
                        "char_filter":  [ "html_strip" ],
                        "filter": ["lowercase"]
                    }
                    }
                }
                }
            },
                "mappings": {
                    "properties" : {
                        "title" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "content" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "description" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        }
                    }            
                }
            }
    )

    response_syn = es.indices.create(
        index=INDEX_SYN_NAME,
        body={
            "settings": {
                "index": {
                    "number_of_shards" : 1,
                    "number_of_replicas" : 1,        
                "analysis": {
                    "analyzer": {
                    "my_analyzer": {
                        "tokenizer": "vi_tokenizer",
                        "char_filter":  [ "html_strip" ],
                        "filter": ["lowercase", "synonym"]
                    }
                    },
                    "filter": {
                        "synonym": {
                            "type": "synonym",
                            "synonyms": [
                                "trợ_giúp, giúp_đỡ, hỗ_trợ, bảo_trợ",
                                "tiềm_năng, triển_vọng, cơ_hội",
                                "trao_đổi, trò_chuyện, thảo_luận",
                                "biện_pháp, giải_pháp, hành_động",
                                "quan_trọng,  then_chốt",
                                "phù_hợp, hợp_lý, thích_hợp",
                                "phát_triển, xây_dựng, triển_khai",
                                "động_lực, tiền_đề, đòn_bẩy",
                                "rõ_ràng, cụ_thể, thực_sự",
                                "cởi_mở, thân_thiện, gần_gũi",
                                "chia_sẻ, bày_tỏ",
                                "khó_khăn, trở_ngại",
                                "khích_lệ, động_viên, biểu_dương",
                                "tp, thành_phố",
                                "btc, ban_tổ_chức",
                                "htx, hợp_tác_xã",
                                "nxb, nhà_xuất_bản",
                                "tt, tổng thống",
                                "tt, thủ tướng",
                                "tư, trung ương",
                                "tw, trung ương",
                                "ubnd, ủy_ban_nhân_dân",
                                "vn, việt_nam"
                                "lqh, liên_hợp_quốc",
                                "hn, hà_nội"
                            ]
                        }
                    }
                }
                }
            },
                "mappings": {
                    "properties" : {
                        "title" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "content" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        },
                        "description" : {
                            "type" : "text",
                            "analyzer": "my_analyzer"
                        }
                    }            
                }
            }
    )
    if response['acknowledged']:
        print("Index created successfully")
    else:
        print("Index creation failed")

    if response_syn['acknowledged']:
        print("Index syn created successfully")
    else:
        print("Index syn creation failed")
    index_news(es, all_news())


def index_news(es, news: NewsData):
    """Add a single product to the ProductData index."""

    for i, data in enumerate(news):
        print(data.title)
        index_data = {
            "id": data.id,
            "title": data.title,
            "content": data.content,
            "description": data.description,
            "url": data.url,
            "image_url": data.image_url
        }
        es.index(index=INDEX_NAME, doc_type="_doc", id=i, body=index_data)
        es.index(index=INDEX_SYN_NAME, doc_type="_doc", id=i, body=index_data)

    # Don't delete this! You'll need it to see if your indexing job is working,
    # or if it has stalled.
    print("Indexed Done")


if __name__ == '__main__':
    main()
