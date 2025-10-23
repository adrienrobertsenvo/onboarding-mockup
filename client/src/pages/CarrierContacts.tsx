import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { getCarrierLogo } from '../utils/carriers';

interface CarrierContactsProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  account_manager_name: string;
  account_manager_email: string;
  account_manager_phone: string;
  premium_service: string;
  premium_contact_name: string;
  premium_contact_email: string;
  premium_contact_phone: string;
}

export default function CarrierContacts({ configId, carrierName, onComplete }: CarrierContactsProps) {
  const navigate = useNavigate();
  const carrierLogo = getCarrierLogo(carrierName);
  const [formData, setFormData] = useState<FormData>({
    account_manager_name: '',
    account_manager_email: '',
    account_manager_phone: '',
    premium_service: 'Yes',
    premium_contact_name: '',
    premium_contact_email: '',
    premium_contact_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkip = () => {
    navigate('/account-contracts');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.updateCarrierDetails(configId, formData);
      onComplete();
      navigate('/account-contracts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save carrier contact information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '50%' }}></div>
        </div>

        {carrierLogo && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <img
              src={carrierLogo}
              alt={carrierName}
              style={{
                height: '60px',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        <div className="header">
          <h1 className="title" style={{ fontSize: '26px' }}>👋 Let's Meet Your Carrier Contact</h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>Start by telling us who handles your carrier relationship.</p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '18px', lineHeight: 1.7 }}>
          This helps us reach the right person if we need to clarify invoice or tracking details.
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              <option value="Yes">Yes</option>
              <option value="No">No</option>
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
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)', fontSize: '1rem', fontWeight: 600 }}>
                Premium Support Contact
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button
              type="button"
              className="btn"
              onClick={handleSkip}
              style={{
                background: 'transparent',
                color: 'var(--gray-600)',
                border: '2px solid var(--gray-300)'
              }}
            >
              Skip This Step
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue →'}
            </button>
          </div>

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
