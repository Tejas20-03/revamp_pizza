import {
  MenuItemFlavourAndTopping,
  MenuItemOption,
} from "@/services/Home/types";
import Image from "next/image";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useCallback, memo, useState, useRef } from "react";

interface OptionType {
  ID: number;
  Name: string;
  ItemImage: string;
  Price: number;
  Description?: string;
}

interface ToppingType {
  Name: string;
  IsMultiple: boolean;
  OptionsList: MenuItemOption[];
}

interface OptionsPopupProps {
  topping: MenuItemFlavourAndTopping;
  onClose: () => void;
  onSelect: (option: OptionType, topping: ToppingType) => void;
  selectedOptions?: Record<string, MenuItemOption[]>;
}

const OptionSlide = ({
  option,
  topping,
  onSelect,
  isSelected,
  onClose,
}: {
  option: OptionType;
  topping: ToppingType;
  onSelect: (option: OptionType, topping: ToppingType) => void;
  isSelected: boolean;
  onClose: () => void;
}) => (
  <div className="cursor-pointer rounded-[24px] transition-all duration-200 h-full bg-white dark:bg-[#202020] shadow-xl flex flex-col w-[80vw]">
    <div className="p-3 flex flex-col items-center gap-4 h-full">
      <div className="relative w-full flex justify-center">
        <div className="absolute top-2 right-2 z-10">
          <IoInformationCircleOutline className="text-gray-500 dark:text-gray-400 w-6 h-6" />
        </div>
        <Image
          src={option.ItemImage || "/default-topping.png"}
          width={250}
          height={250}
          alt={option.Name}
          quality={100}
          className="rounded-[10px] w-[250px] h-[250px] object-cover"
        />
      </div>
      <div className="flex flex-col items-center text-center flex-1">
        <span className="text-[20px] dark:text-white font-bold block leading-tight">
          {option.Name}
        </span>
        {option.Description && (
          <span className="text-[12px] dark:text-white block mt-2">
            {option.Description}
          </span>
        )}
        {option.Price > 0 && (
          <span className="text-black font-bold text-[20px] whitespace-nowrap px-4">
            +Rs. {option.Price}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 w-full mt-auto">
        <button
          onClick={() => {
            onSelect(option, topping);
            onClose();
          }}
          className={`w-full px-2 py-4 rounded-full text-[16px] font-bold transition-colors ${
            isSelected ? "bg-[#ff8126] text-black" : "text-black bg-[#ffc714]"
          }`}
        >
          {isSelected ? "Selected" : "Choose"}
        </button>
      </div>
    </div>
  </div>
);

function OptionsPopup({
  topping,
  onClose,
  onSelect,
  selectedOptions,
}: OptionsPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(1);

  const isOptionSelected = useCallback(
    (option: OptionType): boolean => {
      return Boolean(
        selectedOptions?.[topping.Name]?.some(
          (opt: OptionType) => opt.ID === option.ID
        )
      );
    },
    [selectedOptions, topping.Name]
  );

  useEffect(() => {
    const body = document.body;
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";

    return () => {
      body.style.overflow = "unset";
      body.style.position = "static";
      body.style.width = "auto";
    };
  }, []);

  if (!topping?.OptionsList?.length) return null;

  // Function to handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const backdrop = event.currentTarget;
    if (event.target === backdrop) {
      onClose(); // Close the popup
    }
  };

  return (
    <div className="w-full h-full fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
        >
          <IoClose size={32} className="text-white" />
        </button>
        <div
          className="flex items-center justify-center h-full"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-[100vw] md:max-w-[80vw] h-[60vh] relative">
            <div className="absolute -top-8 left-0 right-0 z-10 flex justify-center">
              <div className="text-white text-lg font-medium">
                {currentSlide} / {topping.OptionsList.length}
              </div>
            </div>
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: null,
                prevEl: null,
              }}
              spaceBetween={20}
              slidesPerView={1.3}
              centeredSlides={true}
              className="h-full px-4"
              onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
            >
              {topping.OptionsList.map((option) => (
                <SwiperSlide key={option.ID}>
                  <div className="h-full flex items-center">
                    <OptionSlide
                      option={option}
                      topping={topping}
                      onSelect={onSelect}
                      isSelected={isOptionSelected(option)}
                      onClose={onClose}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsPopup;
