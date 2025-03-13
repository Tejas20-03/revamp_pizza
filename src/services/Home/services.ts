import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, BASE_URL_DODO_API, configDataType } from "../config";
import {
  BlogResponse_Type,
  GetMenuResponse,
  MenuItemResponse,
  PizzaArticlesResponse,
  WelcomePopupResponse,
} from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});

const GetMenu_api = (city: string, location: string, addressType: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetMenu&city=${city}&${
    addressType === "Pickup" ? `OutletName=${location}` : `area=${location}`
  }`;

const GetMenuImage_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetMenuImagesWeb`;

const getOptions_api = (Id: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetOptions&ItemID=${Id}`;
const getBanner_api = (city: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetBanners&City=${city}`;

const welcomePopup_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetPopUpImage`;
const blogsList_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=BlogListing`;
const getBlogBySlug_api = (slug: string) =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=GetBlogBySlug&BlogSlug=${slug}`;

export const getBlogBySlug = (slug: string, configData: configDataType) =>
  AxiosGet<BlogResponse_Type>(
    getBlogBySlug_api(slug),
    configData,
    setErrorMessage("getBlogBySlug method")
  );
export const getBlogList = (configData: configDataType) =>
  AxiosGet<PizzaArticlesResponse>(
    blogsList_api(),
    configData,
    setErrorMessage("getBlogList method")
  );
export const getMenu = (
  city: string,
  location: string,
  addressType: string,
  configData: configDataType
) =>
  AxiosGet<GetMenuResponse>(
    GetMenu_api(city, location, addressType),
    configData,
    setErrorMessage("getMenu method")
  );
export const getOptions = (Id: string, configData: configDataType) =>
  AxiosGet<MenuItemResponse>(
    getOptions_api(Id),
    configData,
    setErrorMessage("getOptions Error")
  );
export const getBanners = (city: string, configData: configDataType) =>
  AxiosGet<string[]>(
    getBanner_api(city),
    configData,
    setErrorMessage("getCities Error")
  );
export const getMenuImage = (configData: configDataType) =>
  AxiosGet<string[]>(
    GetMenuImage_api(),
    configData,
    setErrorMessage("getMenuImage Error")
  );
export const getWelcomePopup = (configData: configDataType) =>
  AxiosGet<WelcomePopupResponse>(
    welcomePopup_api(),
    configData,
    setErrorMessage("getWelcomePopup Error")
  );
