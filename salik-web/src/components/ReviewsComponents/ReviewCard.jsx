import React, { useState } from "react";
import { Card, CardContent, Typography, Avatar, Box, IconButton, Rating } from "@mui/material";
import { RiPencilFill } from 'react-icons/ri';
import { MdDelete } from "react-icons/md";
import defaultUserImage from "../../../public/images/user.svg";
import { useDispatch, useSelector } from "react-redux";
import { deleteReviewAction, getAllReviewsAction, updateReviewAction } from "../../redux/slices/reviewsSlice";

export default function ReviewCard({ handleOpen,review }) {
  // const [value, setValue] = useState(4);
  const dispatch=useDispatch()
 const {user}=useSelector((state)=>state.auth)
 const handleDeleteReview=async()=>{
  await dispatch(deleteReviewAction(review._id))
  dispatch(getAllReviewsAction(`${review.providerId._id}`));
 }

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
        {/* Rating and Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Rating name="read-only" value={review.rating} readOnly precision={0.5} />
        {review.customerId?._id===user?._id&&<Box>
            <IconButton size="small" onClick={()=>handleOpen(review)}>
              <RiPencilFill style={{ fontSize: "18px" }}  />
            </IconButton>
            <IconButton size="small" onClick={handleDeleteReview}>
              <MdDelete style={{ fontSize: "18px" }} />
            </IconButton>
          </Box>
          }
        </Box>

        {/* Comment */}
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

        {/* Profile Image, Name, and Date */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              alt={review.customerId?.fullName || "User"}
              src={review.customerId?.profileImg || defaultUserImage}
              sx={{ width: 40, height: 40 }}
            />
            <Typography sx={{ fontWeight: "600", fontSize: "16px", color: "#444" }}>
              {review.customerId?.fullName || "Unknown User"}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", color: "#777" }}>
            {new Date(review.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
