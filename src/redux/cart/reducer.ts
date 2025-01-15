import { PayloadAction } from "@reduxjs/toolkit";
import { CartSliceType } from "./slice";

type stateType = CartSliceType;
type actionType = PayloadAction<Partial<CartSliceType>>;

export const setCart = (state: stateType, action: actionType) => {
  const {
    cartProducts,
    cartSubTotal,
    cartTotal,
    discount,
    Voucher,
    VoucherDiscount,
    search,
    deliveryFee,
    tax,
    finalTotal,
  } = action.payload;

  if (cartProducts !== undefined) {
    state.cartProducts = cartProducts;
    state.discount = cartProducts.reduce(
      (total, item) => total + item.discountGiven * item.Quantity,
      0
    );
  }
  state.cartSubTotal =
    cartSubTotal !== undefined ? cartSubTotal : state.cartSubTotal;
  state.cartTotal = cartTotal !== undefined ? cartTotal : state.cartTotal;
  state.VoucherDiscount =
    VoucherDiscount !== undefined ? VoucherDiscount : state.VoucherDiscount;
  state.Voucher = Voucher !== undefined ? Voucher : state.Voucher;
  state.search = search !== undefined ? search : state.search;
  state.deliveryFee =
    deliveryFee !== undefined ? deliveryFee : state.deliveryFee;
  state.tax = tax !== undefined ? tax : state.tax;
  state.finalTotal = finalTotal !== undefined ? finalTotal : state.finalTotal;
};
