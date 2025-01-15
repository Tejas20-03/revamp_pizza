import { createSlice } from "@reduxjs/toolkit";
import { setAddresses } from "./reducer";

export const addressesSliceIntialState: AddressesSliceType = {
  city: null,
  addressType: "Delivery",
  area: null,
  outlet: null,
  tax: null,
  search: null,
  modalOpen: false,
  delivery_tax: null,
  phone:null,
};

const addressesSlice = createSlice({
  name: "addresses",
  initialState: addressesSliceIntialState,
  reducers: { setAddresses },
});

export default addressesSlice;
export const addressesActions = addressesSlice.actions;

export type AddressesSliceType = {
  city: string | null;
  addressType: "Delivery" | "Pickup" | null;
  area: string | null;
  outlet: string | null;
  tax: string | null;
  search: string | null;
  delivery_tax: string | null;
  modalOpen: boolean;
  phone:string|null;
};
