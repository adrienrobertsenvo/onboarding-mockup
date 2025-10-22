import axios from 'axios';
import type { CustomerInfo, CarrierConfig, TrackingAPI } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  // Customer endpoints
  createCustomer: async (data: CustomerInfo) => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  // Carrier configuration endpoints
  createCarrierConfig: async (customerId: string, carrier: string) => {
    const response = await api.post('/carrier-config', {
      customer_id: customerId,
      selected_carrier: carrier
    });
    return response.data;
  },

  updateCarrierDetails: async (configId: string, data: Partial<CarrierConfig>) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put(`/carrier-config/${configId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Tracking API endpoints
  saveTrackingAPI: async (configId: string, data: TrackingAPI) => {
    const response = await api.post(`/carrier-config/${configId}/tracking-api`, data);
    return response.data;
  },

  // Invoice email generation
  getInvoiceEmail: async (customerId: string) => {
    const response = await api.get(`/customers/${customerId}/invoice-email`);
    return response.data;
  },

  // Mark onboarding complete
  completeOnboarding: async (customerId: string) => {
    const response = await api.post(`/customers/${customerId}/complete`);
    return response.data;
  },

  // Get customer's carriers
  getCustomerCarriers: async (customerId: string) => {
    const response = await api.get(`/customers/${customerId}/carriers`);
    return response.data;
  }
};

export default apiService;
