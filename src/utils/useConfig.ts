import { useContext } from "react";
import { ConfigContext } from "@/app/ConfigContext";

export const useConfig = () => {
  return useContext(ConfigContext);
};
