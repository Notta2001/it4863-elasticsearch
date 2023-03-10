from elasticsearch import Elasticsearch
from constants import INDEX_NAME, INDEX_SYN_NAME
from data import all_news, NewsData


def main():
    # Connect to localhost:9200 by default.
    es = Elasticsearch()
    es.indices.delete(index=INDEX_NAME, ignore=404)
    es.indices.delete(index=INDEX_SYN_NAME, ignore=404)
    response = es.indices.create(
        index= "news_index",
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
                        },
                        "timestamp": {
                            "type": "integer"
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
                                "tr???_gi??p, gi??p_?????, h???_tr???, b???o_tr???",
                                "ti???m_n??ng, tri???n_v???ng, c??_h???i",
                                "trao_?????i, tr??_chuy???n, th???o_lu???n",
                                "bi???n_ph??p, gi???i_ph??p, h??nh_?????ng",
                                "quan_tr???ng,  then_ch???t",
                                "ph??_h???p, h???p_l??, th??ch_h???p",
                                "ph??t_tri???n, x??y_d???ng, tri???n_khai",
                                "?????ng_l???c, ti???n_?????, ????n_b???y",
                                "r??_r??ng, c???_th???, th???c_s???",
                                "c???i_m???, th??n_thi???n, g???n_g??i",
                                "chia_s???, b??y_t???",
                                "kh??_kh??n, tr???_ng???i",
                                "kh??ch_l???, ?????ng_vi??n, bi???u_d????ng",
                                "tp, th??nh_ph???",
                                "btc, ban_t???_ch???c",
                                "htx, h???p_t??c_x??",
                                "nxb, nh??_xu???t_b???n",
                                "tt, t???ng th???ng",
                                "tt, th??? t?????ng",
                                "t??, trung ????ng",
                                "tw, trung ????ng",
                                "ubnd, ???y_ban_nh??n_d??n",
                                "vn, vi???t_nam",
                                "lqh, li??n_h???p_qu???c",
                                "hn, h??_n???i"
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
                        },
                        "timestamp": {
                            "type": "integer"
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
        print(data.timestamp)
        index_data = {
            "id": data.id,
            "title": data.title,
            "content": data.content,
            "description": data.description,
            "url": data.url,
            "image_url": data.image_url,
            "timestamp": data.timestamp
        }
        es.index(index=INDEX_NAME, doc_type="_doc", id=data.id, body=index_data)
        es.index(index=INDEX_SYN_NAME, doc_type="_doc", id=data.id, body=index_data)

    # Don't delete this! You'll need it to see if your indexing job is working,
    # or if it has stalled.
    print("Indexed Done")


if __name__ == '__main__':
    main()
