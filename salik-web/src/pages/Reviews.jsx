import React from 'react'
import ReviewsComponent from '../components/ReviewsComponent'
import { Box, Typography } from '@mui/material'

export default function Reviews() {
  return (
    <>
    <Box sx={{ display: "flex",justifyContent: "center"  }}>
    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "18px", color: "#444", marginTop: "20px" }}>What Poeple Say</Typography>
    </Box>
    <ReviewsComponent/>
    </>

  )
}
