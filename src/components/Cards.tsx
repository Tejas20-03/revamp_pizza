"use client";

import { addressesActions } from "@/redux/address/slice";
import { addToCart } from "@/redux/cart/action";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { getOptions } from "@/services/Home/services";
import { MenuItem, MenuItemData } from "@/services/Home/types";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ProductPopup from "./Popup/ProductPopup";
import { openToaster, setLoading } from "@/redux/toaster/slice";

type Iprops = {
  data: MenuItem[];
  heading: string;
  isLoading: boolean;
};

const Cards: React.FC<Iprops> = ({ data, heading, isLoading }) => {
  const dispatch = useDispatch<StoreDispatch>();
  const addressData = useSelector((state: StoreState) => state.address);
  const [open, setOpen] = useState<boolean>(false);
  const [productData, setProductData] = useState<MenuItemData | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleAddToCart = (product: MenuItem) => {
    setSelectedItem(product);
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
    dispatch(setLoading(true));

    // if (product) {
    //   getOptions(product.ID, {}).then((res) => {
    //     if (
    //       res?.Data.MenuSizesList[0].FlavourAndToppingsList &&
    //       res?.Data.MenuSizesList[0].FlavourAndToppingsList.length <= 0
    //     ) {
    //       const cartItem = {
    //         options: [],
    //         Price: res?.Data.MenuSizesList[0].DiscountedPrice,
    //         Quantity: 1,
    //         ProductName: res?.Data.Name,
    //         ItemID: res.Data.MenuSizesList[0].MenuItemID,
    //         CategoryName: res.Data.CategoryName,
    //         MinimumDelivery: res.Data.MenuSizesList[0].MinDeliveryPrice,
    //         SizeID: res.Data.MenuSizesList[0].ID,
    //         TotalProductPrice: res.Data.MenuSizesList[0].DiscountedPrice,
    //         discountGiven:
    //           res?.Data.MenuSizesList[0].ActualPrice -
    //           res?.Data.MenuSizesList[0].DiscountedPrice,
    //         ID: res.Data.ID,
    //         ItemImage: res.Data.ItemImage,
    //         PaymentType: res.Data.PaymentType,
    //       };

    //       dispatch(addToCart({ products: cartItem }));

    //       // Store in localStorage
    //       const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    //       existingCart.push(cartItem);
    //       localStorage.setItem("cart", JSON.stringify(existingCart));
    //       dispatch(
    //         openToaster({
    //           showSuccess: true,
    //           message: "Added to cart",
    //           title: "Success",
    //         })
    //       );
    //       dispatch(setLoading(false));
    //     } else {
    //       setProductData(res?.Data || null);
    //       setOpen(true);
    //       dispatch(setLoading(false));
    //     }
    //   });
    // }
    if (product) {
      getOptions(product.ID, {}).then((res) => {
        setProductData(res?.Data || null);
        setOpen(true);
        dispatch(setLoading(false));
      });
    }
  };

  return (
    <div className="w-full pb-[10px] bg-background px-0 md:px-28">
      <div className="xs:pl-[5px] pb-[10px] lg:pr-0 xs:pr-[5px]">
        <h2
          id={heading}
          className="text-[19px] text-manrope md:text-[22px] text-[#2A2a2a] dark:text-white font-bold my-4 mx-4 border-t-2 dark:border-[#202020] pt-2"
        >
          {heading}
        </h2>

        <div className="mx-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-[1400px] mx-auto">
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex flex-row md:flex-col p-1 rounded-[10px] pt-[5px] justify-between bg-white dark:bg-[#202020] relative"
                onClick={() => handleAddToCart(item)}
              >
                <div className="relative w-1/3 md:w-full rounded-[15px] p-1 transition-[filter,transform] cursor-pointer duration-200 linear">
                  {item.DiscountPercentage > 0 && (
                    <span className="absolute top-2 left-2 z-10 bg-[#FFC714] dark:text-black text-[var(--text-primary)] text-[10px] font-normal px-1 py-0 rounded-lg animate-bounce">
                      Save {item.DiscountPercentage}%
                    </span>
                  )}
                  {item.IsNewItem && (
                    <span className="absolute top-2 right-2 z-10 bg-[#1F9226] text-white text-[12px] font-light px-1 py-0 rounded">
                      New!
                    </span>
                  )}
                  <Image
                    src={item.ImageBase64}
                    alt={item.Name}
                    width={300}
                    height={300}
                    className="w-full h-full rounded-2xl object-contain"
                    quality={100}
                  />
                </div>
                <div className="flex flex-col flex-1 px-1 mb-2 justify-start">
                  <div className="flex justify-between items-center gap-1">
                    <h3 className="text-[15px] font-bold py-1 flex-1 leading-tight dark:text-white">
                      {item.Name}
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-[#FFC714] hidden items-center cursor-pointer justify-center shadow-[0px_10px_15px_rgba(236,99,0,0.44)]">
                      <AiOutlinePlus
                        className="h-6 w-6  text-[var(--text-primary)]"
                        onClick={() => {
                          handleAddToCart(item);
                        }}
                      />
                    </div>
                  </div>

                  {item.Description && (
                    <div
                      className="text-[12px] text-gray-800 text-left md:text-justify mt-1"
                      dangerouslySetInnerHTML={{ __html: item.Description }}
                    />
                  )}
                  <div className="flex flex-col justify-between mt-2 gap-2">
                    <div className="flex flex-row gap-4">
                      {item.Serving && Number(item.Serving) > 0 && (
                        <div className="flex items-center bg-[var(--primary-light)] rounded px-1 py-0.5 w-fit">
                          <FiUser className="h-3 w-3 text-[var(--text-primary)]" />
                          <span className="text-[10px] ml-1 dark:text-white">
                            x {item.Serving}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center flex-row gap-2">
                        {Number(item.DiscountedPrice) > 0 && (
                          <span
                            className={`text-[14px] font-bold 
                         dark:text-white md:text-black text-[#FFC714] md:bg-transparent bg-[#fff0e6] px-6 py-2 md:p-0 rounded-full md:rounded-none`}
                          >
                            Rs.{item.DiscountedPrice}
                          </span>
                        )}
                        {Number(item.MinDeliveryPrice || 0) > 0 && (
                          <span className="hidden md:block text-[10px] font-normal relative after:absolute after:w-[120%] after:h-[2px] after:bg-red-400 after:block after:left-[-2px] after:top-[50%] after:rotate-[-10deg] after:origin-center">
                            Rs.{item.MinDeliveryPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="hidden md:block px-6 py-1 rounded-full bg-[#fff0e6] text-[#FFC714] text-[13px] font-medium hover:opacity-90 transition-opacity"
                      >
                        Choose
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductPopup
        isOpen={open}
        product={productData}
        isNewItem={selectedItem?.IsNewItem}
        serving={selectedItem?.Serving}
        minDeliveryPrice={selectedItem?.MinDeliveryPrice}
        onClose={() => {
          setOpen(false);
          setProductData(null);
          setSelectedItem(null);
        }}
      />
    </div>
  );
};

export default Cards;
