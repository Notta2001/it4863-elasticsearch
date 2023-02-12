import React from 'react'
import { Box, Typography, Link } from '@mui/material'

const Header = () => {
  return (
    <Box sx={{height: "50px", backgroundColor:"#1976d2", display: "flex", alignItems: "center", position: "fixed", width: "100%", top: 0, zIndex: 999}}>
      <Link href="/"><Typography variant="h6" sx={{fontWeight: "600", color: "white", marginLeft: "50px"}}>Trang chủ</Typography></Link>
    </Box>
  )
}

export default Header