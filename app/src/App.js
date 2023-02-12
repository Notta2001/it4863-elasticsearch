import News from "./components/News";
import { TextField, InputAdornment, IconButton, Box, Button, Typography, Pagination, Paper, Dialog, Checkbox  } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from "react"

function App() {
  const [page, setPage] = useState(0);
  const [randomNews, setRandomNews] = useState([])
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")
  const [numRes, setNumRes] = useState(null)
  const [res, setRes] = useState([])
  const [open, setOpen] = useState(false)
  const [synonyms, setSynonyms] = useState(false)
  const [title, setTitle] = useState(false)
  const [des, setDes] = useState(false)
  const [content, setContent] = useState(false)
  const [titleSearch, setTitleSearch] = useState({
    "match": null,
    "any": [],
    "term": null,
    "boosting": 1,
    "fuzzy": [],
    "must_not": [],
    "function_score": null,
    "more_like_this": null,
    "wildcard": null, 
  })

  const [contentSearch, setContentSearch] = useState({
    "match": null,
    "any": [],
    "term": null,
    "boosting": 1,
    "fuzzy": [],
    "must_not": [],
    "function_score": null,
    "more_like_this": null,
    "wildcard": null, 
  })

  const [desSearch, setDesSearch] = useState({
    "match": null,
    "any": [],
    "term": null,
    "boosting": 1,
    "fuzzy": [],
    "must_not": [],
    "function_score": null,
    "more_like_this": null,
    "wildcard": null, 
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setTitleSearch({
      "match": null,
      "any": [],
      "term": null,
      "boosting": 1,
      "fuzzy": [],
      "must_not": [],
      "function_score": null,
      "more_like_this": null,
      "wildcard": null, 
    })
    setContentSearch({
      "match": null,
      "any": [],
      "term": null,
      "boosting": 1,
      "fuzzy": [],
      "must_not": [],
      "function_score": null,
      "more_like_this": null,
      "wildcard": null, 
    })
    setDesSearch({
      "match": null,
      "any": [],
      "term": null,
      "boosting": 1,
      "fuzzy": [],
      "must_not": [],
      "function_score": null,
      "more_like_this": null,
      "wildcard": null, 
    })
    setTitle(false)
    setContent(false)
    setDes(false)
  };

  const handleChangeSynonyms = (e) => {
    setSynonyms(e.target.checked)
  }

  const handleChangeTitle = (e) => {
    setTitle(e.target.checked)
  }

  const handleChangeContent = (e) => {
    setContent(e.target.checked)
  }

  const handleChangeDes = (e) => {
    setDes(e.target.checked)
  }


  useEffect(() => {
    fetch(`http://127.0.0.1:5000/random`)
      .then(res => res.json())
      .then(data => {
        let curData = []
        for(let i = 0; i < data.length; ++i) {
          curData.push({
            "title": data[i]['title'],
            "description": data[i]['description'],
            "image_url": data[i]['image_url']
          })
        }
        setRandomNews(curData)
      })
  }, [])

  const handleChangeValue = (e) => {
    setValue(e.target.value)
    console.log(value)
  }

  const handleChangeSearch = (field, setValue, initialValue, e) => {
    if(field === "any" || field === "must_not" || field === "fuzzy") {
      let newValue = initialValue
      newValue[field] = e.target.value.split(",")
      console.log(newValue)
      setValue(newValue)
    }
    else {
      let newValue = initialValue
      newValue[field] = e.target.value
      console.log(newValue)
      setValue(newValue)
    }
  }

  const handleAdvancedSearch = async () => {
    fetch(`http://127.0.0.1:5000/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({titleSearch, contentSearch, desSearch}),
    })
      .then(res => res.json())
      .then(data => {
        let curRes = []
        setNumRes(data['hits']['hits'].length)
        for(let i = 0; i < data['hits']['hits'].length; ++i) {
          curRes.push({
            'title': data['hits']['hits'][i]['_source']['title'],
            'description': data['hits']['hits'][i]['_source']['description'],
            'content': data['hits']['hits'][i]['_source']['content'],
            'image_url': data['hits']['hits'][i]['_source']['image_url'],
            'highlight': data['hits']['hits'][i]['highlight']
          })
        }
        setRes(curRes)
        setTitleSearch({
          "match": null,
          "any": [],
          "term": null,
          "boosting": 1,
          "fuzzy": [],
          "must_not": [],
          "function_score": null,
          "more_like_this": null,
          "wildcard": null, 
        })
        setContentSearch({
          "match": null,
          "any": [],
          "term": null,
          "boosting": 1,
          "fuzzy": [],
          "must_not": [],
          "function_score": null,
          "more_like_this": null,
          "wildcard": null, 
        })
        setDesSearch({
          "match": null,
          "any": [],
          "term": null,
          "boosting": 1,
          "fuzzy": [],
          "must_not": [],
          "function_score": null,
          "more_like_this": null,
          "wildcard": null, 
        })
        setOpen(false)
        setTitle(false)
        setContent(false)
        setDes(false)
      })
    
  }

  const handleSearch = () => {
    setSearch(value)
  }

  const handleKeyDown = (e) => {
    if(e.keyCode == 13){
      handleSearch()
    }
  }

  return (
    <div className="App">
      {numRes === null ? <Box sx={{display: "flex", justifyContent: "center", marginTop: "80px"}}>
        <Typography variant="h1" sx={{fontStyle: "italic", color:"#3399FF", fontWeight: 900}}>n</Typography>
        <Typography variant="h1" sx={{fontStyle: "italic", color:"#FF0000", fontWeight: 900}}>e</Typography>
        <Typography variant="h1" sx={{fontStyle: "italic", color:"#FFCC33", fontWeight: 900}}>w</Typography>
        <Typography variant="h1" sx={{fontStyle: "italic", color:"#009900", fontWeight: 900}}>S</Typography>

        <Typography variant="h1" sx={{color:"#009900",fontWeight: 700}}>earch</Typography>
      </Box> : ""}
      <Box sx={{display: "flex", justifyContent: "center", marginTop: numRes !== null ? "80px" : "0"}}>
        <TextField
        sx={{
          width: "700px",
          backgroundColor: "white"
        }}
        value={value}
        onChange={handleChangeValue}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton>
                <SearchIcon onClick={handleSearch} />
              </IconButton>
            </InputAdornment>
          )
        }}/>
      <Button variant="contained" sx={{marginLeft: "20px"}} onClick={handleClickOpen}><SettingsIcon/></Button>
      <Dialog onClose={handleClose} open={open}>
        <Paper elevation={3} sx={{width: "540px", padding: "20px"}}>
          <Typography variant="body1" sx={{fontWeight: "bold", marginBottom: "10px"}}>Cài đặt tìm kiếm nâng cao</Typography>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Checkbox checked={synonyms} onChange={(e) => handleChangeSynonyms(e)}/>
            <Typography>Tìm kiếm với các từ đồng nghĩa</Typography>
          </Box>
          {[[title, handleChangeTitle, "tiêu đề", titleSearch, setTitleSearch], [content, handleChangeContent, "nội dung", contentSearch, setContentSearch], [des, handleChangeDes, "miêu tả", desSearch, setDesSearch]].map((data, index) => (
            <Box key={index}>
              <Box sx={{display: "flex", alignItems: "center"}}>
                <Checkbox checked={data[0]} onChange={(e) => data[1](e)}/>
                <Typography>Tìm kiếm trên {data[2]}</Typography>
              </Box>
              {data[0] === true ? <Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Trọng số</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} value={data[3]['boosting']} variant="outlined" type="number"></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}} >Đánh trọng số cho cụm từ được tìm kiếm ở phía dưới</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Cụm từ </Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} value={data[3]['match']} variant="outlined" onChange={(e) => handleChangeSearch("match", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Tìm kiếm kết quả dựa trên cụm từ này</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Bất kì từ nào</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("any", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Kết quả tìm kiếm có bất kì từ nào trong này, các từ cách nhau bằng dấu phẩy <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:tìm, kiếm, thông, tin)</Typography></Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Mờ</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}}  variant="outlined" onChange={(e) => handleChangeSearch("fuzzy", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Viết dưới dạng <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>'tìm', 2</Typography> trong đó 2 là số mờ và có thể được nhận các giá trị 0, 1, 2</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Chính xác</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("term", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Nhập cụm từ cần tìm kiếm chính xác</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Không chứa</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("must_not", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Nhập các từ tìm kiếm không chứa cách nhau bởi dấu phẩy <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"tìm", "kiếm", "thông", "tin")</Typography></Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Kí tự đại diện</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} value={data[3]['wildcard']} variant="outlined" onChange={(e) => handleChangeSearch("wildcard", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>? đại diện cho một kí tự bất kì, * đại diện cho không hoặc nhiều kí tự <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"t?ô*")</Typography></Typography>
                </Box>
                {/* <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Gần giống</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}}variant="outlined"></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>? đại diện cho một kí tự bất kì, * đại diện cho không hoặc nhiều kí tự <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"t?ô*")</Typography></Typography>
                </Box> */}
              </Box> : ""}
              
            </Box>
          ))}
            <Box sx={{display: "flex", justifyContent: "end"}}>
              <Button variant="contained" sx={{fontWeight: "bold", marginTop: "10px"}} onClick={() => handleAdvancedSearch()}>Tìm kiếm</Button>
            </Box>
        </Paper>
        
      </Dialog>
      </Box>
      {numRes !== null ? <Typography variant="body2" sx={{marginLeft: "250px", marginTop: "20px", fontSize:"16px", color: "#3399FF"}}>Có {numRes} kết quả ứng với tìm kiếm {search !== "" ? <Typography sx={{fontWeight: "bold", display: "inline-block"}}>"{search}"</Typography>: " "}</Typography> : ""}
      {numRes == null ? randomNews.map((news, index) => (
        <News key={index} data={news}/>
      )) : ""}
      {numRes !== null ?<Box>
          {res.slice(page * 5, page * 5 + 5).map((news, index) => (
            <News key={index} data={news}/>
          ))}
          <Paper sx={{display: "flex", justifyContent: "center", backgroundColor: "#3399FF", width: "200px", margin: "0 auto", marginBottom: "30px"}}>
          <Pagination sx={{display: "block", margin: "0 auto"}}
              count={Math.ceil(numRes / 5)}
              page={page + 1}
              onChange={(event, newPage) => setPage(newPage - 1)}
            />
          </Paper>
      </Box>: ""}
 
    </div>
  );
}

export default App;
