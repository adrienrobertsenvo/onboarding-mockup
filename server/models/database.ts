// In-memory database (replace with real database in production)
// For production, use PostgreSQL, MongoDB, or similar

export interface Customer {
  id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  invoice_email: string;
  onboarding_completed: boolean;
  created_at: Date;
}

export interface CarrierConfig {
  id: string;
  customer_id: string;
  selected_carrier: string;
  account_input_method?: string;
  manual_account_numbers?: string;
  account_numbers_file_path?: string;
  account_contract_mapping?: string;
  contract_file_paths?: string[];
  account_number?: string;
  contract_file_path?: string;
  account_manager_name?: string;
  account_manager_email?: string;
  account_manager_phone?: string;
  premium_service?: string;
  premium_contact_name?: string;
  premium_contact_email?: string;
  premium_contact_phone?: string;
  negotiated_rates_path?: string;
  invoice_method?: string;
  sftp_host_type?: string;
  sftp_hostname?: string;
  sftp_port?: string;
  sftp_username?: string;
  sftp_password?: string;
  sftp_path?: string;
  wms_file?: string;
  wms_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TrackingAPICredentials {
  id: string;
  carrier_config_id: string;
  api_endpoint: string;
  api_username_encrypted: string;
  api_password_encrypted: string;
  api_key_encrypted: string;
  created_at: Date;
}

// In-memory storage
export const customers: Map<string, Customer> = new Map();
export const carrierConfigs: Map<string, CarrierConfig> = new Map();
export const trackingCredentials: Map<string, TrackingAPICredentials> = new Map();

// Helper functions
export function getCustomer(id: string): Customer | undefined {
  return customers.get(id);
}

export function getCarrierConfig(id: string): CarrierConfig | undefined {
  return carrierConfigs.get(id);
}

export function getCarrierConfigByCustomer(customerId: string): CarrierConfig | undefined {
  return Array.from(carrierConfigs.values()).find(
    (config) => config.customer_id === customerId
  );
}
