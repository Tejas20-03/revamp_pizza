"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { PiNavigationArrowThin } from "react-icons/pi";
import {
  getCitiesWithImage,
  getOutletsforLocation,
} from "@/services/location/services";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/toaster/slice";

interface City {
  Name: string;
  ImageURL: string;
}

interface Outlet {
  Name: string;
  address: string;
  maplink: string;
}

interface LocationCardProps {
  ImageURL: string;
  Name: string;
  isActive: boolean;
  onClick: () => void;
}

const LocationCard = React.memo<LocationCardProps>(
  ({ ImageURL, Name, isActive, onClick }) => (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 ${
        isActive ? "bg-[#DAF3DD]" : "bg-gray-100"
      }`}
    >
      <Image
        src={ImageURL}
        alt={Name}
        width={240}
        height={240}
        className={`w-full transition-all duration-300 ${
          isActive ? "" : "grayscale"
        }`}
      />
    </div>
  )
);

const LocationPage = () => {
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = async () => {
    dispatch(setLoading(true));
    setError(null);
    try {
      const data = await getCitiesWithImage({});
      if (data && data.length > 0) {
        setCities(data);
        setSelectedCity(data[0].Name);
        await fetchOutlets(data[0].Name); // Fetch outlets for the first city
      } else {
        setCities([]);
      }
    } catch (err) {
      setError("Failed to fetch cities. Please try again later.");
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchOutlets = async (cityName: string) => {
    try {
      const data = await getOutletsforLocation(cityName, {});
      if (data) setOutlets(data);
    } catch (err) {
      setError("Failed to fetch outlets. Please try again later.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleCitySelect = async (cityName: string) => {
    setSelectedCity(cityName);
    await fetchOutlets(cityName);
  };

  return (
    <div className="w-full h-full relative">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="mb-8">
          <Swiper
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 10 }, // Mobile screens
              640: { slidesPerView: 3, spaceBetween: 20 }, // Tablet
              1024: { slidesPerView: 5, spaceBetween: 30 }, // Desktop
            }}
            navigation={true}
            modules={[Navigation, Autoplay]}
            className="location-swiper"
          >
            {cities.map((city, index) => (
              <SwiperSlide key={index}>
                <LocationCard
                  ImageURL={city.ImageURL}
                  Name={city.Name}
                  isActive={selectedCity === city.Name}
                  onClick={() => handleCitySelect(city.Name)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {selectedCity && (
          <div className="mt-8">
            <div className="flex flex-row items-center gap-1 mb-6">
              <h1 className="text-[28px] font-semibold dark:text-white">
                Broadway Pizza {selectedCity}
              </h1>
              <div className="text-[14px] bg-[#FFC500] font-light text-[var(--text-primary)] px-[15px] py-[4px] rounded">
                {outlets.length} Outlets
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {outlets.map((outlet, index) => (
                <div
                  key={index}
                  className="border-b pb-1 rounded-lg shadow-[0px_8px_15px_rgba(0,0,0,0.15)] p-2 bg-white dark:bg-[#202020]"
                >
                  <h3 className="text-[var(--text-primary)] text-[16px] font-medium">
                    {outlet.Name}
                  </h3>
                  <p className="my-4 text-[14px] text-gray-600 dark:text-gray-200">
                    {outlet.address}
                  </p>
                  <a
                    href={outlet.maplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-6 py-2 text-center bg-[#FFC500] text-[var(--text-primary)] font-extrabold dark:text-black rounded hover:bg-[#FFC500] transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    GET DIRECTIONS
                    <PiNavigationArrowThin className="text-[var(--text-primary)] text-xl rotate-90 dark:text-black" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;
