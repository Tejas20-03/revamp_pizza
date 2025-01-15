"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { useRouter } from "next/navigation";
import { cartActions } from "@/redux/cart/slice";
import { addressesActions } from "@/redux/address/slice";
import OrderSummary from "./OrderSummary";
import OrderForm from "./OrderForm";
import { openToaster } from "@/redux/toaster/slice";
import { initializeCartFromStorage } from "@/redux/cart/action";

function PlaceOrder() {
  const router = useRouter();
  const cartData = useSelector((state: StoreState) => state.cart);
  const addressData = useSelector((state: StoreState) => state.address);
  const [paymentType, setPaymentType] = useState("");
  const dispatch = useDispatch<StoreDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    remarks: "",
    phone: "",
    payment: "Cash",
    address: "",
    email: "",
    landmark: "",
  });

  useEffect(() => {
    dispatch(initializeCartFromStorage());
    const savedAddress = localStorage.getItem("address");
    if (savedAddress) {
      dispatch(addressesActions.setAddresses(JSON.parse(savedAddress)));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      cartActions.calculateCartTotals({
        addressType: addressData.addressType,
        delivery_tax: addressData.delivery_tax,
      })
    );
  }, [addressData.addressType, addressData.delivery_tax, dispatch]);

  const validateInput = (value: string) => {
    const validPrefixes = ["03"];
    if (value.length > 11) return "Input should not exceed 11 characters.";
    const isValidPrefix = validPrefixes.some((prefix) =>
      value.startsWith(prefix)
    );
    if (!isValidPrefix) return "Phone no. should start with '03'.";
    return "Valid Phone";
  };

  const handleConfirmOrder = async () => {
    const errorPhone = validateInput(formData.phone);
    setErrors(errorPhone);

    if (!formData.name || !formData.payment || !formData.phone) {
      dispatch(
        openToaster({
          title: "Broadway Pizza Pakistan",
          message: "Please enter all required fields",
          buttonText: "OK",
        })
      );
      return;
    }

    if (addressData.addressType === "Delivery" && !formData.address) {
      dispatch(
        openToaster({
          title: "Broadway Pizza Pakistan",
          message: "Please enter delivery address",
          buttonText: "OK",
        })
      );
      return;
    }

    if (errorPhone === "Valid Phone") {
      setIsLoading(true);

      const orderPayload = {
        platform: "Web",
        Area: addressData.area || "",
        cityname: addressData.city || "",
        customeraddress: formData.address,
        customerEmail: formData.email,
        Landmark: formData.landmark,
        phone: formData.phone,
        Remarks: formData.remarks,
        fullname: formData.name,
        tax: addressData.delivery_tax || "15",
        deliverytime: new Date().toISOString().replace("T", " ").slice(0, 19),
        ordertype: addressData.addressType,
        orderamount: cartData.cartSubTotal,
        taxamount: cartData.tax,
        discountamount: cartData.discount,
        totalamount: cartData.finalTotal - cartData.deliveryFee,
        deliverycharges: cartData.deliveryFee,
        Voucher: cartData.Voucher,
        VoucherDiscount: cartData.VoucherDiscount,
        orderdata: cartData.cartProducts.map((product) => ({
          ItemID: product.ItemID,
          ProductName: product.ProductName,
          ItemImage: product.ItemImage,
          options: product.options || [],
          Quantity: product.Quantity,
          CategoryName: product.CategoryName,
          MinimumDelivery: Number(product.MinimumDelivery),
          Price: product.Price,
          discountGiven: product.discountGiven,
        })),
        paymenttype: formData.payment,
        DeviceSignalID: "",
        AppVersion: 4,
      };

      try {
        const response = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=ProcessOrder&Phone=${formData.phone}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          }
        );

        const data = await response.json();

        if (data.responseType === 1) {
          dispatch(cartActions.clearCart());
          router.push(
            `/thankyou?data=${JSON.stringify({
              ...data,
              name: formData.name,
            })}`
          );
        } else {
          dispatch(
            openToaster({
              title: "Error",
              message: data.message,
              buttonText: "OK",
            })
          );
        }
      } catch (error) {
        console.error("Order processing error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const paymentTypeProduct = cartData.cartProducts.find(
      (item) => item.PaymentType
    );
    if (paymentTypeProduct) {
      setFormData((prev) => ({
        ...prev,
        payment: paymentTypeProduct.PaymentType,
      }));
      setPaymentType(paymentTypeProduct.PaymentType);
    }
  }, [cartData.cartProducts]);

  useEffect(() => {
    if (addressData.phone) {
      setFormData((prev) => ({
        ...prev,
        phone: addressData.phone || "",
      }));
    }
  }, [addressData.phone]);

  return (
    <div className="w-full">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <span className="text-gray-600 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </span>
          </Link>
          <h1 className="text-[28px] font-bold mb-2">Place Your Order</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-7 space-y-2">
            <OrderForm
              formData={formData}
              setFormData={setFormData}
              addressData={addressData}
              paymentType={paymentType}
              errors={errors}
            />
          </div>
          <div className="md:col-span-5 h-fit">
            <OrderSummary
              cartData={cartData}
              addressData={addressData}
              onConfirmOrder={handleConfirmOrder}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
