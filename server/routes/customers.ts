import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { customers, carrierConfigs, type Customer } from '../models/database.js';
import { generateInvoiceEmail } from '../utils/email.js';

const router = Router();

// Create customer
router.post('/', (req: Request, res: Response) => {
  try {
    const { customer_name, customer_email, customer_phone } = req.body;

    if (!customer_name) {
      return res.status(400).json({ message: 'Missing required field: customer_name' });
    }

    const id = nanoid();
    const invoice_email = generateInvoiceEmail(id);

    const customer: Customer = {
      id,
      customer_name,
      customer_email,
      customer_phone,
      invoice_email,
      onboarding_completed: false,
      created_at: new Date()
    };

    customers.set(id, customer);

    res.status(201).json({ id, invoice_email });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
});

// Get invoice email
router.get('/:id/invoice-email', (req: Request, res: Response) => {
  try {
    const customer = customers.get(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ email: customer.invoice_email });
  } catch (error) {
    console.error('Error fetching invoice email:', error);
    res.status(500).json({ message: 'Failed to fetch invoice email' });
  }
});

// Complete onboarding
router.post('/:id/complete', (req: Request, res: Response) => {
  try {
    const customer = customers.get(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.onboarding_completed = true;
    customers.set(req.params.id, customer);

    res.json({ message: 'Onboarding completed successfully' });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
});

// Get customer's carriers
router.get('/:id/carriers', (req: Request, res: Response) => {
  try {
    const customer = customers.get(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Get all carrier configs for this customer
    const customerCarriers = Array.from(carrierConfigs.values())
      .filter(config => config.customer_id === req.params.id);

    res.json({ carriers: customerCarriers });
  } catch (error) {
    console.error('Error fetching carriers:', error);
    res.status(500).json({ message: 'Failed to fetch carriers' });
  }
});

export default router;
