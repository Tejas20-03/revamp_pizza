import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userData: {
    name: string;
    phone: string;
    email: string;
    wallet?: any;
    orders?: {
      Data: Array<{
        ID: string;
        CustomerName: string;
        OrderAmount: string;
        Created: string;
        OutletName: string;
        Status: string;
        FeedbackURL: string;
      }>;
    };
    info?: any;
  } | null;
}

const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: !!getUserFromStorage(),
  userData: getUserFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      localStorage.removeItem("userData");
    },
    updateOrders: (state, action: PayloadAction<any>) => {
      if (state.userData) {
        state.userData.orders = action.payload;
        localStorage.setItem("userData", JSON.stringify(state.userData));
      }
    },
  },
});

export const { login, logout, updateOrders } = authSlice.actions;
export default authSlice.reducer;
