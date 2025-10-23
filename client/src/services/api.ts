import type { CustomerInfo, CarrierConfig, TrackingAPI } from '../types';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

// LocalStorage keys
const STORAGE_KEYS = {
  CUSTOMERS: 'senvo_customers',
  CARRIER_CONFIGS: 'senvo_carrier_configs',
  TRACKING_APIS: 'senvo_tracking_apis'
};

// Helper functions for localStorage
const getFromStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveToStorage = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay for realism
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Customer endpoints
  createCustomer: async (data: CustomerInfo) => {
    await delay();
    const customerId = generateId();
    const customer = {
      id: customerId,
      ...data,
      created_at: new Date().toISOString()
    };

    const customers = getFromStorage(STORAGE_KEYS.CUSTOMERS);
    customers.push(customer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);

    return customer;
  },

  // Carrier configuration endpoints
  createCarrierConfig: async (customerId: string, carrier: string) => {
    await delay();
    const configId = generateId();
    const config = {
      id: configId,
      customer_id: customerId,
      selected_carrier: carrier,
      created_at: new Date().toISOString()
    };

    const configs = getFromStorage(STORAGE_KEYS.CARRIER_CONFIGS);
    configs.push(config);
    saveToStorage(STORAGE_KEYS.CARRIER_CONFIGS, configs);

    return config;
  },

  updateCarrierDetails: async (configId: string, data: Partial<CarrierConfig>) => {
    await delay();
    const configs = getFromStorage<any>(STORAGE_KEYS.CARRIER_CONFIGS);
    const index = configs.findIndex((c: any) => c.id === configId);

    if (index !== -1) {
      configs[index] = {
        ...configs[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.CARRIER_CONFIGS, configs);
      return configs[index];
    }

    throw new Error('Configuration not found');
  },

  // Tracking API endpoints
  saveTrackingAPI: async (configId: string, data: TrackingAPI) => {
    await delay();
    const trackingAPI = {
      id: generateId(),
      carrier_config_id: configId,
      ...data,
      created_at: new Date().toISOString()
    };

    const apis = getFromStorage(STORAGE_KEYS.TRACKING_APIS);
    apis.push(trackingAPI);
    saveToStorage(STORAGE_KEYS.TRACKING_APIS, apis);

    return trackingAPI;
  },

  // Invoice email generation
  getInvoiceEmail: async (customerId: string) => {
    await delay(200);
    return {
      email: `invoices+${customerId}@senvo.de`
    };
  },

  // Mark onboarding complete
  completeOnboarding: async (customerId: string) => {
    await delay();
    const customers = getFromStorage<any>(STORAGE_KEYS.CUSTOMERS);
    const index = customers.findIndex((c: any) => c.id === customerId);

    if (index !== -1) {
      customers[index].onboarding_complete = true;
      customers[index].completed_at = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }

    return { success: true };
  },

  // Get customer's carriers
  getCustomerCarriers: async (customerId: string) => {
    await delay(200);
    const configs = getFromStorage<any>(STORAGE_KEYS.CARRIER_CONFIGS);
    return configs.filter((c: any) => c.customer_id === customerId);
  }
};

export default apiService;
