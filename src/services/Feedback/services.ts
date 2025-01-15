import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import { AllOutletsResponseType } from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});
const getFeedbackOutlet_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetAllOutlets`;

export const getFeedbackOutlet = (configData: configDataType) =>
  AxiosGet<AllOutletsResponseType>(
    getFeedbackOutlet_api(),
    configData,
    setErrorMessage("Get Feedback Outlet")
  );
