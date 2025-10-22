export interface CustomerInfo {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface CarrierConfig {
  id?: string;
  selected_carrier: string;
  account_number?: string;
  account_contract_mapping?: string;
  contract_file?: File | string;
  account_manager_name?: string;
  account_manager_email?: string;
  account_manager_phone?: string;
  premium_service?: string;
  premium_contact_name?: string;
  premium_contact_email?: string;
  premium_contact_phone?: string;
  negotiated_rates?: File | string;
  api_key?: string;
  invoice_method?: string;
  wms_file?: string;
  created_at?: Date;
}

export interface TrackingAPI {
  api_endpoint: string;
  api_username: string;
  api_password: string;
  api_key: string;
}

export interface OnboardingState {
  customerId?: string;
  customerInfo?: CustomerInfo;
  carrierConfigs?: CarrierConfig[];
  currentCarrierConfigId?: string;
  trackingAPI?: TrackingAPI;
  invoiceEmail?: string;
  currentStep: number;
  lastSaved?: Date;
}

export type CarrierOption =
  | "DHL Parcel"
  | "DHL Express"
  | "DPD"
  | "GLS"
  | "UPS"
  | "FedEx";

export const CARRIERS: CarrierOption[] = [
  "DHL Parcel",
  "DHL Express",
  "DPD",
  "GLS",
  "UPS",
  "FedEx"
];
