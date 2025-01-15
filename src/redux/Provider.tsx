"use client";

import reduxStore from "@/redux/reduxStore";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={reduxStore}>{children}</Provider>;
}
