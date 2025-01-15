import { createAsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "../reduxStore";

const AddressesThunks = {
  SaveAddress: "addresses/saveAddress",
};

export const saveAddress = createAsyncThunk<
  string,
  { city: string; area: string; customAddress: string },
  AsyncThunkConfig
>(
  AddressesThunks.SaveAddress,
  async ({ city, area, customAddress }, { dispatch, getState }) => {
    const message = "";

    return message;
  }
);
