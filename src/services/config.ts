export const BASE_URL_BROADWAY_API = "https://services.broadwaypizza.com.pk";

export type configDataType = {
  token?: string;
  contentType?: "application/json" | "multipart/form-data";
};

export const REQUEST_CONFIG = (configData: configDataType) => ({
  headers: {
    //Authorization: configData.token ? `${configData.token || ''}` : '',
    "Content-Type": configData.contentType || "application/json",
  },
});
