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

    if (product) {
      getOptions(product.ID, {}).then((res) => {
        if (
          res?.Data.MenuSizesList[0].FlavourAndToppingsList &&
          res?.Data.MenuSizesList[0].FlavourAndToppingsList.length <= 0
        ) {
          const cartItem = {
            options: [],
            Price: res?.Data.MenuSizesList[0].DiscountedPrice,
            Quantity: 1,
            ProductName: res?.Data.Name,
            ItemID: res.Data.MenuSizesList[0].MenuItemID,
            CategoryName: res.Data.CategoryName,
            MinimumDelivery: res.Data.MenuSizesList[0].MinDeliveryPrice,
            SizeID: res.Data.MenuSizesList[0].ID,
            TotalProductPrice: res.Data.MenuSizesList[0].DiscountedPrice,
            discountGiven:
              res?.Data.MenuSizesList[0].ActualPrice -
              res?.Data.MenuSizesList[0].DiscountedPrice,
            ID: res.Data.ID,
            ItemImage: res.Data.ItemImage,
            PaymentType: res.Data.PaymentType,
          };

          dispatch(addToCart({ products: cartItem }));

          // Store in localStorage
          const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
          existingCart.push(cartItem);
          localStorage.setItem("cart", JSON.stringify(existingCart));
          dispatch(
            openToaster({
              showSuccess: true,
              message: "Added to cart",
              title: "Success",
            })
          );
          dispatch(setLoading(false));
        } else {
          setProductData(res?.Data || null);
          setOpen(true);
          dispatch(setLoading(false));
        }
      });
    }
  };

  return (
    <div className="w-full pb-[10px] bg-background px-0 md:px-28">
      <div className="xs:pl-[5px] pb-[10px] lg:pr-0 xs:pr-[5px]">
        <h2
          id={heading}
          className="text-[26px] text-manrope md:text-[32px] text-[#2A2a2a] dark:text-white font-bold mb-1 mt-2 mx-2 border-t-2 dark:border-[#202020] pt-2"
        >
          {heading}
        </h2>

        <div className="mx-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-w-[1400px] mx-auto">
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col p-1 rounded-[10px] pt-[5px] justify-between bg-white dark:bg-[#202020]  shadow-[5px_0px_20px_rgba(0,0,0,0.1)] relative h-fit"
              >
                <div
                  className="relative w-full rounded-[15px] p-1 transition-[filter,transform] cursor-pointer duration-200 linear shadow-[5px_0px_20px_rgba(0,0,0,0.1)]"
                  onClick={() => handleAddToCart(item)}
                >
                  <Image
                    src={item.ImageBase64}
                    alt={item.Name}
                    width={300} // Increase from 100
                    height={300} // Increase from 100
                    className="w-full h-full rounded-2xl object-fill"
                    quality={100} // Add this line
                  />
                </div>
                <div className="flex flex-col flex-1 px-1 mb-2">
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col md:flex-row gap-1">
                      {item.DiscountPercentage > 0 && (
                        <span className="bg-[#FFC714] dark:text-black text-[var(--text-primary)] text-[10px] font-normal px-1 py-0 rounded animate-bounce w-fit">
                          Save {item.DiscountPercentage}%
                        </span>
                      )}
                      {item.IsNewItem && (
                        <span className="bg-[#1F9226] text-white text-[12px] font-light px-1 py-0 rounded animate-bounce w-fit">
                          New!
                        </span>
                      )}
                      {item.Serving && Number(item.Serving) > 0 && (
                        <div className="flex items-center bg-[var(--primary-light)] rounded px-1 py-0.5 w-fit">
                          <FiUser className="h-3 w-3 text-[var(--text-primary)]" />
                          <span className="text-[10px] ml-1 dark:text-white">
                            x {item.Serving}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start">
                      {Number(item.DiscountedPrice) > 0 && (
                        <span
                          className={`text-[13px] font-medium ${
                            item.MinDeliveryPrice ? "" : "bg-gray-100"
                          } px-1 py-0 rounded dark:text-white`}
                        >
                          Rs.{item.DiscountedPrice}
                        </span>
                      )}
                      {Number(item.MinDeliveryPrice || 0) > 0 && (
                        <span className="text-[12px] font-normal line-through text-gray-500">
                          Rs.{item.MinDeliveryPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-[16px] font-bold py-1 flex-1 leading-tight dark:text-white">
                      {item.Name}
                    </h3>
                    <div className="h-8 w-8 rounded-full bg-[#FFC714] flex items-center cursor-pointer justify-center shadow-[0px_10px_15px_rgba(236,99,0,0.44)]">
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
                      className="text-[11px] md:text-xs text-gray-500 text-left mt-auto md:text-justify"
                      dangerouslySetInnerHTML={{ __html: item.Description }}
                    />
                  )}
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
