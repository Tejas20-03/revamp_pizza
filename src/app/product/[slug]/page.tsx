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

const ProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<StoreDispatch>();
  const addressData = useSelector((state: StoreState) => state.address);
  
  const [productData, setProductData] = useState<MenuItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, MenuItemOption[]>>({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const savedAddress = localStorage.getItem("address");
        const parsedAddress = savedAddress ? JSON.parse(savedAddress) : {};
        
        const location = parsedAddress.addressType === "Pickup" 
          ? parsedAddress.outlet 
          : parsedAddress.area;

        const menuData = await getMenu(
          parsedAddress.city || "",
          location || "",
          parsedAddress.addressType || "",
          {}
        );

        let foundProduct = null;
        menuData?.Data?.NestedMenuForMobile[0]?.MenuCategoryList.forEach((category: any) => {
          const product = category.MenuItemsList.find(
            (item: any) => item.ID === params.slug
          );
          if (product) {
            foundProduct = product;
          }
        });

        if (foundProduct) {
          //@ts-ignore
          const options = await getOptions(foundProduct.ID, {});
          setProductData(options?.Data || null);
          //@ts-ignore
          if (options?.Data?.MenuSizesList?.length > 0) {
            //@ts-ignore
            const defaultSize = options.Data.MenuSizesList.find(
              (size: any) => size.Size !== "-" && size.Size !== "." && size.Size !== ""
            )?.Size;
            if (defaultSize) {
              setSelectedSize(defaultSize);
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

  const handleOptionSelect = (option: any, category: any) => {
    if (category && category.OptionsList) {
      setSelectedOptions((prev) => {
        const categoryName = category.Name;
        if (category.IsMultiple) {
          const currentSelected = prev[categoryName] || [];
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
    }
  };

  const isOptionSelected = (option: any, categoryName: string) => {
    return selectedOptions[categoryName]?.some((opt: any) => opt.ID === option.ID);
  };

  const calculateTotal = () => {
    const selectedSizeData = productData?.MenuSizesList?.find(
      (size) => size.Size === selectedSize
    );

    const basePrice = selectedSizeData
      ? addressData.addressType === "Delivery"
        ? selectedSizeData.DeliveryPrice
        : selectedSizeData.TakeAwayPrice
      : 0;

    const optionsTotal = Object.values(selectedOptions)
      .flat()
      .reduce((sum, opt) => sum + (opt.Price || 0), 0);

    return basePrice + optionsTotal;
  };

  const handleAddToCart = async () => {
    if (!productData) return;

    if (!addressData.addressType || 
        (addressData.addressType === "Delivery" && (!addressData.area || !addressData.city)) ||
        (addressData.addressType === "Pickup" && (!addressData.city || !addressData.outlet))) {
      dispatch(addressesActions.setAddresses({ modalOpen: true }));
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        ItemID: productData.ID || "",
        ProductName: productData.Name || "",
        ItemImage: productData.ItemImage || "",
        Quantity: 1,
        CategoryName: productData.CategoryName || "",
        MinimumDelivery: productData.MinimumDelivery || 0,
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          {productData.IsNewItem && (
            <span className="absolute top-4 right-4 z-10 bg-[#1F9226] text-white text-sm px-3 py-1 rounded">
              New!
            </span>
          )}
          <Image
            src={productData.ItemImage}
            width={600}
            height={600}
            alt={productData.Name}
            className="rounded-2xl w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{productData.Name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{productData.Description}</p>
          </div>

          {productData.Serving && Number(productData.Serving) > 0 && (
            <div className="flex items-center gap-2 bg-[var(--primary-light)] w-fit px-3 py-1 rounded">
              <FiUser className="h-4 w-4" />
              <span>Serves {productData.Serving}</span>
            </div>
          )}

          {productData.MenuSizesList?.some(
            (size) => size.Size !== "-" && size.Size !== "." && size.Size !== ""
          ) && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold dark:text-white">Select Size</h2>
              <div className="flex gap-4">
                {productData.MenuSizesList.map((size, idx) => (
                  size.Size !== "-" && size.Size !== "." && size.Size !== "" && (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size.Size)}
                      className={`px-6 py-2 rounded-full transition-all ${
                        selectedSize === size.Size
                          ? "bg-[#FFC714] text-black"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {size.Size}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          {productData.MenuSizesList?.map((category) => (
            category.FlavourAndToppingsList?.map((topping, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold dark:text-white">{topping.Name}</h2>
                  {!topping.IsMultiple && (
                    <span className="text-red-500 text-xl">*</span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {topping.OptionsList.map((option) => (
                    <div
                      key={option.ID}
                      onClick={() => handleOptionSelect(option, topping)}
                      className={`cursor-pointer p-4 rounded-xl transition-all relative
                        ${isOptionSelected(option, topping.Name)
                          ? "border-2 border-[#FFC714]"
                          : "border border-gray-200 dark:border-gray-700"}
                      `}
                    >
                      {isOptionSelected(option, topping.Name) && (
                        <div className="absolute top-2 right-2">
                          <FaRegCheckCircle className="w-6 h-6 text-[#FFC714]" />
                        </div>
                      )}
                      <Image
                        src={option.ItemImage || "/default-topping.png"}
                        width={100}
                        height={100}
                        alt={option.Name}
                        className="w-full h-24 object-contain mb-2"
                      />
                      <h3 className="font-medium text-center dark:text-white">{option.Name}</h3>
                      {option.Price > 0 && (
                        <p className="text-red-500 text-center mt-1">+Rs. {option.Price}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ))}

          <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-[#FFC714] text-black font-medium py-3 px-6 rounded-full transition-all hover:bg-[#e5b313] disabled:opacity-50"
            >
              {isAddingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
