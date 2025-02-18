import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Typography } from "@mui/material";
import { Avatar, Box } from '@mui/material'
import user from "../../../public/images/user.svg";
import { RiPencilFill } from 'react-icons/ri'
import { MdDelete } from "react-icons/md";
import {IconButton, Rating } from '@mui/material'

export default function ReviewCard({setOpen,review}) {
    const [value, setValue] = useState(4);
  return (
    <Card
      sx={{
        width: 280,
        borderRadius: "40px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "4px",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
   
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Rating name="read-only" value={review.rating} readOnly precision={0.5} />
    <Box>
      <IconButton size="small">
        <RiPencilFill style={{ fontSize: "18px"}} onClick={setOpen} />
      </IconButton>
      <IconButton size="small">
        <MdDelete style={{ fontSize: "18px" }} />
      </IconButton>
    </Box>
  </Box>
        <Typography
          variant="body2"
          sx={{
            color: "#333",
            fontSize: "14px",
            lineHeight: "1.5",
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3, 
            WebkitBoxOrient: "vertical",
          }}
        >
          {review.comment}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Avatar alt="User Avatar" src={user} sx={{ width: 40, height: 40 }} />
      <Typography sx={{ fontWeight: "600", fontSize: "16px", color: "#444" }}>{review.providerId.fullName}</Typography>
    </Box>
    <Typography sx={{ fontSize: "13px", color: "#777" }}>{new Date(review.createdAt).toLocaleDateString()}
</Typography>
  </Box>
      </CardContent>
    </Card>
  );
}
