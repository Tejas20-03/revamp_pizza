import { PayloadAction } from "@reduxjs/toolkit";
import { AddressesSliceType } from "./slice";

type stateType = AddressesSliceType;
type actionType = PayloadAction<Partial<AddressesSliceType>>;

export const setAddresses = (state: stateType, action: actionType) => {
  const {
    city,
    addressType,
    area,
    outlet,
    delivery_tax,
    search,
    modalOpen,
    phone,
  } = action.payload;

  state.city = city !== undefined ? city : state.city;
  state.addressType =
    addressType !== undefined ? addressType : state.addressType;
  state.area = area !== undefined ? area : state.area;
  state.outlet = outlet !== undefined ? outlet : state.outlet;
  state.delivery_tax =
    delivery_tax !== undefined ? delivery_tax : state.delivery_tax;
  state.search = search !== undefined ? search : state.search;
  state.modalOpen = modalOpen !== undefined ? modalOpen : state.modalOpen;
  state.phone = phone !== undefined ? phone : state.phone;
};
