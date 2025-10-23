import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { nanoid } from 'nanoid';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage (for demo purposes)
const customers = new Map();
const carrierConfigs = new Map();
const trackingAPIs = new Map();

// Customer endpoints
app.post('/api/customers', (req, res) => {
  const customerId = nanoid();
  const customer = {
    id: customerId,
    ...req.body,
    created_at: new Date()
  };
  customers.set(customerId, customer);
  res.json(customer);
});

app.get('/api/customers/:id/invoice-email', (req, res) => {
  const customerId = req.params.id;
  const email = `invoices+${customerId}@senvo.de`;
  res.json({ email });
});

app.post('/api/customers/:id/complete', (req, res) => {
  const customerId = req.params.id;
  const customer = customers.get(customerId);
  if (customer) {
    customer.onboarding_complete = true;
    customer.completed_at = new Date();
    customers.set(customerId, customer);
  }
  res.json({ success: true });
});

app.get('/api/customers/:id/carriers', (req, res) => {
  const customerId = req.params.id;
  const customerCarriers = Array.from(carrierConfigs.values())
    .filter(config => config.customer_id === customerId);
  res.json(customerCarriers);
});

// Carrier configuration endpoints
app.post('/api/carrier-config', (req, res) => {
  const configId = nanoid();
  const config = {
    id: configId,
    ...req.body,
    created_at: new Date()
  };
  carrierConfigs.set(configId, config);
  res.json(config);
});

app.put('/api/carrier-config/:id', upload.any(), (req, res) => {
  const configId = req.params.id;
  const existingConfig = carrierConfigs.get(configId);

  if (!existingConfig) {
    return res.status(404).json({ message: 'Configuration not found' });
  }

  const updatedConfig = {
    ...existingConfig,
    ...req.body,
    updated_at: new Date()
  };

  if (req.files) {
    const files = req.files as Express.Multer.File[];
    files.forEach(file => {
      updatedConfig[file.fieldname] = file.originalname;
    });
  }

  carrierConfigs.set(configId, updatedConfig);
  res.json(updatedConfig);
});

// Tracking API endpoints
app.post('/api/carrier-config/:id/tracking-api', (req, res) => {
  const configId = req.params.id;
  const trackingAPI = {
    id: nanoid(),
    carrier_config_id: configId,
    ...req.body,
    created_at: new Date()
  };
  trackingAPIs.set(trackingAPI.id, trackingAPI);
  res.json(trackingAPI);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Vercel serverless function handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
