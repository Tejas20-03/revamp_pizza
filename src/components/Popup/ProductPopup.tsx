import { addToCart } from "@/redux/cart/action";
import { ProductType } from "@/redux/cart/slice";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { openToaster } from "@/redux/toaster/slice";
import { MenuItemData, MenuItemOption } from "@/services/Home/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaRegCheckCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { IoClose, IoInformationCircleOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import OptionsPopup from "./OptionsPopup";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const addressType = useSelector(
    (state: StoreState) => state.address.addressType
  );
  const phoneNumber = useSelector((state: StoreState) => state.address.phone);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, MenuItemOption[]>
  >({});
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [imageScale, setImageScale] = useState<number>(1);
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
  };

  const handleClose = () => {
    router.push(window.location.pathname, { scroll: false });
    resetSelections();
    onClose();
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
    if (product) {
      const toppingsList =
        product.MenuSizesList?.find((cat) => cat.Size === selectedSize)
          ?.FlavourAndToppingsList ||
        product.MenuSizesList[0].FlavourAndToppingsList;

      toppingsList.forEach((category) => {
        if (!category.IsMultiple && category.OptionsList?.length > 0) {
          setSelectedOptions((prev) => ({
            ...prev,
            [category.Name]: [category.OptionsList[0]],
          }));
        }
      });
    }
  }, [product, selectedSize]);

  if (!product) return;

  return (
    <>
      <div className="fixed inset-0 z-50  bg-black/60 transition-opacity duration-200 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen sm:p-4">
          <div
            className="hidden md:block absolute z-[52]"
            style={{
              right: window.innerWidth >= 1920 ? "28rem" : "15rem",
              top: "4rem",
            }}
          >
            <button
              onClick={handleClose}
              className="p-2 bg-white dark:bg-[#202020] rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[#404040] flex items-center justify-center shadow-lg"
              aria-label="Close popup"
            >
              <IoClose size={24} className="dark:text-white" />
            </button>
          </div>
          <div
            className={`w-full sm:max-w-[900px] h-[100dvh] sm:min-h-0 sm:h-[85vh] z-60 sm:rounded-3xl bg-white dark:bg-[#121212] ${
              isOpen ? "slide-up" : "slide-down"
            } overflow-y-auto`}
          >
            <div className="absolute top-0 left-0  z-[51] lg:hidden bg-white dark:bg-[#121212]">
              <div className="fixed left-0 flex justify-end p-4">
                <button
                  onClick={() => {
                    resetSelections();
                    onClose();
                  }}
                  className="p-2 bg-[var(--primary-light)] rounded-full transition-colors w-10 h-10"
                >
                  <FaChevronDown size={24} />
                </button>
              </div>
            </div>
            <div className="h-full flex flex-col md:flex-row relative pb-[80px] md:pb-0 overflow-y-auto">
              <div className="w-full md:w-7/12 p-2 md:p-4 md:sticky md:top-0">
                {expandedOption && !isMobile() ? (
                  <>
                    <button
                      onClick={() => setExpandedOption(null)}
                      className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <FaChevronDown className="rotate-90" size={16} />
                      <span>Back to product</span>
                    </button>
                    <div className="grid grid-cols-3 gap-4 options-grid p-4">
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
                            setExpandedOption(null);
                          }}
                          className={`cursor-pointer p-1 rounded-xl transition-all duration-200 
              bg-white dark:bg-[#121212] hover:bg-gray-50 dark:hover:bg-[#202020]
              flex flex-col items-center relative h-fit
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
                  </>
                ) : (
                  <div className="w-full md:min-h-[400px] relative rounded-xl shadow-sm p-4 flex items-center justify-center z-0">
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
                        width: "100%",
                        height: "100%",
                        transform: `scale(${imageScale})`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="w-full md:w-5/12 p-2 md:p-4 bg-[#fcfcfc] dark:bg-[#121212] z-10 max-h-[70vh] md:max-h-none md:h-auto">
                <div className="mt-2">
                  <div className=" p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-[24px] font-medium leading-tight mb-1 dark:text-white">
                        {product.Name}
                      </h2>
                      <IoInformationCircleOutline className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className=" text-[14px] text-[#2f2f2f] leading-tight mb-2">
                      {product.Description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {serving && Number(serving) > 0 && (
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
                      <div className="w-full bg-gray-100 dark:bg-[#121212] rounded-full py-1 text-center mt-4">
                        <span className="text-sm font-medium dark:text-white">
                          1 pc
                        </span>
                      </div>
                    )}
                    {product.MenuSizesList?.some(
                      (size) =>
                        size.Size !== "-" &&
                        size.Size !== "." &&
                        size.Size !== ""
                    ) && (
                      <div className="flex justify-center mb-4 w-full">
                        <div className="relative max-w-full overflow-x-auto no-scrollbar">
                          <div className="relative flex items-center justify-start bg-gray-100 dark:bg-[#202020] p-1 rounded-full whitespace-nowrap min-w-fit mx-auto">
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
                      </div>
                    )}
                  </div>
                </div>

                {(selectedSize ||
                  !product.MenuSizesList?.some(
                    (size) =>
                      size.Size !== "-" && size.Size !== "." && size.Size !== ""
                  )) &&
                  product.MenuSizesList?.map((category, index) => (
                    <div key={index} className="rounded-[8px] ">
                      {(!selectedSize ||
                        category.Size === selectedSize ||
                        category.Size === "-" ||
                        category.Size === ".") &&
                        category.FlavourAndToppingsList?.map((topping, idx) => (
                          <div
                            key={idx}
                            className="mb-2 px-2 shadow-sm rounded-[10px]"
                          >
                            <h3 className="text-[16px] font-semibold flex items-center gap-2 p-2 dark:text-white">
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
                                    bg-white dark:bg-[#202020] dark:hover:bg-[#202020]
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
                                className="cursor-pointer p-2 bg-white rounded-lg hover:bg-gray-50 dark:bg-[#202020] flex items-center justify-between shadow-md transition-all duration-200 mb-2"
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
                                          className="rounded-full shadow-lg h-auto object-cover"
                                        />
                                        <div className="flex flex-col gap-2">
                                          <span className="dark:text-white text-[15px] font-bold">
                                            {selectedOptions[topping.Name]
                                              ?.length > 0
                                              ? selectedOptions[topping.Name]
                                                  .map((opt: any) => opt.Name)
                                                  .join(", ")
                                              : topping.OptionsList[0].Name}
                                          </span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
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
                <div className="fixed bottom-0 left-0 right-0 z-[51] bg-[#fcfcfc] dark:bg-[#121212] p-4 md:sticky md:-bottom-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-[#FFC714] dark:text-[#000] text-white font-medium py-2 px-6 rounded-full transition-colors shadow-lg text-sm"
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : (
                      `Add to cart for Rs. ${calculateTotal()}`
                    )}
                  </button>
                </div>
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
