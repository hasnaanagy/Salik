import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "../../styles/swiper.css";

// Import required modules
import { Pagination, Autoplay } from "swiper/modules";

// Import the background images (adjust the paths as needed)
import backgroundImage1 from "../../../public/images/360_F_830612577_yhw40oyTlxbzn4IjtfOxBlUPHo979C20.jpg";
import backgroundImage2 from "../../../public/images/emrgancy1.webp";
import backgroundImage3 from "../../../public/images/uberpool-pr-photo.webp";
import backgroundImage4 from "../../../public/images/fuel delivery.webp";
import backgroundImage5 from "../../../public/images/emrgancy3.webp";
import backgroundImage6 from "../../../public/images/emrgancy2.webp";

export default function SliderComponent() {
  return (
    <>
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 3000, // 3 seconds delay between slides
          disableOnInteraction: false, // Continue autoplay even after user interaction
        }}
        modules={[Pagination, Autoplay]} // Add Autoplay module
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage1} alt="Slide 1 Background" />
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
            <img src={backgroundImage2} alt="Slide 2 Background" />
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
            <img src={backgroundImage3} alt="Slide 3 Background" />
            <div className="slide-text">
              <h2>
                Join our journey, let's <span className="highlight">all</span>{" "}
                succeed <span className="highlight">together</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage4} alt="Slide 3 Background" />
            <div className="slide-text">
              <h2>
                Join our journey, let's <span className="highlight">all</span>{" "}
                succeed <span className="highlight">together</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage5} alt="Slide 3 Background" />
            <div className="slide-text">
              <h2>
                Join our journey, let's <span className="highlight">all</span>{" "}
                succeed <span className="highlight">together</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage6} alt="Slide 3 Background" />
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
