import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import {
  CateringDataType,
  ChallengeDataType,
  CorporateDataType,
} from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});
const ProcessChallenge_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=ProcessChallenge`;
const AddCateringEvent_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=AddCateringEvent`;
const AddCorporateEvent_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=AddCorporateEvent`;

export const processChallange = (
  data: ChallengeDataType,
  configData: configDataType
) =>
  AxiosPost(
    ProcessChallenge_api(),
    configData,
    setErrorMessage("ProcessChallenge_api"),
    data
  );
export const cateringEvent = (
  data: CateringDataType,
  configData: configDataType
) =>
  AxiosPost(
    AddCateringEvent_api(),
    configData,
    setErrorMessage("ProcessChallenge_api"),
    data
  );
export const corporateEvent = (
  data: CorporateDataType,
  configData: configDataType
) =>
  AxiosPost(
    AddCorporateEvent_api(),
    configData,
    setErrorMessage("ProcessChallenge_api"),
    data
  );
