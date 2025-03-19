import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../styles/swiper.css";

// Import required modules
import { Pagination } from "swiper/modules";

// Import the background image (adjust the path as needed)
import backgroundImage from "../../../public/images/viktor-bystrov-qd-zd2MoeE8-unsplash.jpg";

export default function SliderComponent() {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage} alt="Slide 1 Background" />
            <div className="slide-text">
              <h2>
                Explore new opportunities with us, let's{" "}
                <span className="highlight">all</span> thrive{" "}
                <span className="highlight">together</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage} alt="Slide 2 Background" />
            <div className="slide-text">
              <h2>
                Discover your potential with us, let's{" "}
                <span className="highlight">all</span> grow{" "}
                <span className="highlight">stronger</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage} alt="Slide 3 Background" />
            <div className="slide-text">
              <h2>
                Join our journey, let's <span className="highlight">all</span>{" "}
                succeed <span className="highlight">together</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
