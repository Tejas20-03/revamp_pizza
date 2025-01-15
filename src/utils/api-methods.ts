import axios from "axios";
import { configDataType, REQUEST_CONFIG } from "../services/config";
import { LogError } from "@/utils/dev-logging";

export const AxiosPost = async <T>(
  url: string,
  config: configDataType,
  errorHandling: { title: string; message: string },
  data?: object
) => {
  try {
    let bodyData: string | FormData | undefined;
    if (data)
      bodyData =
        config.contentType === "multipart/form-data"
          ? ConvertObjectToFormData(data)
          : ConvertObjectToJson(data);
    const response = await axios.post(url, bodyData, REQUEST_CONFIG(config));
    return response.data as T;
  } catch (error) {
    LogError(errorHandling.title, errorHandling.message, error);
  }
};

export const AxiosGet = async <T>(
  url: string,
  config: configDataType,
  errorHandling: { title: string; message: string }
) => {
  try {
    const response = await axios.get(url, REQUEST_CONFIG(config));
    return response.data as T;
  } catch (error) {
    LogError(errorHandling.title, errorHandling.message, error);
  }
};

export const ConvertObjectToJson = (data: object) => JSON.stringify(data);
export const ConvertJsonToObject = <T>(data: string) => JSON.parse(data) as T;
const ConvertObjectToFormData = (data: object) => {
  const formData = new FormData();
  Object.entries(data).map((value) => formData.append(value[0], value[1]));
  return formData;
};
