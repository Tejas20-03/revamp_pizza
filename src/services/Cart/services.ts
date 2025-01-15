import { AxiosGet, AxiosPost } from "@/utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import { PostOrderData, ResponseOrder, VoucherResponse } from "./type";

const setErrorMessage = (message: string) => ({
  title: "Checkout Service",
  message,
});

// API's
const ProcessOrder_api = (phoneNumber: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=ProcessOrder&Phone=${phoneNumber}`;
const CheckVoucher_api = (voucher: string, city: string, total: number) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=CheckVoucher&Voucher=${voucher}&City=${city}&NetTotal=${total}`;

// Methods
export const postProcessOrder = (
  phoneNumber: string,
  data: PostOrderData,
  configData: configDataType
) =>
  AxiosPost<ResponseOrder>(
    ProcessOrder_api(phoneNumber),
    configData,
    setErrorMessage("postProcessOrder method"),
    data
  );
export const checkVoucher = (
  voucher: string,
  city: string,
  total: number,
  configData: configDataType
) =>
  AxiosGet<VoucherResponse>(
    CheckVoucher_api(voucher, city, total),
    configData,
    setErrorMessage("postProcessOrder method")
  );
