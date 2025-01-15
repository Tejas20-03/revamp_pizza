export type AllOutletsResponseType = {
  ResponseType: 1;
  Data: {
    Id: string;
    Name: string;
    City: string;
    weekday_timing: string;
    weekend_timing: string;
    delivery_fees: string;
  }[];
};

export interface AllOutletsResponseDataType {
  Id: string;
  Name: string;
  City: string;
  weekday_timing: string;
  weekend_timing: string;
  delivery_fees: string;
}
