import React from 'react'
import { Paper, Container, Typography, CardMedia, Box, Link, Pagination, Button} from '@mui/material'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import News from './News'

const getCurrentTimeFromStamp = (timestamp) => {
  var d = new Date(timestamp * 1000);
  var date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
  var month = (d.getMonth()) + 1 < 10 ? "0" + (d.getMonth() + 1): (d.getMonth() + 1)
  var hour = d.getHours() < 10 ? "0" + d.getHours(): d.getHours() 
  var minute = d.getMinutes() < 10 ? "0" + d.getMinutes(): d.getMinutes()
  var timeStampCon = date + '/' + month + '/' + d.getFullYear() + " " + hour + ':' + minute;

  return timeStampCon;
};

const Detail = () => {
  let {id} = useParams();
  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [newsData, setNewsData] = useState ([])
  const [timestamp, setTimestamp] = useState("")
  const [contentHighlight, setContentHighlight] = useState([])
  const [desHighlight, setDesHighlight] = useState([])
  const [titleHighlight, setTitleHighlight] = useState([])
  const [highlight, setHighlight] = useState(false)
  const [score, setScore] = useState("")
  const [info, setInfo] = useState(false)
  function countInstances(string, word) {
    return string.split(word).length - 1;
  }
  
  function totalResult(a, b, c) {
    let ax = a.length > 0 ? a.reduce((partialSum, a) => partialSum + a[1], 0) : 0
    let bx = b.length > 0 ? b.reduce((partialSum, a) => partialSum + a[1], 0) : 0
    let cx = c.length > 0 ? c.reduce((partialSum, a) => partialSum + a[1], 0) : 0
    return ax + bx + cx;
  }

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/${id}`)
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        if(data[0].highlight !== undefined) {
          setScore(data[0].score)
          setHighlight(true)
          if(data[0].highlight.title !== undefined) {
            setTitle(data[0].highlight['title'][0].replaceAll("em", "h2"))
            let curTitleHighlight = []
            let titleKeywords = []
            for(let i = 0; i < data[0].highlight.title.length; ++i) {
              let keywords = data[0].highlight.title[0].split("<em>")
              for(let i = 1; i < keywords.length; ++i) {
                let x = keywords[i].split("</em>")
                titleKeywords.push(x[0])
              }
            }
            var titleKeywordsUnique = titleKeywords.reduce(function(a,b){
              if (a.indexOf(b) < 0 ) a.push(b);
              return a;
            },[]);

            for(let i = 0; i < titleKeywordsUnique.length; ++i) {
              let word = titleKeywordsUnique[i]
              curTitleHighlight.push([word, countInstances(data[0].highlight.title[0], word)])
            }
            setTitleHighlight(curTitleHighlight)
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
            
            let curDesHighlight = []
            let curDescription = data[0].description
            for(let i = 0; i < uniq_keywords.length; ++i) {
              let word = uniq_keywords[i]
              console.log(word)
              curDescription = curDescription.replaceAll(word, `<h3>${word}</h3>`)
              curDesHighlight.push([word, countInstances(data[0].description, word)])
            }
            setDesHighlight(curDesHighlight)
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
            
            var curContentHighlight = []
            let curContent = data[0].content
            for(let i = 0; i < content_keywords.length; ++i) {
              let word = content_keywords[i]
              curContent = curContent.replaceAll(word, `<h3>${word}</h3>`)
              curContentHighlight.push([word, countInstances(data[0].content, word)])
            }
            setContentHighlight(curContentHighlight)
            setContent(curContent)
          } else {
            setContent(data[0].content)
          }
          setImageUrl(data[0].image_url)
          setTimestamp(data[0].timestamp)
        } else {
          setTitle(data[0]['title'])
          setDescription(data[0]['description'])
          setContent(data[0]["content"])
          setImageUrl(data[0]["image_url"])
          setTimestamp(data[0].timestamp)
        }
      })
    
  }, [])

  const handleChangeInfo = () => {
    setInfo(!info)
  }
  return (
    <Box>
      <Box sx={{display: "flex", marginRight: "50px", justifyContent: "end"}}>{info ? <Button variant="contained" sx={{marginLeft: "30px", fontWeight: "bold", fontSize: "18px", width: "200px"}} onClick={handleChangeInfo}>Ẩn thống kê</Button> : <Button variant="contained" sx={{marginLeft: "30px", fontWeight: "bold", fontSize: "18px", width: "200px"}} onClick={handleChangeInfo}>Hiện thống kê</Button>}</Box>
      <Container sx={{ marginTop: "100px", width: "80%", display: "flex", alignItems: "start", justifyContent: "center "}}>
        <Paper elevation={3} sx={{padding: "20px 50px", width: "900px"}}>
          <Typography sx={{fontSize: "25px", margin: "20px 0", fontWeight: "bold", textAlign: "justify"}}>
            <div dangerouslySetInnerHTML={{ __html: title }} />
          </Typography>
          <Typography textAlign="right" sx={{fontSize: "14px", marginRight: "10px", color: "grey", marginTop: "20px"}}>{getCurrentTimeFromStamp(timestamp)}</Typography>
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
        {highlight && info ? <Paper elevation={3} sx={{width: "200px", padding: "20px", marginLeft: "20px", marginTop: "30px"}}>
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Tiêu đề :</Typography>
            <Typography variant="body1" sx={{fontSize: "16px"}}>{totalResult(titleHighlight, [], [])}</Typography>
          </Box>
          {titleHighlight.map((hl, index) => (
            <Box key={index} sx={{display: "flex", justifyContent: "space-between", marginLeft: "20px", alignItems: "center"}}>
              <Typography variant="body1">{hl[0]} :</Typography>
              <Typography variant="body1">{hl[1]}</Typography>
            </Box>
          ))}
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Miêu tả :</Typography>
            <Typography variant="body1" sx={{fontSize: "16px"}}>{totalResult([], desHighlight, [])}</Typography>
          </Box>
          {desHighlight.map((hl, index) => (
            <Box key={index} sx={{display: "flex", justifyContent: "space-between", marginLeft: "20px", alignItems: "center"}}>
              <Typography variant="body1">{hl[0]} :</Typography>
              <Typography variant="body1">{hl[1]}</Typography>
            </Box>
          ))}
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Nội dung :</Typography>
            <Typography variant="body1" sx={{fontSize: "16px"}}>{totalResult([], [], contentHighlight)}</Typography>
          </Box>
          {contentHighlight.map((hl, index) => (
            <Box key={index} sx={{display: "flex", justifyContent: "space-between", marginLeft: "20px", alignItems: "center"}}>
              <Typography variant="body1">{hl[0]} :</Typography>
              <Typography variant="body1">{hl[1]}</Typography>
            </Box>
          ))}
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Tổng :</Typography>
            <Typography variant="body1" sx={{fontSize: "16px", fontWeight: "bold"}}>
              {totalResult(titleHighlight, desHighlight, contentHighlight)}
            </Typography>
          </Box>

          <Box sx={{display: "flex", justifyContent: "space-between", marginTop: "10px", alignItems: "center"}}>
            <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Đánh giá :</Typography>
            <Typography variant="body1" sx={{fontSize: "16px", fontWeight: "bold"}}>
              {score}
            </Typography>
          </Box>
        </Paper> : ""}

      </Container>
      {newsData.length > 1 ? <Typography variant="h5" sx={{fontWeight: "bold", textAlign: "center", marginTop: "30px", marginBottom: "0"}}>Các bài báo cùng danh sách tìm kiếm</Typography> : ""}
      <Box>
          {newsData.length > 1 ? <Box> {newsData.slice(1, newsData.length).slice(page * 5, page * 5 + 5).map((news, index) => (
              <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Box sx={{width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#3399FF", marginRight: "30px", borderRadius: "100%", color: "white"}}>
                  <Typography variant="h4">{page * 5 + index + 1}</Typography>
                </Box>
                <Link href={"/" + news.id} sx={{textDecoration: "none"}}><News key={index} data={news} info={info}/></Link>
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