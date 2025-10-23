import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage (for demo purposes)
const customers = new Map();
const carrierConfigs = new Map();
const trackingAPIs = new Map();

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '';

  // Health check
  if (path === '/health' && method === 'GET') {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Customer endpoints
  if (path === '/customers' && method === 'POST') {
    const customerId = generateId();
    const customer = {
      id: customerId,
      ...req.body,
      created_at: new Date()
    };
    customers.set(customerId, customer);
    return res.json(customer);
  }

  if (path.startsWith('/customers/') && path.endsWith('/invoice-email') && method === 'GET') {
    const customerId = path.split('/')[2];
    const email = `invoices+${customerId}@senvo.de`;
    return res.json({ email });
  }

  if (path.startsWith('/customers/') && path.endsWith('/complete') && method === 'POST') {
    const customerId = path.split('/')[2];
    const customer = customers.get(customerId);
    if (customer) {
      customer.onboarding_complete = true;
      customer.completed_at = new Date();
      customers.set(customerId, customer);
    }
    return res.json({ success: true });
  }

  if (path.startsWith('/customers/') && path.endsWith('/carriers') && method === 'GET') {
    const customerId = path.split('/')[2];
    const customerCarriers = Array.from(carrierConfigs.values())
      .filter((config: any) => config.customer_id === customerId);
    return res.json(customerCarriers);
  }

  // Carrier configuration endpoints
  if (path === '/carrier-config' && method === 'POST') {
    const configId = generateId();
    const config = {
      id: configId,
      ...req.body,
      created_at: new Date()
    };
    carrierConfigs.set(configId, config);
    return res.json(config);
  }

  if (path.startsWith('/carrier-config/') && method === 'PUT') {
    const pathParts = path.split('/');
    const configId = pathParts[2];
    const existingConfig = carrierConfigs.get(configId);

    if (!existingConfig) {
      return res.status(404).json({ message: 'Configuration not found' });
    }

    const updatedConfig = {
      ...existingConfig,
      ...req.body,
      updated_at: new Date()
    };

    carrierConfigs.set(configId, updatedConfig);
    return res.json(updatedConfig);
  }

  // Tracking API endpoints
  if (path.includes('/tracking-api') && method === 'POST') {
    const configId = path.split('/')[2];
    const trackingAPI = {
      id: generateId(),
      carrier_config_id: configId,
      ...req.body,
      created_at: new Date()
    };
    trackingAPIs.set(trackingAPI.id, trackingAPI);
    return res.json(trackingAPI);
  }

  // Not found
  return res.status(404).json({ error: 'Not found', path, method });
}
