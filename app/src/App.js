import News from "./components/News";
import { TextField, InputAdornment, IconButton, Box, Button, Typography, Pagination, Paper, Dialog, Checkbox, Link  } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
  const [range, setRange] = useState(false)
  const [lte, setLte] = useState(dayjs('2024-08-18T21:11:54'))
  const [gte, setGte] = useState(dayjs('1970-08-18T21:11:54'))
  const [info, setInfo] = useState(false)
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

  const handleChangeInfo = () => {
    setInfo(!info)
  }

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

  const handleChangeRange = (e) => {
    setRange(e.target.checked)
  }


  useEffect(() => {
    fetch(`http://127.0.0.1:5000/random`)
      .then(res => res.json())
      .then(data => {
        let curData = []
        for(let i = 0; i < data.length; ++i) {
          curData.push({
            "id": data[i]["id"],
            "title": data[i]['title'],
            "description": data[i]['description'],
            "image_url": data[i]['image_url'],
            "timestamp": data[i]['timestamp']
          })
        }
        setRandomNews(curData)
      })
  }, [])

  const handleChangeValue = (e) => {
    setValue(e.target.value)
  }

  const handleChangeSearch = (field, setValue, initialValue, e) => {
    if(field === "any" || field === "must_not" || field === "fuzzy") {
      let newValue = initialValue
      newValue[field] = e.target.value.split(",")
      for(let i = 0; i < newValue[field].length; ++i) {
        newValue[field][i] = newValue[field][i].toLowerCase()
      }
      setValue(newValue)
    }
    else if (field === "boosting"){
      let newValue = initialValue
      newValue[field] = e.target.value
      setValue(newValue)
    } else {
      let newValue = initialValue
      newValue[field] = e.target.value.toLowerCase()
      setValue(newValue)
    }
  }

  const handleSearchNormal = async () => {
    setRes([])
    setSearch(value)
    try {
      fetch(`http://127.0.0.1:5000/normal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({value}),
    })
      .then(res => res.json())
      .then(data => {
        let curRes2 = []
        setNumRes(data['hits']['hits'].length)
        for(let i = 0; i < data['hits']['hits'].length; ++i) {
          curRes2.push({
            'id': data['hits']['hits'][i]['_source']['id'],
            'title': data['hits']['hits'][i]['_source']['title'],
            'description': data['hits']['hits'][i]['_source']['description'],
            'content': data['hits']['hits'][i]['_source']['content'],
            'image_url': data['hits']['hits'][i]['_source']['image_url'],
            'highlight': data['hits']['hits'][i]['highlight'],
            'timestamp': data['hits']['hits'][i]['_source']['timestamp'],
            'score': data['hits']['hits'][i]['_score']
          })
        }
        setRes(curRes2)
        setPage(0)
      })
    } catch {
      setNumRes(0)
    }
    
  }

  const handleAdvancedSearch = async () => {
    setRes([])
    let GTE = gte.unix() 
    let LTE = lte.unix() 
    fetch(`http://127.0.0.1:5000/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify({titleSearch, contentSearch, desSearch, synonyms, GTE, LTE, range}),
    })
      .then(res => res.json())
      .then(data => {
        let curRes = []
        setNumRes(data['hits']['hits'].length)
        for(let i = 0; i < data['hits']['hits'].length; ++i) {
          curRes.push({
            'id': data['hits']['hits'][i]['_source']['id'],
            'title': data['hits']['hits'][i]['_source']['title'],
            'description': data['hits']['hits'][i]['_source']['description'],
            'content': data['hits']['hits'][i]['_source']['content'],
            'image_url': data['hits']['hits'][i]['_source']['image_url'],
            'highlight': data['hits']['hits'][i]['highlight'],
            'timestamp': data['hits']['hits'][i]['_source']['timestamp'],
            'score': data['hits']['hits'][i]['_score']
          })
        }
        console.log(curRes)
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
        setSynonyms(false)
        setSearch("")
        setValue("")
        setPage(0)
        setLte(dayjs('2024-08-18T21:11:54'))
        setGte(dayjs('1970-08-18T21:11:54'))
        setRange(false)
      })
    
  }

  const handleKeyDown = (e) => {
    if(e.keyCode == 13){
      handleSearchNormal()
    }
  }

  const handleChangeTimeGTE = (newValue) => {
    setGte(newValue)
  };

  const handleChangeTimeLTE = (newValue) => {
    setLte(newValue)
  };


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
                <SearchIcon onClick={handleSearchNormal} />
              </IconButton>
            </InputAdornment>
          )
        }}/>
      <Button variant="contained" sx={{marginLeft: "20px"}} onClick={handleClickOpen}><SettingsIcon/></Button>
      <Dialog onClose={handleClose} open={open}>
        <Paper elevation={3} sx={{width: "540px", padding: "20px"}}>
          <Typography variant="body1" sx={{fontWeight: "bold", marginBottom: "10px"}}>C??i ?????t t??m ki???m n??ng cao</Typography>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Checkbox checked={synonyms} onChange={(e) => handleChangeSynonyms(e)}/>
            <Typography>T??m ki???m v???i c??c t??? ?????ng ngh??a</Typography>
          </Box>
          {[[title, handleChangeTitle, "ti??u ?????", titleSearch, setTitleSearch], [content, handleChangeContent, "n???i dung", contentSearch, setContentSearch], [des, handleChangeDes, "mi??u t???", desSearch, setDesSearch]].map((data, index) => (
            <Box key={index}>
              <Box sx={{display: "flex", alignItems: "center"}}>
                <Checkbox checked={data[0]} onChange={(e) => data[1](e)}/>
                <Typography>T??m ki???m tr??n {data[2]}</Typography>
              </Box>
              {data[0] === true ? <Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Tr???ng s???</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} onChange={(e) => handleChangeSearch("boosting", data[4], data[3], e)} variant="outlined" type="number"></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}} >????nh tr???ng s??? cho c???m t??? ???????c t??m ki???m ??? ph??a d?????i</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>C???m t??? </Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} value={data[3]['match']} variant="outlined" onChange={(e) => handleChangeSearch("match", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>T??m ki???m k???t qu??? d???a tr??n c???m t??? n??y</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>B???t k?? t??? n??o</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("any", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>K???t qu??? t??m ki???m c?? b???t k?? t??? n??o trong n??y, c??c t??? c??ch nhau b???ng d???u ph???y <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:t??m, ki???m, th??ng, tin)</Typography></Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>M???</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}}  variant="outlined" onChange={(e) => handleChangeSearch("fuzzy", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Vi???t d?????i d???ng <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>'t??m', 2</Typography> trong ???? 2 l?? s??? m??? v?? c?? th??? ???????c nh???n c??c gi?? tr??? 0, 1, 2</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Ch??nh x??c</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("term", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Nh???p c???m t??? c???n t??m ki???m ch??nh x??c</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Kh??ng ch???a</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} variant="outlined" onChange={(e) => handleChangeSearch("must_not", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>Nh???p c??c t??? t??m ki???m kh??ng ch???a c??ch nhau b???i d???u ph???y <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"t??m", "ki???m", "th??ng", "tin")</Typography></Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>K?? t??? ?????i di???n</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}} value={data[3]['wildcard']} variant="outlined" onChange={(e) => handleChangeSearch("wildcard", data[4], data[3], e)}></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>? ?????i di???n cho m???t k?? t??? b???t k??, * ?????i di???n cho kh??ng ho???c nhi???u k?? t??? <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"t???*")</Typography></Typography>
                </Box>
                {/* <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>G???n gi???ng</Typography>
                  <TextField  sx={{display: "block", marginBottom: "10px"}}variant="outlined"></TextField>
                  <Typography variant="subtitle2" sx={{marginLeft: "15px", width: "300px", fontSize: "11px"}}>? ?????i di???n cho m???t k?? t??? b???t k??, * ?????i di???n cho kh??ng ho???c nhi???u k?? t??? <Typography sx={{fontWeight: "bold", fontSize: "11px", display: "inline-block"}}>(VD:"t???*")</Typography></Typography>
                </Box> */}
              </Box> : ""}
            </Box>
          ))}<Box sx={{display: "flex", alignItems: "center"}}>
                <Checkbox checked={range} onChange={(e) => handleChangeRange(e)}/>
                <Typography>T??m ki???m kho???ng th???i gian</Typography>
              </Box>  
                { range ? <Box> 
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px"}}>
                    <Typography variant="body2" sx={{width: "150px"}}>Ng??y b???t ?????u</Typography>
                    <DateTimePicker
                      value={gte}
                      onChange={handleChangeTimeGTE}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Box>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <Typography variant="body2" sx={{width: "150px"}}>Ng??y k???t th??c</Typography>
                  <DateTimePicker
                      value={lte}
                      onChange={handleChangeTimeLTE}
                      renderInput={(params) => <TextField {...params} />}
                    />
                </Box> </LocalizationProvider></Box> : ""}
            <Box sx={{display: "flex", justifyContent: "end"}}>
              <Button variant="contained" sx={{fontWeight: "bold", marginTop: "10px"}} onClick={() => handleAdvancedSearch()}>T??m ki???m</Button>
            </Box>
        </Paper>
        
      </Dialog>
      {info ? <Button variant="contained" sx={{marginLeft: "30px", fontWeight: "bold", fontSize: "18px", width: "200px"}} onClick={handleChangeInfo}>???n th???ng k??</Button> : <Button variant="contained" sx={{marginLeft: "30px", fontWeight: "bold", fontSize: "18px", width: "200px"}} onClick={handleChangeInfo}>Hi???n th???ng k??</Button>}
      </Box>
      {numRes !== null ? <Typography variant="body2" sx={{marginLeft: "250px", marginTop: "20px", fontSize:"16px", color: "#3399FF"}}>C?? {numRes} k???t qu??? ???ng v???i t??m ki???m {search !== "" ? <Typography sx={{fontWeight: "bold", display: "inline-block"}}>"{search}"</Typography>: " "}</Typography> : ""}
      {numRes == null ? randomNews.map((news, index) => (
        <Link href={"/" + news.id} sx={{textDecoration: "none"}}><News key={index} data={news}/></Link>
      )) : ""}
      {numRes !== null ?<Box>
          {res.slice(page * 5, page * 5 + 5).map((news, index) => (
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Box sx={{width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#3399FF", marginRight: "30px", borderRadius: "100%", color: "white"}}>
                <Typography variant="h4">{page * 5 + index + 1}</Typography>
              </Box>
              <Link href={"/" + news.id} sx={{textDecoration: "none"}}><News key={index} data={news} info={info}/></Link>
            </Box>
          ))}
          <Paper sx={{display: "flex", justifyContent: "center", backgroundColor: "#3399FF", minWidth: "200px", maxWidth: "400px", margin: "0 auto", marginBottom: "30px"}}>
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
