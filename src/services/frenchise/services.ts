import { AxiosGet, AxiosPost } from "../../utils/api-methods";
import { BASE_URL_BROADWAY_API, configDataType } from "../config";
import { FranchiseApplicant, FranchiseApplicantResponseType } from "./types";

const setErrorMessage = (message: string) => ({
  title: "Address Service",
  message,
});

const Frienchise_api = () =>
  `${BASE_URL_BROADWAY_API}/BroadwayAPI.aspx?Method=franchiserequestv1`;

export const postFrenchiseData = (
  data: FranchiseApplicant,
  configData: configDataType
) =>
  AxiosPost<FranchiseApplicantResponseType>(
    Frienchise_api(),
    configData,
    setErrorMessage("Frenchise Error"),
    data
  );
