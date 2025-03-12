"use client";

import { getMenu, getOptions } from "@/services/Home/services";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MenuItemData, MenuItemOption } from "@/services/Home/types";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { addToCart } from "@/redux/cart/action";
import { openToaster } from "@/redux/toaster/slice";
import { FaRegCheckCircle } from "react-icons/fa";
import { addressesActions } from "@/redux/address/slice";
import { ProductType } from "@/redux/cart/slice";
import Toaster from "@/components/UI/Toaster";

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<StoreDispatch>();
  const addressData = useSelector((state: StoreState) => state.address);

  const [productData, setProductData] = useState<MenuItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, MenuItemOption[]>
  >({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const savedAddress = localStorage.getItem("address");
        const parsedAddress = savedAddress ? JSON.parse(savedAddress) : {};

        const location =
          parsedAddress.addressType === "Pickup"
            ? parsedAddress.outlet
            : parsedAddress.area;

        const menuData = await getMenu(
          parsedAddress.city || "",
          location || "",
          parsedAddress.addressType || "",
          {}
        );

        let foundProduct = null;
        menuData?.Data?.NestedMenuForMobile[0]?.MenuCategoryList.forEach(
          (category: any) => {
            const product = category.MenuItemsList.find(
              (item: any) => item.ID === params.slug
            );
            if (product) {
              foundProduct = product;
            }
          }
        );

        if (foundProduct) {
          //@ts-ignore
          const options = await getOptions(foundProduct.ID, {});
          setProductData(options?.Data || null);

          if (options && options?.Data?.MenuSizesList?.length > 0) {
            const defaultSize =
              options &&
              options.Data.MenuSizesList.find(
                (size: any) =>
                  size.Size !== "-" && size.Size !== "." && size.Size !== ""
              )?.Size;
            if (defaultSize) {
              setSelectedSize(defaultSize);
              // Set default options for non-multiple categories
              options &&
                options.Data.MenuSizesList[0].FlavourAndToppingsList?.forEach(
                  (category: any) => {
                    if (
                      !category.IsMultiple &&
                      category.OptionsList?.length > 0
                    ) {
                      setSelectedOptions((prev) => ({
                        ...prev,
                        [category.Name]: [category.OptionsList[0]],
                      }));
                    }
                  }
                );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [params.slug]);

  const areAllRequiredOptionsSelected = () => {
    const selectedSizeData = productData?.MenuSizesList?.find(
      (size) => size.Size === selectedSize
    );

    const toppingsList =
      selectedSizeData?.FlavourAndToppingsList ||
      productData?.MenuSizesList[0]?.FlavourAndToppingsList ||
      [];

    return toppingsList
      .filter((category) => !category.IsMultiple)
      .every((category) => selectedOptions[category.Name]?.length > 0);
  };

  const handleOptionSelect = (option: any, category: any) => {
    if (category && category.OptionsList) {
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
  };

  const isOptionSelected = (option: any, categoryName: string) => {
    return selectedOptions[categoryName]?.some(
      (opt: any) => opt.ID === option.ID
    );
  };

  const calculateTotal = () => {
    const selectedSizeData = productData?.MenuSizesList?.find(
      (size) => size.Size === selectedSize
    );

    const basePrice = selectedSizeData
      ? addressData.addressType === "Delivery"
        ? selectedSizeData.DeliveryPrice
        : selectedSizeData.TakeAwayPrice
      : (addressData.addressType === "Delivery"
          ? productData?.MenuSizesList[0].DeliveryPrice
          : productData?.MenuSizesList[0].TakeAwayPrice) || 0;

    const optionsTotal = Object.values(selectedOptions)
      .flat()
      .reduce((sum, opt) => sum + (opt.Price || 0), 0);

    return basePrice + optionsTotal;
  };

  const handleAddToCart = async () => {
    if (!productData) return;

    if (
      !addressData.addressType ||
      (addressData.addressType === "Delivery" &&
        (!addressData.area || !addressData.city)) ||
      (addressData.addressType === "Pickup" &&
        (!addressData.city || !addressData.outlet))
    ) {
      dispatch(addressesActions.setAddresses({ modalOpen: true }));
      return;
    }
    if (!areAllRequiredOptionsSelected()) {
      dispatch(
        openToaster({
          title: "Options Missing",
          message: "Please select all the required options.",
          buttonText: "OK",
          isOpen: true,
        })
      );
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem: ProductType = {
        ItemID: productData.ID || "",
        ProductName: productData.Name || "",
        ItemImage: productData.ItemImage || "",
        Quantity: 1,
        CategoryName: productData.CategoryName || "",
        MinimumDelivery: productData.MinimumDelivery || 0,
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
        SizeID: productData.MenuSizesList[0].ID,
        Price: productData.MenuSizesList[0].DiscountedPrice || 0,
        TotalProductPrice: calculateTotal(),
        discountGiven: 0,
        PaymentType: productData.PaymentType || "Cash",
      };

      await dispatch(addToCart({ products: cartItem }));
      dispatch(
        openToaster({
          showSuccess: true,
          message: "Added to cart",
          title: "Success",
        })
      );
      router.push("/");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FFC714] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Sticky Image Container */}
        <div className="md:sticky md:top-24 h-fit">
          <div className="relative group">
            {productData.IsNewItem && (
              <span className="absolute top-4 right-4 z-10 bg-[#1F9226] text-white text-sm px-4 py-2 rounded-full font-medium shadow-lg">
                New!
              </span>
            )}
            <Image
              src={productData.ItemImage}
              width={600}
              height={600}
              alt={productData.Name}
              className="rounded-3xl w-full object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold mb-3 dark:text-white">
              {productData.Name}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              {productData.Description}
            </p>
          </div>

          {productData.Serving && Number(productData.Serving) > 0 && (
            <div className="flex items-center gap-3 bg-[var(--primary-light)] w-fit px-4 py-2 rounded-full shadow-sm">
              <FiUser className="h-5 w-5" />
              <span className="font-medium">Serves {productData.Serving}</span>
            </div>
          )}

          {productData.MenuSizesList?.some(
            (size) => size.Size !== "-" && size.Size !== "." && size.Size !== ""
          ) && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold dark:text-white">
                Select Size
              </h2>
              <div className="flex flex-wrap gap-4">
                {productData.MenuSizesList.map(
                  (size, idx) =>
                    size.Size !== "-" &&
                    size.Size !== "." &&
                    size.Size !== "" && (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(size.Size)}
                        className={`px-8 py-3 rounded-full transition-all duration-300 text-lg font-medium
                        ${
                          selectedSize === size.Size
                            ? "bg-[#FFC714] text-black shadow-lg transform scale-105"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {size.Size}
                      </button>
                    )
                )}
              </div>
            </div>
          )}

          {productData.MenuSizesList?.map((category) =>
            category.FlavourAndToppingsList?.map((topping, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold dark:text-white">
                    {topping.Name}
                  </h2>
                  {!topping.IsMultiple && (
                    <span className="text-red-500 text-2xl">*</span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {topping.OptionsList.map((option) => (
                    <div
                      key={option.ID}
                      onClick={() => handleOptionSelect(option, topping)}
                      className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 hover:shadow-xl relative
                        ${
                          isOptionSelected(option, topping.Name)
                            ? "border-2 border-[#FFC714] bg-[#FFC71410]"
                            : "border border-gray-200 dark:border-gray-700 hover:border-[#FFC714]"
                        }
                      `}
                    >
                      {isOptionSelected(option, topping.Name) && (
                        <div className="absolute top-3 right-3">
                          <FaRegCheckCircle className="w-7 h-7 text-[#FFC714]" />
                        </div>
                      )}
                      <Image
                        src={option.ItemImage || "/default-topping.png"}
                        width={120}
                        height={120}
                        alt={option.Name}
                        className="w-full h-28 object-contain mb-4"
                      />
                      <h3 className="font-medium text-center text-lg dark:text-white">
                        {option.Name}
                      </h3>
                      {option.Price > 0 && (
                        <p className="text-red-500 text-center mt-2 font-semibold">
                          +Rs. {option.Price}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-6 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-[#FFC714] text-black font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 
              hover:bg-[#e5b313] disabled:opacity-50 hover:shadow-lg transform hover:-translate-y-1"
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Adding to cart...</span>
                </div>
              ) : (
                `Add to cart - Rs. ${calculateTotal()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
