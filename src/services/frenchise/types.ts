export type FranchiseApplicant = {
  firstName: string;
  contact: string;
  Email: string;
  occupation: string;
  city: string;
  own_other_franchises: string;
  own_property: string;
  hearAbout: string;
  totalLiquidAssets: string;
  regions: string;
};
export type FranchiseApplicantResponseType = {
  responseType: 1 | 0;
  message: string;
};
