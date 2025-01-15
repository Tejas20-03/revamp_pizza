import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import { GetOutletsforLocationResponse, LocationResponse } from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});

const GetCitiesWithImage_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?method=GetCitiesWithImage`;
const GetAreas_api = (city: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?method=GetAreas&City=${city}`;
const GetOutlets_api = (city: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetOutlets&City=${city}`;
const GetOutletsforLocation_api = (city: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?method=GetOutletsforLocation&City=${city}`;

export const getCitiesWithImage = (configData: configDataType) =>
  AxiosGet<LocationResponse>(
    GetCitiesWithImage_api(),
    configData,
    setErrorMessage("GetCitiesWithImage method")
  );

export const getAreas = (city: string, configData: configDataType) =>
  AxiosGet<string[]>(
    GetAreas_api(city),
    configData,
    setErrorMessage("GetCitiesWithImage method")
  );
export const getOutlets = (city: string, configData: configDataType) =>
  AxiosGet<string[]>(
    GetOutlets_api(city),
    configData,
    setErrorMessage("GetCitiesWithImage method")
  );
export const getOutletsforLocation = (
  city: string,
  configData: configDataType
) =>
  AxiosGet<GetOutletsforLocationResponse[]>(
    GetOutletsforLocation_api(city),
    configData,
    setErrorMessage("GetCitiesWithImage method")
  );
