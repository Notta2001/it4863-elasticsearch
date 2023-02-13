import React from 'react'
import {Box, Card, CardContent, Typography, CardMedia, List} from "@mui/material"
import { useState, useEffect } from 'react'

const News = ({data}) => {
  const [newsTitle, setNewsTitle] = useState(data.title)
  const [newsDescription, setNewsDescription] = useState([data.description])
  useEffect(() => {
    if(data.highlight != null) {
      if(data.highlight['title'] != null) {
        setNewsTitle(data.highlight['title'][0].replaceAll("em>", "h2>"))
      }
      else {
        setNewsTitle(data.title)
      }
      let curDes = []
      if(data.highlight['content'] != null) {
        for(let i = 0; i < data.highlight['content'].length; ++i) {
          curDes.push(data.highlight['content'][i].replaceAll("em>", "h3>"))
        }
      } 
      if(data.highlight['description'] != null) {
        for(let i = 0; i < data.highlight['description'].length; ++i) {
          curDes.push(data.highlight['description'][i].replaceAll("em>", "h3>"))
        }
      }
      if(curDes.length != 0) {
        setNewsDescription(curDes)
      } else {
        setNewsDescription([data.description])
      }
    }
  }, [data])


  return (
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
          ))}</Box>
          
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

        </Box>
      </Box>
    </Card>
  )
}

export default News