"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import {
  addQuantity,
  addToCart,
  removeFromCart,
  removeQuantity,
} from "@/redux/cart/action";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ProductType, cartActions } from "@/redux/cart/slice";
import { SuggestiveItemsType } from "@/services/Cart/type";
import { getOptions } from "@/services/Home/services";
import { MenuItemData } from "@/services/Home/types";
import LocationDisplay from "@/components/UI/LocationDialog";
import ItemCard from "./ItemCard";
import CartPricingSummary from "./CartPricingSummary";
import { openToaster } from "@/redux/toaster/slice";

const EmptyCart = () => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4 relative">
    <div className="absolute w-80 h-80 bg-white rounded-full dark:block hidden"></div>
    <h5 className="text-2xl font-normal text-gray-700 z-10">Your cart is</h5>
    <h5 className="text-2xl font-semibold text-gray-900 z-10">Empty</h5>
  </div>
);

export default function Cart() {
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
  const cartData = useSelector((state: StoreState) => state.cart);
  const addressData = useSelector((state: StoreState) => state.address);
  const router = useRouter();
  const dispatch = useDispatch<StoreDispatch>();

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
    dispatch(
      cartActions.calculateCartTotals({
        addressType: addressData.addressType,
        delivery_tax: addressData.delivery_tax,
      })
    );
  }, [addressData.addressType, addressData.delivery_tax, dispatch]);

  const handleMinusClick = useCallback(
    (item: any) => {
      if (!item?.ItemID) return;
      if (item.Quantity <= 1) {
        setDialogState((prev) => ({
          ...prev,
          showRemoveConfirm: true,
          itemIdToRemove: item.ItemID,
        }));
      } else {
        dispatch(removeQuantity({ id: item.ItemID }));
      }
    },
    [dispatch]
  );
  const handleAddQuantity = useCallback(
    (id: number) => {
      const item = cartData.cartProducts.find(
        product => Number(product.ItemID) === Number(id)
      );
      if (item) {
        dispatch(addQuantity({ 
          id: Number(id),
          options: item.options
        }));
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
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto px-4 py-2">
        {cartData.cartProducts.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-8 space-y-2">
              <div className="flex flex-col space-y-1">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:ml-2">
                  Your Cart
                </h2>
                {addressData.city && addressData.addressType && (
                  <LocationDisplay
                    city={addressData.city}
                    area={addressData.area}
                    outlet={addressData.outlet}
                    addressType={addressData.addressType}
                  />
                )}
              </div>
              <div className="space-y-4">
                {cartData.cartProducts.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    onMinusClick={handleMinusClick}
                    onAddQuantity={handleAddQuantity}
                  />
                ))}
              </div>

              <div className="space-y-4">
                {suggestiveItems.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    isSuggestive={true}
                    onAddSuggestedItem={handleAddSuggestedItem}
                  />
                ))}
              </div>

              <Link href="/" className="block">
                <button className="w-full py-3 text-[14px] bg-gray-100 dark:text-black dark:bg-gray-400 hover:bg-gray-200 text-gray-900 font-extrabold rounded-lg transition-colors">
                  ADD MORE ITEMS
                </button>
              </Link>
            </div>
            <div className="md:col-span-5 h-fit">
              <CartPricingSummary
                cartData={cartData}
                addressData={addressData}
                maxMinDeliveryPrice={maxMinDeliveryPrice}
                onCheckout={handleContinueToCheckout}
                isLoading={isLoading.checkout}
              />
            </div>
          </div>
        )}
      </div>

      {dialogState.showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() =>
              setDialogState((prev) => ({
                ...prev,
                showRemoveConfirm: false,
                itemIdToRemove: null,
              }))
            }
          />
          <div className="relative bg-white rounded-lg w-full p-6 max-w-[280px]">
            <h3 className="text-xl font-semibold mb-4 opacity-90">
              Remove Item
            </h3>
            <p className="text-[var(--primary-text)] mb-4 opacity-70">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end gap-6">
              <button
                className="text-[#ffc714] cursor-pointer font-semibold text-sm rounded"
                onClick={() =>
                  setDialogState((prev) => ({
                    ...prev,
                    showRemoveConfirm: false,
                    itemIdToRemove: null,
                  }))
                }
              >
                CANCEL
              </button>
              <button
                className="text-[#ffc714] cursor-pointer font-semibold text-sm rounded"
                onClick={handleRemoveItem}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
