import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "../reduxStore";
import { ProductType, cartActions } from "./slice";

const CartThunks = {
  addToCart: "cart/addToCart",
  removeFromCart: "cart/removeFromCart",
  addQuantity: "cart/addQuantity",
  removeQuantity: "cart/removeQuantity",
};

export const addToCart = createAsyncThunk<
  string,
  { products: ProductType },
  AsyncThunkConfig
>(CartThunks.addToCart, async ({ products }, { dispatch, getState }) => {
  const state = getState().cart;
  const existingItem = state.cartProducts.find(
    (item) =>
      item.ItemID === products.ItemID &&
      JSON.stringify(item.options) === JSON.stringify(products.options)
  );

  if (existingItem) {
    dispatch(
      cartActions.updateQuantity({
        itemId: products.ItemID,
        quantity: existingItem.Quantity + 1,
        options: products.options,
      })
    );
  } else {
    dispatch(cartActions.addItem(products));
  }
  return "Item added to cart";
});

export const removeFromCart = createAsyncThunk<
  string,
  { id: number },
  AsyncThunkConfig
>(CartThunks.removeFromCart, async ({ id }, { dispatch }) => {
  dispatch(cartActions.removeItem(id));
  return "Item removed from cart";
});

export const addQuantity = createAsyncThunk<
  string,
  { id: number; options?: any[] },
  AsyncThunkConfig
>(CartThunks.addQuantity, async ({ id, options }, { dispatch, getState }) => {
  const state = getState().cart;
  const item = state.cartProducts.find((product) => {
    if (options && options.length > 0) {
      return (
        product.ItemID === id &&
        JSON.stringify(product.options) === JSON.stringify(options)
      );
    }
    return product.ItemID === id;
  });

  if (item) {
    dispatch(
      cartActions.updateQuantity({
        itemId: id,
        quantity: item.Quantity + 1,
        options: options || [],
      })
    );
  }
  return "Quantity increased";
});

export const removeQuantity = createAsyncThunk<
  string,
  { id: number; options?: any[] },
  AsyncThunkConfig
>(
  CartThunks.removeQuantity,
  async ({ id, options }, { dispatch, getState }) => {
    const state = getState().cart;
    const item = state.cartProducts.find((product) => {
      if (options && options.length > 0) {
        return (
          product.ItemID === id &&
          JSON.stringify(product.options) === JSON.stringify(options)
        );
      }
      return product.ItemID === id;
    });

    if (item && item.Quantity > 1) {
      dispatch(
        cartActions.updateQuantity({
          itemId: id,
          quantity: item.Quantity - 1,
          options: options || [],
        })
      );
    }
    return "Quantity decreased";
  }
);

export const clearCart = createAsyncThunk<string, void, AsyncThunkConfig>(
  "cart/clearCart",
  async (_, { dispatch }) => {
    dispatch(cartActions.clearCart());
    return "Cart cleared";
  }
);

export const initializeCartFromStorage = createAsyncThunk<
  string,
  void,
  AsyncThunkConfig
>("cart/initialize", async (_, { dispatch }) => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    dispatch(cartActions.initializeCart(JSON.parse(savedCart)));
  }
  return "Cart initialized";
});
