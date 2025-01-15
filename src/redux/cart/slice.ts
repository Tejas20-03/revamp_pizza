import { createSlice } from "@reduxjs/toolkit";

export type CartSliceType = {
  cartTotal: number;
  cartSubTotal: number;
  taxableSubTotal: number;
  discount: number;
  cartProducts: ProductType[];
  Voucher: string;
  VoucherDiscount: number;
  search: string;
  deliveryFee: number;
  tax: number;
  finalTotal: number;
};

export const cartSliceIntialState: CartSliceType = {
  cartTotal: 0,
  cartSubTotal: 0,
  taxableSubTotal: 0,
  discount: 0,
  cartProducts: [],
  Voucher: "",
  VoucherDiscount: 0,
  search: "",
  deliveryFee: 0,
  tax: 0,
  finalTotal: 0,
};

const calculateTaxableSubTotal = (products: ProductType[]) => {
  return Math.round(
    products.reduce(
      (total, item) => total + item.TotalProductPrice * item.Quantity,
      0
    )
  );
};

const calculateSubTotal = (products: ProductType[], taxRate: number) => {
  const taxMultiplier = (100 - taxRate) / 100;
  return Math.round(
    products.reduce(
      (total, item) => total + item.TotalProductPrice * item.Quantity,
      0
    ) * taxMultiplier
  );
};

const calculateTax = (subtotal: number, taxRate: number) => {
  return Math.round(subtotal * (taxRate / 100));
};

const calculateDiscount = (products: ProductType[]) => {
  return products.reduce(
    (total, item) => total + item.discountGiven * item.Quantity,
    0
  );
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: cartSliceIntialState,
  reducers: {
    addItem: (state, action) => {
      state.cartProducts.push(action.payload);
      state.taxableSubTotal = calculateTaxableSubTotal(state.cartProducts);
      state.cartSubTotal = calculateSubTotal(state.cartProducts, state.tax);
      state.discount = calculateDiscount(state.cartProducts);
      localStorage.setItem("cart", JSON.stringify(state.cartProducts));
    },
    removeItem: (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (item) => item.ItemID !== action.payload
      );
      state.taxableSubTotal = calculateTaxableSubTotal(state.cartProducts);
      state.cartSubTotal = calculateSubTotal(state.cartProducts, state.tax);
      state.discount = calculateDiscount(state.cartProducts);
      localStorage.setItem("cart", JSON.stringify(state.cartProducts));
    },
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.cartProducts.findIndex(
        (item) => item.ItemID === itemId
      );
      if (itemIndex !== -1) {
        state.cartProducts[itemIndex].Quantity = quantity;
        state.taxableSubTotal = calculateTaxableSubTotal(state.cartProducts);
        state.cartSubTotal = calculateSubTotal(state.cartProducts, state.tax);
        state.discount = calculateDiscount(state.cartProducts);
        localStorage.setItem("cart", JSON.stringify(state.cartProducts));
      }
    },
    applyVoucher: (state, action) => {
      state.Voucher = action.payload.code;
      state.VoucherDiscount = action.payload.amount;
      state.finalTotal =
        state.cartSubTotal -
        state.VoucherDiscount +
        state.tax +
        state.deliveryFee;
    },
    calculateCartTotals: (state, action) => {
      const { addressType, delivery_tax } = action.payload;
      state.tax = calculateTax(state.taxableSubTotal, Number(delivery_tax));
      state.cartSubTotal = calculateSubTotal(state.cartProducts, Number(delivery_tax));
      state.deliveryFee = addressType === "Delivery" ? 79 : 0;
      state.finalTotal =
        state.cartSubTotal -
        state.VoucherDiscount +
        state.tax +
        state.deliveryFee;
    },
    clearCart: (state) => {
      Object.assign(state, cartSliceIntialState);
      localStorage.removeItem("cart");
    },
    initializeCart: (state, action) => {
      state.cartProducts = action.payload;
      state.taxableSubTotal = calculateTaxableSubTotal(action.payload);
      state.cartSubTotal = calculateSubTotal(action.payload, state.tax);
      state.discount = calculateDiscount(action.payload);
    },
  },
});

export const cartActions = cartSlice.actions;

export type ProductType = {
  ItemID: string | number;
  ProductName: string;
  ItemImage: string;
  Quantity: number;
  CategoryName: string;
  MinimumDelivery: number;
  CookingInstruction?: string;
  options: OptionsType[];
  SizeID: number;
  Price: number;
  TotalProductPrice: number;
  discountGiven: number;
  PaymentType: string;
};

export type OptionsType = {
  OptionID: number;
  OptionName: string;
  OptionGroupName: string;
  Price: number;
  Quantity: number;
};
