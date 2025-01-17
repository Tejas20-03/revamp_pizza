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

const OptionsPopup: React.FC<OptionsPopupProps> = ({
  topping,
  onClose,
  onSelect,
  selectedOptions,
}) => {
  const isOptionSelected = (option: OptionType) => {
    return selectedOptions?.[topping.Name]?.some(
      (opt: OptionType) => opt.ID === option.ID
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-[900px] rounded-xl p-2 h-[80vh]">
        <div className="flex justify-end items-center mb-4">
          {" "}
          {/* Changed justify-between to justify-end */}
          <button onClick={onClose} className="p-2 rounded-full text-white">
            <IoClose size={24} />
          </button>
        </div>
        {topping && topping.OptionsList && topping.OptionsList.length > 0 && (
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: null,
              prevEl: null,
            }}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full h-full"
          >
            {topping &&
              topping.OptionsList?.map((option) => (
                <SwiperSlide key={option.ID}>
                  <div
                    className={`cursor-pointer rounded-xl transition-all duration-200 h-full bg-white dark:bg-[#202020] shadow-xl flex flex-col`}
                  >
                    <div className="p-8 flex flex-col items-center gap-6 h-full">
                      <Image
                        src={option.ItemImage || "/default-topping.png"}
                        width={500}
                        height={500}
                        alt={option.Name}
                        quality={100}
                        className="rounded-[10px] w-[300px] h-[300px] object-contain" // Increased dimensions
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
                          {isOptionSelected(option) ? "Selected" : "Choose"}
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default OptionsPopup;
