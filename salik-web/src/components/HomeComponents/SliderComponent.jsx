import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../styles/swiper.css";

// Import required modules
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// Import the background images (adjust the paths as needed)
import backgroundImage1 from "../../../public/images/360_F_830612577_yhw40oyTlxbzn4IjtfOxBlUPHo979C20.jpg";
import backgroundImage2 from "../../../public/images/emrgancy1.webp";
import backgroundImage3 from "../../../public/images/uberpool-pr-photo.webp";
import backgroundImage4 from "../../../public/images/fuel delivery.webp";
import backgroundImage5 from "../../../public/images/emrgancy3.webp";
import backgroundImage6 from "../../../public/images/emrgancy2.webp";

export default function SliderComponent() {
  return (
    <div className="slider-wrapper">
      <Swiper
        pagination={{
          dynamicBullets: true,
          clickable: true, // Make pagination bullets clickable
        }}
        navigation={true} // Enable navigation arrows
        autoplay={{
          delay: 4000, // Reduced to 4 seconds for smoother transitions
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay, Navigation]} // Added Navigation module
        className="mySwiper"
        loop={true} // Enable infinite loop for better UX
      >
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage1} alt="Car Sharing with Salik" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                Drive, laugh, and share the ride with{" "}
                <span className="highlight">Salik!</span> Car sharing made fun
                and easy.
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage2} alt="Emergency Mechanic Service" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                Stuck on the road? Salik’s emergency mechanic has you
                covered—fast, reliable help{" "}
                <span className="highlight">anytime, anywhere!</span>
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage3} alt="Effortless Ride with Salik" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                <span className="highlight">Salik</span> makes every trip
                effortless—ride with ease, anytime, anywhere!
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage4} alt="Fuel Delivery Service" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                <span className="highlight">Out of fuel?</span> Salik delivers
                right to your car—hassle-free and on the go!
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage5} alt="Flat Tire Emergency Service" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                <span className="highlight">Flat tire?</span> Salik’s emergency
                mechanic fixes it fast—back on the road in no time!
              </h2>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src={backgroundImage6} alt="Breakdown Towing Service" />
            <div className="slide-overlay"></div>
            <div className="slide-text">
              <h2>
                <span className="highlight">Breakdown?</span> Salik’s emergency
                team is here to tow you to safety—reliable help on the spot!
              </h2>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
