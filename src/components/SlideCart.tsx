"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreState, StoreDispatch } from "@/redux/reduxStore";
import {
  addQuantity,
  removeQuantity,
  removeFromCart,
  addToCart,
} from "@/redux/cart/action";
import ItemCard from "@/app/cart/ItemCard";
import { useRouter } from "next/navigation";
import { IoArrowForward, IoClose } from "react-icons/io5";
import { MenuItemData } from "@/services/Home/types";
import { SuggestiveItemsType } from "@/services/Cart/type";
import { cartActions, ProductType } from "@/redux/cart/slice";
import { getOptions } from "@/services/Home/services";
import { openToaster, toggleCart } from "@/redux/toaster/slice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import VoucherDialog from "./Popup/VoucherDialog";
import { IoIosArrowForward } from "react-icons/io";

const EmptyCart = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col h-full">
    <div className="flex justify-between items-center p-4 border-b">
      <Image
        src="/assets/broadwayPizzaLogo.png"
        alt="Broadway Pizza"
        width={150}
        height={40}
        className="h-auto w-28 sm:w-32"
        priority
        quality={100}
      />
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <IoClose size={24} />
      </button>
    </div>
    <div className="flex flex-col justify-center items-center flex-1 space-y-4 relative">
      <div className="absolute w-80 h-80 bg-white rounded-full dark:block hidden"></div>
      <h5 className="text-2xl font-normal text-gray-700 z-10">Your cart is</h5>
      <h5 className="text-2xl font-semibold text-gray-900 z-10">Empty</h5>
    </div>
  </div>
);


const SlideCart = () => {
  const dispatch = useDispatch<StoreDispatch>();
  const isOpen = useSelector((state: StoreState) => state.toaster.isCartOpen);
  const onClose = () => dispatch(toggleCart(false));
  const router = useRouter();
  const cartData = useSelector((state: StoreState) => state.cart);
  const addressData = useSelector((state: StoreState) => state.address);
  const [voucherDialog, setVoucherDialog] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState({
    showRemoveConfirm: false,
    itemIdToRemove: null as number | null,
    productData: null as MenuItemData | null,
    open: false,
  });
  const [isLoading, setIsLoading] = useState({
    checkout: false,
    suggestiveItems: false,
  });

  const [suggestiveItems, setSuggestiveItems] = useState<SuggestiveItemsType[]>(
    []
  );

  const maxMinDeliveryPrice = useMemo(
    () =>
      Math.max(
        ...cartData.cartProducts.map(
          (product) => Number(product.MinimumDelivery) || 0
        )
      ),
    [cartData.cartProducts]
  );

  useEffect(() => {
    if (isOpen) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      const focusableElements = document.querySelector('[role="dialog"]')
        ?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && focusableElements?.length) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };
  
      document.addEventListener('keydown', handleTab);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen]);
  

  useEffect(() => {
    dispatch(
      cartActions.calculateCartTotals({
        addressType: addressData.addressType,
        delivery_tax: addressData.delivery_tax,
      })
    );
  }, [
    addressData.addressType,
    addressData.delivery_tax,
    dispatch,
    cartData.cartProducts,
  ]);
  const handleMinusClick = useCallback(
    (item: any) => {
      if (!item?.ItemID) return;
      if (item.Quantity <= 1) {
        dispatch(removeFromCart({ id: item.ItemID }));
      } else {
        dispatch(removeQuantity({ id: item.ItemID }));
      }
    },
    [dispatch]
  );

  const handleAddQuantity = useCallback(
    (id: number) => {
      const item = cartData.cartProducts.find(
        (product) => Number(product.ItemID) === Number(id)
      );
      if (item) {
        dispatch(
          addQuantity({
            id: Number(id),
            options: item.options,
          })
        );
      }
    },
    [dispatch, cartData.cartProducts]
  );

  const handleRemoveItem = useCallback(() => {
    if (dialogState.itemIdToRemove) {
      dispatch(removeFromCart({ id: dialogState.itemIdToRemove }));
      setDialogState((prev) => ({
        ...prev,
        showRemoveConfirm: false,
        itemIdToRemove: null,
      }));
    }
  }, [dialogState.itemIdToRemove, dispatch]);

  const handleContinueToCheckout = async () => {
    try {
      setIsLoading((prev) => ({ ...prev, checkout: true }));

      if (cartData.cartSubTotal < maxMinDeliveryPrice) {
        throw new Error("Minimum delivery price not met");
      }

      const response = await fetch(
        `https://beta.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddCustomerEvent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Event: "CheckOut",
            Phone: addressData.phone || "",
          }),
        }
      );

      const data = await response.json();
      if (data.ResponseType === 1) {
        router.push("/place-order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, checkout: false }));
    }
  };

  const calculateGrossTotal = () => {
    return Math.round(
      cartData.cartProducts.reduce((total, item) => {
        const originalPrice =
          (item.TotalProductPrice + item.discountGiven) * item.Quantity;
        return total + originalPrice;
      }, 0)
    );
  };
  const handleShowVoucherDialog = (val: boolean) => {
    setVoucherDialog(val);
  };

  const handleRemoveVoucher = () => {
    dispatch(cartActions.applyVoucher({ code: "", amount: 0 }));
  };

  const handleAddSuggestedItem = useCallback(
    async (item: SuggestiveItemsType) => {
      try {
        const res = await getOptions(item.ItemID, {});

        if (
          res &&
          res?.Data.MenuSizesList[0].FlavourAndToppingsList?.length <= 0
        ) {
          const cartItem: ProductType = {
            ItemID: res.Data.MenuSizesList[0].MenuItemID || "",
            ProductName: res.Data.Name || "",
            ItemImage: res.Data.ItemImage || "",
            Quantity: 1,
            CategoryName: res.Data.CategoryName || "",
            MinimumDelivery:
              Number(res.Data.MenuSizesList[0].MinDeliveryPrice) || 0,
            options: [],
            SizeID: res.Data.MenuSizesList[0].ID,
            Price: res.Data.MenuSizesList[0].DiscountedPrice || 0,
            TotalProductPrice: res.Data.MenuSizesList[0].DiscountedPrice || 0,
            discountGiven:
              res.Data.MenuSizesList[0].ActualPrice -
                res.Data.MenuSizesList[0].DiscountedPrice || 0,
            PaymentType: res.Data.PaymentType || "Cash",
          };

          dispatch(addToCart({ products: cartItem }));
          dispatch(
            openToaster({
              showSuccess: true,
              message: "Added to Cart",
              title: "Success",
            })
          );
        } else {
          setDialogState((prev) => ({
            ...prev,
            productData: res?.Data || null,
            open: true,
          }));
        }
      } catch (error) {
        console.error("Error adding suggested item:", error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchSuggestiveItems = async () => {
      try {
        setIsLoading((prev) => ({ ...prev, suggestiveItems: true }));
        const response = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=GetSuggestiveItems&City=${
            addressData.city || "Karachi"
          }&Area=${addressData.area || addressData.outlet || "Bahadurabad"}`
        );
        const data = await response.json();
        const filteredItems = (data.Data || []).filter(
          (suggestedItem: SuggestiveItemsType) =>
            !cartData.cartProducts.some(
              (cartItem) => String(cartItem.ItemID) === suggestedItem.ItemID
            )
        );
        setSuggestiveItems(filteredItems);
      } catch (error) {
        console.error("Error fetching suggestive items:", error);
      } finally {
        setIsLoading((prev) => ({ ...prev, suggestiveItems: false }));
      }
    };

    if (cartData.cartProducts.length > 0) {
      fetchSuggestiveItems();
    }
  }, [
    addressData.city,
    addressData.area,
    addressData.outlet,
    cartData.cartProducts,
  ]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#F3F3F7] shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
          role="dialog"
  aria-modal="true"
      >
        {cartData.cartProducts.length === 0 ? (
         <EmptyCart onClose={onClose} />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-[24px] font-semibold">
                {cartData.cartProducts.length} item for Rs.{" "}
                {cartData.finalTotal}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {cartData.cartProducts.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  onMinusClick={handleMinusClick}
                  onAddQuantity={handleAddQuantity}
                />
              ))}
              {suggestiveItems.length > 0 && (
                <div className="px-4 py-3 bg-white dark:bg-[#202020] border-t">
                  <h3 className="text-[18px] font-semibold mb-2 dark:text-white">
                    Add to order?
                  </h3>
                  <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={8}
                    slidesPerView={2.5}
                    autoplay={{ delay: 3000 }}
                    className="suggestive-swiper"
                  >
                    {suggestiveItems.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="bg-gray-50 dark:bg-[#303030] rounded-lg p-2 cursor-pointer">
                          <div className="relative">
                            <Image
                              src={item.ItemImage}
                              alt={item.ItemName}
                              width={100}
                              height={100}
                              className="w-full h-auto object-cover rounded-md"
                            />
                            <span className="absolute bottom-1 right-1 bg-[#1f9226] text-white text-[10px] px-2 py-0.5 rounded">
                              Rs. {item.price}
                            </span>
                          </div>
                          <div className="mt-2">
                            <h4 className="text-sm font-medium line-clamp-1 dark:text-white">
                              {item.ItemName}
                            </h4>
                            <button
                              onClick={() => handleAddSuggestedItem(item)}
                              className="mt-2 w-full bg-[#ffc714] text-black text-xs font-bold py-1.5 rounded-md hover:bg-[#e5b413] transition-colors"
                            >
                              ADD TO CART
                            </button>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            {cartData.cartProducts.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div
                    className="border-2 border-dashed border-[#ccc] py-2 text-center cursor-pointer mb-3"
                    onClick={() =>
                      cartData.VoucherDiscount > 0
                        ? handleRemoveVoucher()
                        : handleShowVoucherDialog(true)
                    }
                  >
                    {cartData.VoucherDiscount > 0 ? (
                      <p className="text-[#e59401] font-bold">Remove Voucher</p>
                    ) : (
                      <>
                        <p className="text-[#e59401] font-bold text-[14px]">
                          Have a Voucher?
                        </p>
                        <p className="mt-0.75 text-[14px] text-[#e59401]">
                          Add your voucher to add discount
                        </p>
                      </>
                    )}
                  </div>
                  {cartData.VoucherDiscount > 0 && (
                    <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
                      <p className="font-semibold">Voucher</p>
                      <p>Rs. -{Number(cartData.VoucherDiscount.toFixed(2))}</p>
                    </div>
                  )}

                  {calculateGrossTotal() > cartData.cartSubTotal && (
                    <div className="flex justify-between py-2 border-gray-300">
                      <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
                        Gross Total:
                      </p>
                      <p className="font-normal text-[16px] text-[var(--text-primary)]">
                        Rs. {calculateGrossTotal()}
                      </p>
                    </div>
                  )}

                  {Number(cartData.discount) > 0 && (
                    <div className="flex justify-between py-2 border-t border-gray-300">
                      <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
                        Discount:
                      </p>
                      <p className="font-normal text-[16px] text-[var(--text-primary)]">
                        Rs. {cartData.discount}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-t border-gray-300">
                    <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
                      Total:
                    </p>
                    <p className="text-[var(--text-primary)] font-semibold">
                      Rs. {cartData.finalTotal}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleContinueToCheckout}
                  disabled={isLoading.checkout}
                  className="w-full bg-[#FFC714] text-white py-3 rounded-full font-semibold hover:bg-[#e6b313] transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading.checkout ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      To place an order
                      <IoIosArrowForward size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <VoucherDialog
        voucherDialog={voucherDialog}
        handleShowVoucherDialog={handleShowVoucherDialog}
      />
    </>
  );
};

export default SlideCart;
