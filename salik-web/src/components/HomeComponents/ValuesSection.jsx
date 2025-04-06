import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Container,
  Grid,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// Styled component for the highlighted text

// Placeholder images
const placeholderImages = {
  people: "../../../public/images/people.webp",
  purpose: "../../../public/images/purpose.webp",
  performance: "../../../public/images/performance.webp",
};

const valuesData = [
  {
    title: "People",
    description:
      "We value diversity, inclusion, and the unique contributions of every individual in our community.",
    image: placeholderImages.people,
    icon: <PeopleAltIcon fontSize="large" />,
    color: "#E3F2FD",
    iconColor: "#1976D2",
  },
  {
    title: "Purpose",
    description:
      "We're driven by our mission to create positive change and make transportation accessible to all.",
    image: placeholderImages.purpose,
    icon: <EmojiObjectsIcon fontSize="large" />,
    color: "#FFF8E1",
    iconColor: "#F57F17",
  },
  {
    title: "Performance",
    description:
      "We strive for excellence in everything we do, constantly improving our services and technology.",
    image: placeholderImages.performance,
    icon: <SpeedIcon fontSize="large" />,
    color: "#E8F5E9",
    iconColor: "#2E7D32",
  },
];

// Custom arrow components for the slider
const SliderArrow = styled(Box)(({ direction }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  [direction === "left" ? "left" : "right"]: "-30px",
  width: "50px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
  borderRadius: "50%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
  zIndex: 1,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#ffb800",
    color: "white",
    transform: "translateY(-50%) scale(1.1)",
  },
  "@media (max-width: 768px)": {
    [direction === "left" ? "left" : "right"]: "10px",
    width: "40px",
    height: "40px",
  },
}));

const ValuesSection = () => {
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <SliderArrow direction="left" {...props}>
      <ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />
    </SliderArrow>
  );

  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <SliderArrow direction="right" {...props}>
      <ArrowForwardIcon />
    </SliderArrow>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    customPaging: function (i) {
      return (
        <Box
          sx={{
            width: "12px",
            height: "12px",
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            transition: "all 0.3s ease",
            margin: "0 4px",
            "&.slick-active": {
              backgroundColor: "#ffb800",
              width: "24px",
              borderRadius: "6px",
            },
          }}
        />
      );
    },
    centerMode: true,
    centerPadding: "40px",
  };

  return (
    <Box
      sx={{
        padding: { xs: "80px 0", md: "100px 0" },
        borderRadius: "0",
        marginTop: "80px",
        marginBottom: "80px",
        position: "relative",
        overflow: "hidden",
        width: "80vw",
        marginLeft: "calc(-40vw + 50%)",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0) 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,184,0,0.1) 0%, rgba(255,184,0,0) 70%)",
        }}
      />

      <Container maxWidth={false} sx={{ px: { xs: 0, md: 4 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mb: 10, px: 2 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "#666",
                letterSpacing: "2px",
                display: "block",
                mb: 2,
              }}
            >
              OUR CORE VALUES
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "32px", sm: "40px", md: "48px" },
                fontWeight: "800",
                color: "#000",
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              The values that light{" "}
              <span className="highlight" style={{ color: "black" }}>
                our path
              </span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: "18px",
                color: "#555",
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              At Salik, our values guide everything we do. They shape our
              culture, drive our decisions, and help us deliver exceptional
              service to our community.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ position: "relative", width: "100%" }}>
          <Slider {...settings}>
            {valuesData.map((value, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      height: "100%",
                      margin: "0 10px",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="500"
                        image={value.image}
                        alt={value.title}
                        sx={{
                          objectFit: "cover",
                          filter: "brightness(0.85)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          background:
                            "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 20,
                          left: 20,
                          backgroundColor: value.color,
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: value.iconColor,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      >
                        {value.icon}
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 4, backgroundColor: "white" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontSize: "24px",
                          fontWeight: "bold",
                          color: "#000",
                          mb: 2,
                        }}
                      >
                        {value.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "16px",
                          color: "#666",
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        {value.description}
                      </Typography>

                      <Button
                        variant="text"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          color: value.iconColor,
                          fontWeight: "bold",
                          padding: 0,
                          "&:hover": {
                            backgroundColor: "transparent",
                            transform: "translateX(5px)",
                          },
                          transition: "transform 0.3s ease",
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  );
};

export default ValuesSection;
