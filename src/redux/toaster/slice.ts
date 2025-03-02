import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToasterState {
  isOpen?: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  showSuccess?: boolean;
  isLoading?: boolean;
  progressLoader?: boolean;
  progressMessage?: string;
  isCartOpen?: boolean;
}

const initialState: ToasterState = {
  isOpen: false,
  title: "",
  message: "",
  buttonText: "",
  showSuccess: false,
  isLoading: false,
  progressLoader: false,
  progressMessage: "",
  isCartOpen: false,
};

export const toasterSlice = createSlice({
  name: "toaster",
  initialState,
  reducers: {
    openToaster: (state, action: PayloadAction<ToasterState>) => {
      state.isOpen = action.payload.isOpen || false;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.buttonText = action.payload.buttonText;
      state.showSuccess = action.payload.showSuccess;
    },
    closeToaster: (state) => {
      state.isOpen = false;
      state.showSuccess = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showProgressLoader: (
      state,
      action: PayloadAction<{ progressLoader: boolean; message: string }>
    ) => {
      state.progressLoader = action.payload.progressLoader;
      state.progressMessage = action.payload.message;
    },
    hideProgressLoader: (state) => {
      state.progressLoader = false;
      state.progressMessage = "";
    },
    toggleCart: (state, action: PayloadAction<boolean>) => {
      state.isCartOpen = action.payload;
    },
  },
});

export const {
  openToaster,
  closeToaster,
  setLoading,
  showProgressLoader,
  hideProgressLoader,
  toggleCart
} = toasterSlice.actions;
export default toasterSlice.reducer;
