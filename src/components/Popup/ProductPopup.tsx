import { addToCart } from "@/redux/cart/action";
import { ProductType } from "@/redux/cart/slice";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { openToaster } from "@/redux/toaster/slice";
import { MenuItemData } from "@/services/Home/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoArrowDown, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

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
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [imageScale, setImageScale] = useState<number>(1);

  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const handleOptionSelect = (option: any, category: any) => {
    const categoryName = category.Name;
    setSelectedOptions((prev) => {
      const currentSelected = prev[categoryName] || [];
      if (category.IsMultiple) {
        const exists = currentSelected.find((opt: any) => opt.ID === option.ID);
        return {
          ...prev,
          [categoryName]: exists
            ? currentSelected.filter((opt: any) => opt.ID !== option.ID)
            : [...currentSelected, option],
        };
      }
      return { ...prev, [categoryName]: [option] };
    });
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
    setSelectedOptions([]);
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
    setSelectedOptions([]);
    setSelectedSize("");
    setSpecialInstructions("");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!product) return;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 p-2 sm:p-4">
        <div
          className={`w-full sm:max-w-[900px] min-h-screen sm:min-h-0 sm:h-[85vh] z-60 sm:rounded-3xl  bg-white dark:bg-[#121212] overflow-hidden ${
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
              {/* Product Header */}
              <div className="w-full h-full relative rounded-xl overflow-hidden shadow-sm p-4  flex items-center justify-center">
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
            </div>

            <div className="w-full md:w-5/12 p-2 md:p-4 overflow-y-auto">
              <div className="bg-white dark:bg-[#202020] p-4 rounded-lg shadow-sm mb-4">
                <h2 className="text-[22px] font-extrabold leading-tight mb-1 dark:text-white">
                  {product.Name}
                </h2>
                <p className="text-[#838383] text-[14px] leading-relaxed mb-2">
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
                  {!product.MenuSizesList?.some(
                    (size) =>
                      size.Size !== "-" && size.Size !== "." && size.Size !== ""
                  ) && (
                    <div className="text-[16px] font-semibold dark:text-white">
                      Rs.
                      {addressType === "Delivery"
                        ? product.MenuSizesList[0].DeliveryPrice
                        : product.MenuSizesList[0].TakeAwayPrice}
                    </div>
                  )}
                </div>
                {product.MenuSizesList?.some(
                  (size) =>
                    size.Size !== "-" && size.Size !== "." && size.Size !== ""
                ) && (
                  <div className="flex justify-center mb-4 overflow-x-auto rounded-full w-full">
                    <div className="relative flex items-center bg-gray-100 dark:bg-[#303030] p-1 w-fit rounded-full whitespace-nowrap">
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
                    {(!selectedSize || category.Size === selectedSize) &&
                      category.FlavourAndToppingsList?.map((topping, idx) => (
                        <div
                          key={idx}
                          className="mb-1 bg-white dark:bg-[#202020] px-2 shadow-sm rounded-[10px]"
                        >
                          <h3 className="text-[20px] font-semibold flex items-center gap-2 p-2 dark:text-white">
                            {topping.Name}{" "}
                            {!topping.IsMultiple && (
                              <span className="text-red-500 text-4xl">*</span>
                            )}
                          </h3>
                          <div className="flex overflow-x-auto lg:grid lg:grid-cols-5 gap-1 pb-2">
                            {topping.OptionsList?.map((option, optIdx) => (
                              <div
                                key={optIdx}
                                onClick={() =>
                                  handleOptionSelect(option, topping)
                                }
                                className={`flex-none lg:flex-auto cursor-pointer`}
                              >
                                <div
                                  className={`w-[100px] md:w-[130px] h-full relative rounded-lg overflow-hidden flex flex-col items-center justify-start p-1 pb-2 transition-all duration-200 dark:border dark:border-[#121212] dark:bg-[#ffffff0f] ${
                                    isOptionSelected(option, topping.Name)
                                      ? "bg-[#ffd13e3b]  border-[#ffd13e7a] dark:bg-[#008c00]"
                                      : ""
                                  }`}
                                  style={{
                                    boxShadow: "3px 3px 5px rgb(255 0 0 / 5%)",
                                  }}
                                >
                                  <Image
                                    src={
                                      option.ItemImage || "/default-topping.png"
                                    }
                                    width={70}
                                    height={70}
                                    alt={option.Name}
                                    className="rounded-[10px] w-[70px] h-[70px] object-contain"
                                  />
                                  <div className="text-center mt-1">
                                    <span className="text-[13px] text-[#555555] dark:text-white font-medium block leading-tight">
                                      {option.Name}
                                    </span>
                                    {option.Description && (
                                      <span className="text-[9px] text-[#555555] dark:text-white leading-3 block">
                                        {option.Description}
                                      </span>
                                    )}
                                    {option.Price > 0 && (
                                      <span className="text-red-500 text-[12px] block mt-1">
                                        +Rs. {option.Price}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
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
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="hidden lg:fixed bottom-4 left-4 right-4 md:static mt-1 md:mt-2 mb-2 w-full bg-[#FFC714] dark:text-[#000] text-[var(--text-primary)] font-extrabold py-4 md:py-3 px-6 rounded-t-2xl md:rounded-xl transition-colors shadow-lg z-50"
              >
                {isAddingToCart ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "ADD TO ORDER"
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="hidden md:fixed bottom-4 right-8 w-4/12 bg-[#FFC714] dark:text-[#000] text-[var(--text-primary)] font-extrabold py-4 px-6 rounded-full transition-colors shadow-lg z-50"
          >
            {isAddingToCart ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "ADD TO ORDER"
            )}
          </button>

          <button
            onClick={onClose}
            className="hidden lg:block absolute top-4 lg:right-[calc((100%-900px)/2-60px)] float-right p-2 bg-[var(--primary-light)] rounded-full transition-colors w-12 h-12 z-50"
          >
            <IoClose size={32} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductPopup;
