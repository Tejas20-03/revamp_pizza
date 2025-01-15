import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { cartSlice } from "@/redux/cart/slice";
import addressesSlice from "@/redux/address/slice";
import authReducer from './auth/slice';
import toasterReducer from './toaster/slice';

const reduxStore = configureStore({
  reducer: combineReducers({
    cart: cartSlice.reducer,
    address: addressesSlice.reducer,
    auth: authReducer,
    toaster: toasterReducer,
  }),
});
export default reduxStore;
export type StoreDispatch = typeof reduxStore.dispatch;
export type StoreState = ReturnType<typeof reduxStore.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  StoreState,
  unknown,
  Action
>;
export type AsyncThunkConfig = {
  state: StoreState;
  dispatch: StoreDispatch;
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
};
