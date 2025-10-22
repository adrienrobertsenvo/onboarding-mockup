import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface CarrierDetailsProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  account_number: string;
  contract_file: File | null;
  account_manager_name: string;
  account_manager_email: string;
  account_manager_phone: string;
  premium_service: string;
  premium_contact_name: string;
  premium_contact_email: string;
  premium_contact_phone: string;
  negotiated_rates: File | null;
}

export default function CarrierDetails({ configId, carrierName, onComplete }: CarrierDetailsProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    account_number: '',
    contract_file: null,
    account_manager_name: '',
    account_manager_email: '',
    account_manager_phone: '',
    premium_service: 'No',
    premium_contact_name: '',
    premium_contact_email: '',
    premium_contact_phone: '',
    negotiated_rates: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'contract_file' | 'negotiated_rates', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.account_number || !formData.contract_file) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiService.updateCarrierDetails(configId, formData);
      onComplete();
      navigate('/tracking-api');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save carrier details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '40%' }}></div>
        </div>

        <div className="header">
          <h1 className="title">Add Your Carrier Details</h1>
          <p className="subtitle">{carrierName} Account Information</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Account Number *</label>
            <input
              type="text"
              className="form-input"
              value={formData.account_number}
              onChange={(e) => handleChange('account_number', e.target.value)}
              required
              placeholder="Enter your carrier account number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Contract *</label>
            <input
              type="file"
              className="form-file"
              onChange={(e) => handleFileChange('contract_file', e)}
              accept=".pdf,.doc,.docx"
              required
            />
            {formData.contract_file && (
              <span className="form-info">Selected: {formData.contract_file.name}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Account Manager Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.account_manager_name}
              onChange={(e) => handleChange('account_manager_name', e.target.value)}
              placeholder="John Smith"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Manager Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.account_manager_email}
              onChange={(e) => handleChange('account_manager_email', e.target.value)}
              placeholder="john.smith@carrier.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Manager Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.account_manager_phone}
              onChange={(e) => handleChange('account_manager_phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Premium Customer Service?</label>
            <select
              className="form-select"
              value={formData.premium_service}
              onChange={(e) => handleChange('premium_service', e.target.value)}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {formData.premium_service === 'Yes' && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              border: '2px solid var(--gray-200)',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)', fontSize: '1rem' }}>
                Premium Service Contact Details
              </h3>

              <div className="form-group">
                <label className="form-label">Premium Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.premium_contact_name}
                  onChange={(e) => handleChange('premium_contact_name', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Premium Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.premium_contact_email}
                  onChange={(e) => handleChange('premium_contact_email', e.target.value)}
                  placeholder="jane.doe@carrier.com"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Premium Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.premium_contact_phone}
                  onChange={(e) => handleChange('premium_contact_phone', e.target.value)}
                  placeholder="+1 (555) 987-6543"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Negotiated Rates (Upload)</label>
            <input
              type="file"
              className="form-file"
              onChange={(e) => handleFileChange('negotiated_rates', e)}
              accept=".pdf,.xls,.xlsx,.csv"
            />
            {formData.negotiated_rates && (
              <span className="form-info">Selected: {formData.negotiated_rates.name}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>

          <button
            type="button"
            className="btn"
            onClick={() => navigate('/carrier-selection')}
            style={{
              marginTop: '1rem',
              background: 'transparent',
              color: 'var(--gray-600)',
              border: '2px solid var(--gray-300)'
            }}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );
}
