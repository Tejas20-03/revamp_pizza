"use client";

import React, { useState } from "react";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/redux/cart/slice";

type Iprops = {
  voucherDialog: boolean;
  handleShowVoucherDialog: (value: boolean) => void;
};

const VoucherDialog: React.FC<Iprops> = ({
  voucherDialog,
  handleShowVoucherDialog,
}) => {
  const cartData = useSelector((state: StoreState) => state.cart);
  const addressData = useSelector((state: StoreState) => state.address);
  const dispatch = useDispatch<StoreDispatch>();
  const [voucher, setVoucher] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const handleCheckVoucher = async () => {
    if (!voucher) return;

    const payload = {
      voucherCode: voucher,
      locationData: {
        is_login: false,
        ordertype: addressData.addressType || "Delivery",
        geoAddress: null,
        Lat: null,
        Lng: null,
        NearestLandmark: null,
        selectedGST: addressData.delivery_tax || "15",
        outlet: addressData.outlet || "",
        city: addressData.city || "",
        area: addressData.area || "",
        customerName: null,
        customerNumber: addressData.phone || "",
        customerEmail: null,
        StudentID: null,
        GeogeoAddress: null,
        Address: null,
      },
      cartData: cartData.cartProducts.map((item) => ({
        ItemID: item.ItemID,
        ProductName: item.ProductName,
        ItemImage: item.ItemImage,
        options: item.options || [],
        Quantity: item.Quantity,
        CategoryName: item.CategoryName,
        MinimumDelivery: item.MinimumDelivery,
        TotalProductPrice: item.TotalProductPrice,
        Price: item.Price,
        discountGiven: item.discountGiven,
      })),
    };

    try {
      const response = await fetch(
        "https://beta.broadwaypizza.com.pk//BroadwayAPI.aspx?Method=CheckVoucherV2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const voucherResponse = await response.json();

      if (voucherResponse?.responseType === "1" && voucherResponse?.Message) {
        setErrorMessage(voucherResponse.Message);
        setShowErrorDialog(true);
      } else {
        dispatch(cartActions.applyVoucher({
          code: voucher,
          amount: voucherResponse?.VoucherAmount || 0
        }));
        dispatch(cartActions.calculateCartTotals({
          addressType: addressData.addressType,
          delivery_tax: addressData.delivery_tax
        }));
        handleShowVoucherDialog(false);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage("Error validating voucher");
      setShowErrorDialog(true);
    }
  };

  if (!voucherDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => handleShowVoucherDialog(false)}
      />

      <div className="bg-white dark:bg-[#202020] w-full max-w-[300px] p-6 rounded-lg shadow-xl z-10">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Apply Voucher
        </h2>

        <div className="mb-6">
          <p className="text-gray-400 mb-2 leading-tight dark:text-white">
            Have a voucher? Type your voucher to apply discount.
          </p>

          <input
            autoFocus
            type="text"
            className="w-full border-b-2 border-gray-300 dark:bg-[#202020] dark:text-white focus:border-[#FFC714] outline-none py-2 transition-colors"
            onChange={(e) => setVoucher(e.target.value)}
            value={voucher}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="text-[#FFC714] px-4 py-2 rounded hover:bg-[var(--primary-light)]"
            onClick={() => handleShowVoucherDialog(false)}
          >
            CANCEL
          </button>
          <button
            className="text-[#FFC714] px-4 py-2 rounded hover:bg-[var(--primary-light)]"
            onClick={handleCheckVoucher}
          >
            OK
          </button>
        </div>
      </div>

      {openSnackbar && (
        <div className="fixed bottom-20 lg:bottom-40 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg">
          <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Voucher applied successfully!</span>
            <button
              onClick={() => setOpenSnackbar(false)}
              className="ml-auto text-green-800 hover:text-green-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showErrorDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg w-full max-w-[300px] p-6">
            <h2 className="text-xl font-medium mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                className="text-[#FFC714] px-4 py-2 rounded hover:bg-[var(--primary-light)]"
                onClick={() => setShowErrorDialog(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherDialog;
