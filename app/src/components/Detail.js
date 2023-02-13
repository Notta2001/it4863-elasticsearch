import React from 'react'
import { Paper, Container, Typography, CardMedia, Box, Link, Pagination} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import News from './News'

const Detail = () => {
  let {id} = useParams();
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [newsData, setNewsData] = useState ([])

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/${id}`)
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        if(data[0].highlight !== undefined) {
          if(data[0].highlight.title !== undefined) {
            setTitle(data[0].highlight['title'][0].replaceAll("em", "h2"))
          } else {
            setTitle(data[0].title)
          }
          if(data[0].highlight.description !== undefined) {
            let cur_keywords = []
            for(let i = 0; i < data[0].highlight.description.length; ++i) {
              let keywords = data[0].highlight.description[i].split("<em>")
              for(let i = 1; i < keywords.length; ++i) {
                let x = keywords[i].split("</em>")
                cur_keywords.push(x[0])
              }
            }

            var uniq_keywords = cur_keywords.reduce(function(a,b){
              if (a.indexOf(b) < 0 ) a.push(b);
              return a;
            },[]);
            
            let curDescription = data[0].description
            for(let i = 0; i < uniq_keywords.length; ++i) {
              let word = uniq_keywords[i]
              console.log(word)
              curDescription = curDescription.replaceAll(word, `<h3>${word}</h3>`)
            }
            setDescription(curDescription)
          } else {
            setDescription(data[0].description)
          }
          if(data[0].highlight.content !== undefined) {
            let cur2_keywords = []
            for(let i = 0; i < data[0].highlight.content.length; ++i) {
              let keywords = data[0].highlight.content[i].split("<em>")
              for(let i = 1; i < keywords.length; ++i) {
                let x = keywords[i].split("</em>")
                cur2_keywords.push(x[0])
              }
            }

            var content_keywords = cur2_keywords.reduce(function(a,b){
              if (a.indexOf(b) < 0 ) a.push(b);
              return a;
            },[]);
            
            let curContent = data[0].content
            for(let i = 0; i < content_keywords.length; ++i) {
              let word = content_keywords[i]
              curContent = curContent.replaceAll(word, `<h3>${word}</h3>`)
            }
            setContent(curContent)
          } else {
            setContent(data[0].content)
          }
          setImageUrl(data[0].image_url)
        } else {
          setTitle(data[0]['title'])
          setDescription(data[0]['description'])
          setContent(data[0]["content"])
          setImageUrl(data[0]["image_url"])
        }
      })
    
  }, [])

  return (
    <Box>
      <Container sx={{ marginTop: "100px", width: "80%"}}>
        <Paper elevation={3} sx={{padding: "20px 50px"}}>
          <Typography sx={{fontSize: "25px", margin: "20px 0", fontWeight: "bold", textAlign: "justify"}}>
            <div dangerouslySetInnerHTML={{ __html: title }} />
          </Typography>
          <CardMedia
            component="img"
            sx={{width: "400px", margin: "20px auto"}}
            src={imageUrl}
            alt="Live from space album cover"
          />
          <Typography sx={{fontSize: "14px", fontStyle: "italic", margin: "20px 0", textAlign: "justify"}}>
            <div dangerouslySetInnerHTML={{ __html: description }} />  
          </Typography>
          <Typography sx={{fontSize: "14px", margin: "20px 0", textAlign: "justify"}}>
            <div dangerouslySetInnerHTML={{ __html: content }} />   
          </Typography>
        </Paper>
      {newsData.length > 1 ? <Typography variant="h5" sx={{fontWeight: "bold", textAlign: "center", marginTop: "30px", marginBottom: "0"}}>Các bài báo cùng danh sách tìm kiếm</Typography> : ""}
      </Container>
      <Box>
          {newsData.length > 1 ? <Box> {newsData.slice(1, newsData.length).slice(page * 5, page * 5 + 5).map((news, index) => (
              <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Box sx={{width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#3399FF", marginRight: "30px", borderRadius: "100%", color: "white"}}>
                  <Typography variant="h4">{page * 5 + index + 1}</Typography>
                </Box>
                <Link href={"/" + news.id} sx={{textDecoration: "none"}}><News key={index} data={news}/></Link>
              </Box>
            ))}
            <Paper sx={{display: "flex", justifyContent: "center", backgroundColor: "#3399FF", minWidth: "200px", maxWidth: "400px", margin: "0 auto", marginBottom: "30px"}}>
            <Pagination sx={{display: "block", margin: "0 auto"}}
                count={Math.ceil(newsData.length / 5)}
                page={page + 1}
                onChange={(event, newPage) => setPage(newPage - 1)}
              />
            </Paper>
        </Box> : ""}
    </Box>
    </Box>
    
  )
}

export default Detail