import React from 'react'
import {Box, Card, CardContent, Typography, CardMedia, Paper} from "@mui/material"
import { useState, useEffect } from 'react'

const getCurrentTimeFromStamp = (timestamp) => {
  var d = new Date(timestamp * 1000);
  var date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
  var month = (d.getMonth()) + 1 < 10 ? "0" + (d.getMonth() + 1): (d.getMonth() + 1)
  var hour = d.getHours() < 10 ? "0" + d.getHours(): d.getHours() 
  var minute = d.getMinutes() < 10 ? "0" + d.getMinutes(): d.getMinutes()
  var timeStampCon = date + '/' + month + '/' + d.getFullYear() + " " + hour + ':' + minute;

  return timeStampCon;
};

function countInstances(string, word) {
  return string.split(word).length - 1;
}

function totalResult(a, b, c) {
  let ax = a.length > 0 ? a.reduce((partialSum, a) => partialSum + a[1], 0) : 0
  let bx = b.length > 0 ? b.reduce((partialSum, a) => partialSum + a[1], 0) : 0
  let cx = c.length > 0 ? c.reduce((partialSum, a) => partialSum + a[1], 0) : 0
  return ax + bx + cx;
}

const News = ({data, info}) => {
  console.log()
  const [newsTitle, setNewsTitle] = useState(data.title)
  const [newsDescription, setNewsDescription] = useState([data.description])
  const [titleHighlight, setTitleHighlight] = useState([])
  const [contentHighlight, setContentHighlight] = useState([])
  const [desHighlight, setDesHighlight] = useState([])
  useEffect(() => {
    if(data.highlight != null) {
      if(data.highlight['title'] != null) {
        setNewsTitle(data.highlight['title'][0].replaceAll("em>", "h2>"))
        let titleKeywords = []
        let curTitleHighlight = []
        for(let i = 0; i < data.highlight.title.length; ++i) {
          let keywords = data.highlight.title[0].split("<em>")
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
          curTitleHighlight.push([word, countInstances(data.highlight.title[0], word)])
        }
        setTitleHighlight(curTitleHighlight)
      }
      else {
        setTitleHighlight([])
        setNewsTitle(data.title)
      }

      let curDes = []
      if(data.highlight['content'] != null) {
        for(let i = 0; i < data.highlight['content'].length; ++i) {
          curDes.push(data.highlight['content'][i].replaceAll("em>", "h3>"))
        }
        let contentKeywords = []
        let curContentHighlight = []
        for(let i = 0; i < data.highlight.content.length; ++i) {
          let keywords = data.highlight.content[i].split("<em>")
          for(let i = 1; i < keywords.length; ++i) {
            let x = keywords[i].split("</em>")
            contentKeywords.push(x[0])
          }
        }
        var contentKeywordsUnique = contentKeywords.reduce(function(a,b){
          if (a.indexOf(b) < 0 ) a.push(b);
          return a;
        },[]);

        for(let i = 0; i < contentKeywordsUnique.length; ++i) {
          let word = contentKeywordsUnique[i]
          curContentHighlight.push([word, countInstances(data.content, word)])
        }
        setContentHighlight(curContentHighlight)
      } else {
        setContentHighlight([])
      }
      if(data.highlight['description'] != null) {
        for(let i = 0; i < data.highlight['description'].length; ++i) {
          curDes.push(data.highlight['description'][i].replaceAll("em>", "h3>"))
        }
        let desKeywords = []
        let curDesHighlight = []
        for(let i = 0; i < data.highlight.description.length; ++i) {
          let keywords = data.highlight.description[i].split("<em>")
          for(let i = 1; i < keywords.length; ++i) {
            let x = keywords[i].split("</em>")
            desKeywords.push(x[0])
          }
        }
        var desKeywordsUnique = desKeywords.reduce(function(a,b){
          if (a.indexOf(b) < 0 ) a.push(b);
          return a;
        },[]);

        for(let i = 0; i < desKeywordsUnique.length; ++i) {
          let word = desKeywordsUnique[i]
          curDesHighlight.push([word, countInstances(data.description, word)])
        }
        setDesHighlight(curDesHighlight)
      }else {
        setDesHighlight([])
      }
      if(curDes.length != 0) {
        setNewsDescription(curDes)
      } else {
        setNewsDescription([data.description])
      }
    }
    else {
      setNewsTitle(data.title)
      setNewsDescription([data.description])
    }
  }, [data])

  return (
    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "start"}}>
      <Card sx={{ display: 'flex', width: "1000px", justifyContent: "space-between", margin: "0 auto", marginTop: "30px", marginBottom: "30px" }} elevation={3}>
        <CardMedia
          component="img"
          sx={{minWidth: "300px", maxWidth: "300px" }}
          src={data.image_url}
          alt="Live from space album cover"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5"  sx={{fontSize: "25px", fontWeight: "bold", marginBottom: "15px"}}>
              <div dangerouslySetInnerHTML={{ __html: newsTitle }} />
            </Typography>
            <Box sx={{maxHeight: '100%', overFlowY: "scroll"}}>
            {newsDescription.map(des => (
              <Typography variant="subtitle1" color="text.secondary" sx={{fontSize: "14px"}} component="div">
              <div dangerouslySetInnerHTML={{ __html: des }} />
            </Typography>
            ))}
            <Typography textAlign="right" sx={{fontSize: "14px", marginRight: "10px", color: "grey", marginTop: "20px"}}>{getCurrentTimeFromStamp(data.timestamp)}</Typography>
            </Box>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

          </Box>
        </Box>
      </Card>

      {data.highlight && info ? <Paper elevation={3} sx={{width: "200px", padding: "20px", marginLeft: "20px", marginTop: "30px"}}>
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
          <Box key={index} sx={{display: "flex", justifyContent: "space-between", marginLeft: "20px"}}>
            <Typography variant="body1">{hl[0]} :</Typography>
            <Typography variant="body1">{hl[1]}</Typography>
          </Box>
        ))}
        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Typography variant="body2" sx={{fontWeight: "bold", fontSize: "18px"}}>Nội dung :</Typography>
          <Typography variant="body1" sx={{fontSize: "16px"}}>{totalResult([], [], contentHighlight)}</Typography>
        </Box>
        {contentHighlight.map((hl, index) => (
          <Box key={index} sx={{display: "flex", justifyContent: "space-between", marginLeft: "20px"}}>
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
            {data.score}
          </Typography>
        </Box>
      </Paper> : ""}
    </Box>
    
  )
}

export default News