import {
  MenuItemFlavourAndTopping,
  MenuItemOption,
} from "@/services/Home/types";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useCallback, memo, useState } from "react";

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
}: {
  option: OptionType;
  topping: ToppingType;
  onSelect: (option: OptionType, topping: ToppingType) => void;
  isSelected: boolean;
}) => (
  <div className="cursor-pointer rounded-xl transition-all duration-200 h-full bg-white dark:bg-[#202020] shadow-xl flex flex-col">
    <div className="p-4 flex flex-col items-center gap-6 h-full">
      <Image
        src={option.ItemImage || "/default-topping.png"}
        width={300}
        height={300}
        alt={option.Name}
        quality={100}
        className="rounded-[10px] w-[300px] h-[300px] object-contain"
      />
      <div className="flex flex-col items-center text-center flex-1">
        <span className="text-[24px] text-[#555555] dark:text-white font-medium block leading-tight">
          {option.Name}
        </span>
        {option.Description && (
          <span className="text-[16px] text-[#555555] dark:text-white leading-3 block mt-3">
            {option.Description}
          </span>
        )}
        {option.Price > 0 && (
          <span className="text-red-500 text-[18px] block mt-3">
            +Rs. {option.Price}
          </span>
        )}
        <button
          onClick={() => onSelect(option, topping)}
          className="bg-[#FFC714] text-black px-8 py-4 rounded-full text-[18px] font-medium hover:bg-[#e5b313] transition-colors mt-auto"
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full rounded-xl h-[80vh] max-h-[800px]">
        <div className="flex justify-between items-center px-4 relative">
          <div className="absolute left-1/2 -translate-x-1/2 text-white text-lg font-medium">
            {currentSlide} / {topping.OptionsList.length}
          </div>
          <div className="ml-auto">
            <button onClick={onClose} className="p-2 rounded-full text-white">
              <IoClose size={32} />
            </button>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: null,
            prevEl: null,
          }}
          spaceBetween={20}
          slidesPerView={1.5}
          centeredSlides={true}
          className="w-full h-full"
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex + 1)}
        >
          {topping.OptionsList.map((option) => (
            <SwiperSlide key={option.ID}>
              <OptionSlide
                option={option}
                topping={topping}
                onSelect={onSelect}
                isSelected={isOptionSelected(option)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default OptionsPopup;
