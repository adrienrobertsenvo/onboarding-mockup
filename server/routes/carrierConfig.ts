import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { carrierConfigs, trackingCredentials, type CarrierConfig, type TrackingAPICredentials } from '../models/database.js';
import { upload } from '../middleware/upload.js';
import { encrypt } from '../utils/crypto.js';

const router = Router();

// Create carrier config
router.post('/', (req: Request, res: Response) => {
  try {
    const { customer_id, selected_carrier } = req.body;

    if (!customer_id || !selected_carrier) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = nanoid();

    const config: CarrierConfig = {
      id,
      customer_id,
      selected_carrier,
      premium_service: 'No',
      created_at: new Date(),
      updated_at: new Date()
    };

    carrierConfigs.set(id, config);

    res.status(201).json({ id });
  } catch (error) {
    console.error('Error creating carrier config:', error);
    res.status(500).json({ message: 'Failed to create carrier config' });
  }
});

// Update carrier details
router.put('/:id', upload.any(), (req: Request, res: Response) => {
  try {
    const config = carrierConfigs.get(req.params.id);

    if (!config) {
      return res.status(404).json({ message: 'Carrier config not found' });
    }

    const files = req.files as Express.Multer.File[];

    // Update fields
    if (req.body.account_input_method) config.account_input_method = req.body.account_input_method;
    if (req.body.manual_account_numbers) config.manual_account_numbers = req.body.manual_account_numbers;
    if (req.body.account_contract_mapping) config.account_contract_mapping = req.body.account_contract_mapping;
    if (req.body.account_manager_name) config.account_manager_name = req.body.account_manager_name;
    if (req.body.account_manager_email) config.account_manager_email = req.body.account_manager_email;
    if (req.body.account_manager_phone) config.account_manager_phone = req.body.account_manager_phone;
    if (req.body.premium_service) config.premium_service = req.body.premium_service;
    if (req.body.premium_contact_name) config.premium_contact_name = req.body.premium_contact_name;
    if (req.body.premium_contact_email) config.premium_contact_email = req.body.premium_contact_email;
    if (req.body.premium_contact_phone) config.premium_contact_phone = req.body.premium_contact_phone;
    if (req.body.invoice_method) config.invoice_method = req.body.invoice_method;
    if (req.body.sftp_host_type) config.sftp_host_type = req.body.sftp_host_type;
    if (req.body.sftp_hostname) config.sftp_hostname = req.body.sftp_hostname;
    if (req.body.sftp_port) config.sftp_port = req.body.sftp_port;
    if (req.body.sftp_username) config.sftp_username = req.body.sftp_username;
    if (req.body.sftp_password) config.sftp_password = req.body.sftp_password;
    if (req.body.sftp_path) config.sftp_path = req.body.sftp_path;
    if (req.body.wms_notes) config.wms_notes = req.body.wms_notes;

    // Handle file uploads
    if (files && files.length > 0) {
      const contractFiles: string[] = [];
      let accountNumbersFile: string | undefined;

      files.forEach(file => {
        if (file.fieldname === 'account_numbers_file') {
          accountNumbersFile = file.path;
        } else if (file.fieldname.startsWith('contract_file_')) {
          contractFiles.push(file.path);
        } else if (file.fieldname === 'contract_file') {
          contractFiles.push(file.path);
        } else if (file.fieldname === 'negotiated_rates') {
          config.negotiated_rates_path = file.path;
        } else if (file.fieldname === 'wms_file') {
          config.wms_file = file.path;
        }
      });

      if (accountNumbersFile) {
        config.account_numbers_file_path = accountNumbersFile;
      }
      if (contractFiles.length > 0) {
        config.contract_file_paths = contractFiles;
      }
    }

    config.updated_at = new Date();
    carrierConfigs.set(req.params.id, config);

    res.json({ message: 'Carrier details updated successfully' });
  } catch (error) {
    console.error('Error updating carrier details:', error);
    res.status(500).json({ message: 'Failed to update carrier details' });
  }
});

// Save tracking API credentials (encrypted)
router.post('/:id/tracking-api', (req: Request, res: Response) => {
  try {
    const config = carrierConfigs.get(req.params.id);

    if (!config) {
      return res.status(404).json({ message: 'Carrier config not found' });
    }

    const { api_endpoint, api_username, api_password, api_key } = req.body;

    if (!api_endpoint || !api_username || !api_password || !api_key) {
      return res.status(400).json({ message: 'Missing required API credentials' });
    }

    // Encrypt sensitive data
    const credentials: TrackingAPICredentials = {
      id: nanoid(),
      carrier_config_id: req.params.id,
      api_endpoint,
      api_username_encrypted: encrypt(api_username),
      api_password_encrypted: encrypt(api_password),
      api_key_encrypted: encrypt(api_key),
      created_at: new Date()
    };

    trackingCredentials.set(credentials.id, credentials);

    res.json({ message: 'Tracking API credentials saved securely' });
  } catch (error) {
    console.error('Error saving tracking API:', error);
    res.status(500).json({ message: 'Failed to save tracking API credentials' });
  }
});

export default router;
