import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Styled component for the highlighted text
const HighlightedText = styled("span")({
  backgroundColor: "#ffb800",
  padding: "0 4px",
  borderRadius: "4px",
});

// Placeholder images
const placeholderImages = {
  people: "../../../public/images/people.webp",
  purpose: "../../../public/images/purpose.webp",
  performance: "../../../public/images/performance.webp",
};

const valuesData = [
  {
    title: "People",
    image: placeholderImages.people,
  },
  {
    title: "Purpose",
    image: placeholderImages.purpose,
  },
  {
    title: "Performance",
    image: placeholderImages.performance,
  },
];

const ValuesSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // 3 seconds delay between slides
    responsive: [
      {
        breakpoint: 960, // md
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // sm
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: { xs: "40px 20px", md: "60px 40px" },
        textAlign: "center",
        marginTop: "200px",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: "28px", sm: "36px", md: "48px" },
          fontWeight: "bold",
          color: "#000",
          mb: 6,
          lineHeight: 1.2,
        }}
      >
        The values that light <HighlightedText>our path</HighlightedText>
      </Typography>

      {/* Values Cards Carousel */}
      <Slider {...settings}>
        {valuesData.map((value, index) => (
          <Box key={index} sx={{ px: 1.5 }}>
            <Card
              sx={{
                borderRadius: "12px", // Slightly smaller border radius
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // Reduced shadow
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                },
                maxWidth: 400, // Limit the card width to make it smaller
                mx: "auto", // Center the card
              }}
            >
              <CardMedia
                component="img"
                height="500" // Reduced image height from 400 to 200
                image={value.image}
                alt={value.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "18px", md: "20px" }, // Reduced font size
                    fontWeight: "bold",
                    color: "#000",
                  }}
                >
                  {value.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ValuesSection;
