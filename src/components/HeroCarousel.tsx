"use client";

import Image from "next/image";
import React, { createRef, useEffect, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getBanners } from "@/services/Home/services";
import { useSelector } from "react-redux";
import { StoreState } from "@/redux/reduxStore";
import styles from "./HeroCarousel.module.css";

const HeroCarousel: React.FC = () => {
  const addressData = useSelector((state: StoreState) => state.address);
  const swiperRef = createRef<SwiperRef>();
  const [bannerData, setBannerData] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getBanners(addressData.city || "", {}).then((data: any) => {
      if (data) {
        setBannerData(data);
        setIsLoading(false);
      }
    });
  }, [addressData.city]);

  return (
    <div className="hidden md:block w-full md:w-[100%] relative m-0 px-4 md:px-12">
      <Swiper
        key="hero-carousel"
        breakpoints={{
          360: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 1, spaceBetween: 20 },
          1024: { slidesPerView: 1, spaceBetween: 30 },
          1400: { slidesPerView: 1, spaceBetween: 40 },
        }}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        modules={[Navigation, Autoplay]}
        loop={true}
        ref={swiperRef}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className={styles.swiperContainer}
      >
        {bannerData && bannerData.length > 0 && !isLoading ? (
          bannerData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-auto md:rounded-[3rem] rounded-[10px] lg:rounded-[5rem] xl:rounded-[5rem]">
                <Image
                  src={item}
                  alt="Banner"
                  className="w-full h-auto rounded-lg object-contain"
                  width={1820}
                  height={520}
                  priority
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg bg-gray-200 animate-pulse" />
        )}
      </Swiper>
      <div
        className={`${styles.swiperButtonPrev} ${styles.swiperButton}`}
      ></div>
      <div
        className={`${styles.swiperButtonNext} ${styles.swiperButton}`}
      ></div>
    </div>
  );
};

export default HeroCarousel;
