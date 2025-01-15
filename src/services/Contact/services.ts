import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import { ContactResponseType, ContactType } from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});

const addContact_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=AddContact`;

export const addContact = (data: ContactType, configData: configDataType) =>
  AxiosPost<ContactResponseType>(
    addContact_api(),
    configData,
    setErrorMessage("Contact Api"),
    data
  );
