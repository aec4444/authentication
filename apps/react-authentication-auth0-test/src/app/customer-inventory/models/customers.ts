export interface Customer {
  customerID: string;
  customerName: string;
  shipToAddress1: string;
  city: string;
  state: string;
  postal: string;
  country?: string;

  html?: {
    name: string,
    address: string,
    id: string
  };
}
