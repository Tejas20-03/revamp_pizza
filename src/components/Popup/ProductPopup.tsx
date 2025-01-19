import { addToCart } from "@/redux/cart/action";
import { ProductType } from "@/redux/cart/slice";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { openToaster } from "@/redux/toaster/slice";
import { MenuItemData, MenuItemOption } from "@/services/Home/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaRegCheckCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import {
  IoArrowDown,
  IoCheckmarkCircle,
  IoClose,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import OptionsPopup from "./OptionsPopup";

interface IProductProps {
  isOpen: boolean;
  onClose: () => void;
  product: MenuItemData | null;
  isNewItem?: boolean;
  serving?: string;
  minDeliveryPrice?: number;
}

const ProductPopup: React.FC<IProductProps> = ({
  isOpen,
  onClose,
  product,
  isNewItem,
  serving,
  minDeliveryPrice,
}) => {
  const dispatch = useDispatch<StoreDispatch>();
  const addressType = useSelector(
    (state: StoreState) => state.address.addressType
  );
  const phoneNumber = useSelector((state: StoreState) => state.address.phone);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, MenuItemOption[]>
  >({});
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [imageScale, setImageScale] = useState<number>(0.8);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const handleOptionSelect = (option: any, category: any) => {
    if (category && category.OptionsList) {
      const selectedOption = category.OptionsList.find(
        (opt: any) => opt.ID === option.ID
      );
      if (selectedOption) {
        setSelectedOptions((prev) => {
          const categoryName = category.Name;
          if (category.IsMultiple) {
            const currentSelected = prev[categoryName] || [];
            const exists = currentSelected.find(
              (opt: any) => opt.ID === option.ID
            );
            return {
              ...prev,
              [categoryName]: exists
                ? currentSelected.filter((opt: any) => opt.ID !== option.ID)
                : [...currentSelected, option],
            };
          }
          return { ...prev, [categoryName]: [option] };
        });
      }
    }
    if (!category.IsMultiple) {
      setExpandedOption(null);
    }
  };

  useEffect(() => {
    if (product && product?.MenuSizesList?.length > 0) {
      const defaultSize = product.MenuSizesList.find(
        (size) => size.Size !== "-" && size.Size !== "." && size.Size !== ""
      )?.Size;
      if (defaultSize) {
        handleSizeSelect(defaultSize);
      }
    }
  }, [product]);

  const handleSizeSelect = (newSize: string) => {
    setSelectedSize(newSize);
    setSelectedOptions({});
    const sizeIndex =
      product?.MenuSizesList.findIndex((size) => size.Size === newSize) || 0;
    const scaleValue = 1 + sizeIndex * 0.1;
    setImageScale(scaleValue);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!areAllRequiredOptionsSelected()) {
      dispatch(
        openToaster({
          title: "Options Missing",
          message: "Please select all the required options.",
          buttonText: "OK",
        })
      );
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem: ProductType = {
        ItemID: product.ID || "",
        ProductName: product.Name || "",
        ItemImage: product.ItemImage || "",
        Quantity: 1,
        CategoryName: product.CategoryName || "",
        MinimumDelivery: product.MinimumDelivery || 0,
        CookingInstruction: specialInstructions,
        options: Object.entries(selectedOptions).flatMap(
          ([groupName, options]) =>
            options.map((option: any) => ({
              OptionID: option.ID,
              OptionName: option.Name,
              OptionGroupName: groupName,
              Price: option.Price || 0,
              Quantity: 1,
            }))
        ),
        SizeID: product.MenuSizesList[0].ID,
        Price: product.MenuSizesList[0].DiscountedPrice || 0,
        TotalProductPrice: calculateTotal(),
        discountGiven: 0,
        PaymentType: product.PaymentType || "Cash",
      };

      await dispatch(addToCart({ products: cartItem }));
      dispatch(
        openToaster({
          showSuccess: true,
          message: "Added to cart",
          title: "Success",
        })
      );
      resetSelections();
      onClose();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const calculateTotal = () => {
    const selectedSizeData = product?.MenuSizesList?.find(
      (size) => size.Size === selectedSize
    );

    const basePrice = selectedSizeData
      ? addressType === "Delivery"
        ? selectedSizeData.DeliveryPrice
        : selectedSizeData.TakeAwayPrice
      : (addressType === "Delivery"
          ? product?.MenuSizesList[0].DeliveryPrice
          : product?.MenuSizesList[0].TakeAwayPrice) || 0;

    const optionsTotal = Object.values(selectedOptions)
      .flat()
      .reduce((sum, opt) => sum + (opt.Price || 0), 0);

    return basePrice + optionsTotal;
  };

  const isOptionSelected = (option: any, categoryName: any) => {
    return selectedOptions[categoryName]?.some(
      (opt: any) => opt.ID === option.ID
    );
  };

  const isMobile = () => {
    return window.innerWidth < 768;
  };

  const areAllRequiredOptionsSelected = () => {
    let requiredCategories =
      product?.MenuSizesList?.find(
        (size) => size.Size === selectedSize
      )?.FlavourAndToppingsList?.filter((category) => !category.IsMultiple) ||
      [];

    if (
      !product?.MenuSizesList?.some(
        (size) => size.Size !== "-" && size.Size !== "." && size.Size !== ""
      )
    ) {
      requiredCategories =
        product?.MenuSizesList[0].FlavourAndToppingsList?.filter(
          (category) => !category.IsMultiple
        ) || [];
    }

    return requiredCategories.every(
      //@ts-ignore
      (category) => selectedOptions[category.Name]?.length > 0
    );
  };

  const resetSelections = () => {
    setExpandedOption(null);
    setSelectedOptions({});
    setSelectedSize("");
    setSpecialInstructions("");
    setImageScale(0.8);
  };

  useEffect(() => {
    if (isOpen) {
      const scrollPosition = window.scrollY;
      document.body.dataset.scrollPosition = scrollPosition.toString();
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = "100%";
    } else {
      const scrollPosition = parseInt(
        document.body.dataset.scrollPosition || "0"
      );
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "instant",
        });
      });
    }

    return () => {
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
      document.body.style.removeProperty("top");
      document.body.style.removeProperty("width");
      const scrollPosition = parseInt(
        document.body.dataset.scrollPosition || "0"
      );
      window.scrollTo({
        top: scrollPosition,
        behavior: "instant",
      });
    };
  }, [isOpen]);

  if (!product) return;

  return (
    <>
      <div className="fixed inset-0 z-50  bg-black/80 transition-opacity duration-200 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 overflow-y-auto">
          <div
            className={`w-full sm:max-w-[900px] h-full sm:min-h-0 sm:h-[85vh] z-60 sm:rounded-3xl  bg-white dark:bg-[#121212]  ${
              isOpen ? "slide-up" : "slide-down"
            }`}
          >
            <div className="sticky top-0 left-0 right-0 z-[51] lg:hidden">
              <div className="absolute left-0 flex justify-end p-4">
                <button
                  onClick={() => {
                    resetSelections();
                    onClose();
                  }}
                  className="p-2 bg-[var(--primary-light)] rounded-full transition-colors w-12 h-12"
                >
                  <FaChevronDown size={32} />
                </button>
              </div>
            </div>
            <div className="h-full flex flex-col md:flex-row relative">
              <div className="w-full md:w-7/12 p-2 md:p-4">
                {expandedOption && !isMobile() ? (
                  <div className="grid grid-cols-3 gap-4 h-full overflow-y-auto p-4">
                    {(
                      product.MenuSizesList?.find(
                        (cat) => cat.Size === selectedSize
                      )?.FlavourAndToppingsList?.find(
                        (t) => t.Name === expandedOption
                      )?.OptionsList ||
                      product.MenuSizesList[0].FlavourAndToppingsList.find(
                        (t) => t.Name === expandedOption
                      )?.OptionsList ||
                      []
                    ).map((option) => (
                      <div
                        key={option.ID}
                        onClick={() => {
                          const currentTopping =
                            product.MenuSizesList?.find(
                              (cat) => cat.Size === selectedSize
                            )?.FlavourAndToppingsList?.find(
                              (t) => t.Name === expandedOption
                            ) ||
                            product.MenuSizesList[0].FlavourAndToppingsList.find(
                              (t) => t.Name === expandedOption
                            );
                          if (currentTopping) {
                            handleOptionSelect(option, currentTopping);
                          }
                        }}
                        className={`cursor-pointer p-2 rounded-xl transition-all duration-200 
              bg-white dark:bg-[#202020] hover:bg-gray-50 dark:hover:bg-[#303030]
              flex flex-col items-center relative
              ${
                isOptionSelected(option, expandedOption)
                  ? "border-2 border-[#FFC714]"
                  : ""
              }
            `}
                      >
                        <Image
                          src={option.ItemImage || "/default-topping.png"}
                          width={150}
                          height={150}
                          alt={option.Name}
                          className="rounded-xl w-full h-36 object-contain"
                        />
                        <h3 className="font-bold text-[14px] text-center dark:text-white">
                          {option.Name}
                        </h3>
                        {option.Price > 0 && (
                          <p className="text-red-500 mt-2">
                            +Rs. {option.Price}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full relative rounded-xl shadow-sm p-4  flex items-center justify-center">
                    {isNewItem && (
                      <span className="absolute top-6 right-6 z-10 bg-[#1F9226] text-white text-[12px] font-light px-2 py-0.5 rounded animate-bounce">
                        New!
                      </span>
                    )}
                    <Image
                      src={product.ItemImage}
                      width={400}
                      height={400}
                      alt={product.Name}
                      className="rounded-xl w-full h-full object-cover transition-transform duration-300"
                      style={{
                        objectFit: "contain",
                        width: "80%",
                        height: "80%",
                        transform: `scale(${imageScale})`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="w-full md:w-5/12 p-2 md:p-4 overflow-y-auto bg-[#fcfcfc] dark:bg-[#202020] mb-20">
                <div className=" p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[24px] font-medium leading-tight mb-1 dark:text-white">
                      {product.Name}
                    </h2>
                    <IoInformationCircleOutline className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-[#838383] text-[14px] leading-tight mb-2">
                    {product.Description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {serving && (
                        <div className="flex items-center bg-[var(--primary-light)] rounded px-2 py-1">
                          <FiUser className="h-3 w-3 text-[var(--text-primary)]" />
                          <span className="text-[12px] ml-1 dark:text-white">
                            x {serving}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!product.MenuSizesList?.some(
                    (size) => size.FlavourAndToppingsList?.length > 0
                  ) && (
                    <div className="w-full bg-gray-100 dark:bg-[#303030] rounded-full py-1 text-center mt-4">
                      <span className="text-sm font-medium dark:text-white">
                        1 pc
                      </span>
                    </div>
                  )}
                  {product.MenuSizesList?.some(
                    (size) =>
                      size.Size !== "-" && size.Size !== "." && size.Size !== ""
                  ) && (
                    <div className="flex justify-center mb-4 overflow-x-auto rounded-full w-full">
                      <div className="relative flex items-center bg-gray-100 dark:bg-[#303030] p-1 w-full rounded-full whitespace-nowrap">
                        {product.MenuSizesList.map(
                          (size, idx) =>
                            size.Size !== "-" &&
                            size.Size !== "." &&
                            size.Size !== "" && (
                              <button
                                key={idx}
                                onClick={() => handleSizeSelect(size.Size)}
                                className={`relative z-10 py-1.5 px-4 text-sm transition-all duration-300 flex-shrink-0 ${
                                  selectedSize === size.Size
                                    ? "text-black font-medium"
                                    : "text-gray-500"
                                }`}
                              >
                                <span className="relative z-10 text-[12px]">
                                  {size.Size}
                                </span>
                                {selectedSize === size.Size && (
                                  <div className="absolute inset-0 bg-white rounded-full shadow-md transition-all duration-300" />
                                )}
                              </button>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {(selectedSize ||
                  !product.MenuSizesList?.some(
                    (size) =>
                      size.Size !== "-" && size.Size !== "." && size.Size !== ""
                  )) &&
                  product.MenuSizesList?.map((category, index) => (
                    <div key={index} className="rounded-[8px]">
                      {(!selectedSize ||
                        category.Size === selectedSize ||
                        category.Size === "-" ||
                        category.Size === ".") &&
                        category.FlavourAndToppingsList?.map((topping, idx) => (
                          <div
                            key={idx}
                            className="mb-1 px-2 shadow-sm rounded-[10px]"
                          >
                            <h3 className="text-[20px] font-semibold flex items-center gap-2 p-2 dark:text-white">
                              {topping.Name}
                              {!topping.IsMultiple && (
                                <span className="text-red-500 text-4xl">*</span>
                              )}
                            </h3>

                            {topping.IsMultiple ? (
                              <div className="grid grid-cols-3 gap-2 p-1">
                                {topping.OptionsList.map((option) => (
                                  <div
                                    key={option.ID}
                                    onClick={() =>
                                      handleOptionSelect(option, topping)
                                    }
                                    className={`cursor-pointer p-3 rounded-xl shadow-lg transition-all duration-200 
                                    bg-white dark:bg-[#202020] dark:hover:bg-[#303030]
                                    flex flex-col items-center relative
                                    ${
                                      isOptionSelected(option, topping.Name)
                                        ? "border border-[#FFC714]"
                                        : ""
                                    }`}
                                  >
                                    {isOptionSelected(option, topping.Name) && (
                                      <div className="absolute top-2 right-2 z-10">
                                        <FaRegCheckCircle className="w-6 h-6 text-[#FFC714]" />
                                      </div>
                                    )}
                                    <Image
                                      src={
                                        option.ItemImage ||
                                        "/default-topping.png"
                                      }
                                      width={100}
                                      height={100}
                                      alt={option.Name}
                                      className="rounded-xl w-full h-24 object-contain"
                                    />
                                    <h3 className="font-medium text-[12px] text-center dark:text-white  leading-tight">
                                      {option.Name}
                                    </h3>
                                    {option.Price > 0 && (
                                      <p className="text-red-500 mt-1 text-[16px]">
                                        +Rs. {option.Price}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer p-6 bg-white rounded-lg hover:bg-gray-50 dark:hover:bg-[#303030] flex items-center justify-between shadow-md transition-all duration-200 mb-2"
                                onClick={() => setExpandedOption(topping.Name)}
                              >
                                <div className="flex items-center gap-2">
                                  {topping.OptionsList &&
                                    topping.OptionsList[0] && (
                                      <>
                                        <Image
                                          src={
                                            topping.OptionsList[0].ItemImage ||
                                            "/default-topping.png"
                                          }
                                          width={100}
                                          height={100}
                                          alt={topping.OptionsList[0].Name}
                                          className="rounded-full shadow-lg h-28 object-cover"
                                        />
                                        <div className="flex flex-col gap-2">
                                          <span className="dark:text-white text-lg font-bold">
                                            {selectedOptions[topping.Name]
                                              ?.length > 0
                                              ? selectedOptions[topping.Name]
                                                  .map((opt: any) => opt.Name)
                                                  .join(", ")
                                              : topping.OptionsList[0].Name}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation(); // Prevent parent div click
                                              setExpandedOption(topping.Name);
                                            }}
                                            className="bg-[#FFC714] text-black px-3 py-1 rounded-full text-xs font-medium hover:bg-[#e5b313] transition-colors w-20"
                                          >
                                            Replace
                                          </button>
                                        </div>
                                      </>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}

                {/* <div className="flex flex-col gap-2 bg-white dark:bg-[#202020] md:rounded-xl md:shadow-md p-2 dark:text-white">
                <h3 className="text-[14px] font-bold">Extra Comments:</h3>

                <textarea
                  placeholder="Type your order instructions here"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-3 border text-[14px] rounded-md h-16 resize-none bg-[var(--primary-light)] focus:outline-none"
                />
                <div className="flex flex-col gap-2">
                  {
                    <>
                      {areAllRequiredOptionsSelected() && (
                        <>
                          <h3 className="font-bold text-[16px]">
                            Selected Items
                          </h3>
                          {Object.entries(selectedOptions).map(
                            ([category, options]) => (
                              <div
                                key={category}
                                className="flex flex-col gap-1"
                              >
                                {options.map((option: any) => (
                                  <div
                                    key={option.ID}
                                    className="flex justify-between text-[14px] border-b border-gray-200  py-2"
                                  >
                                    <span className="font-light text-gray-600">
                                      {category}
                                    </span>
                                    <span className="font-semibold text-[var(--text-primary)]">
                                      {option.Name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </>
                      )}
                    </>
                  }

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-medium text-[14px]">Total</span>
                    {areAllRequiredOptionsSelected() ? (
                      <span className="font-bold text-[14px]">
                        Rs. {calculateTotal()}
                      </span>
                    ) : (
                      <span className="font-bold text-[14px]">
                        Select Required Options
                      </span>
                    )}
                  </div>
                </div>
              </div> */}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-4/12 bg-[#FFC714] dark:text-[#000] text-white font-medium py-2 px-6 rounded-full transition-colors shadow-lg z-50 text-sm"
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                `Add to cart for Rs. ${calculateTotal()}`
              )}
            </button>

            <button
              onClick={() => {
                resetSelections();
                onClose();
              }}
              className="hidden lg:block absolute top-2 lg:right-[calc((100%-900px)/2-60px)] float-right p-2 rounded-full transition-colors w-12 h-12 z-50 text-white"
            >
              <IoClose size={36} />
            </button>
          </div>
        </div>
      </div>
      {expandedOption && isMobile() && (
        <OptionsPopup
          topping={
            product.MenuSizesList?.find(
              (cat) => cat.Size === selectedSize
            )?.FlavourAndToppingsList?.find((t) => t.Name === expandedOption) ||
            product.MenuSizesList[0].FlavourAndToppingsList.find(
              (t) => t.Name === expandedOption
            ) || {
              ID: 0,
              Name: expandedOption,
              Description: "",
              RemoteCode: "",
              Price: 0,
              IsActive: true,
              IsMultiple: false,
              SortOrder: 0,
              OptionsList: [],
            }
          }
          onClose={() => setExpandedOption(null)}
          onSelect={handleOptionSelect}
          selectedOptions={selectedOptions}
        />
      )}
    </>
  );
};

export default ProductPopup;
