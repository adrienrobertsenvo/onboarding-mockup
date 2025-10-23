import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { getCarrierLogo } from '../utils/carriers';

interface TrackingAPIProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  api_endpoint: string;
  api_username: string;
  api_password: string;
  api_key: string;
  api_documentation_file: File | null;
  api_notes: string;
}

export default function TrackingAPIPage({ configId, carrierName, onComplete }: TrackingAPIProps) {
  const navigate = useNavigate();
  const carrierLogo = getCarrierLogo(carrierName);
  const [formData, setFormData] = useState<FormData>({
    api_endpoint: '',
    api_username: '',
    api_password: '',
    api_key: '',
    api_documentation_file: null,
    api_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, api_documentation_file: file }));
  };

  const handleSkip = () => {
    navigate('/invoices');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.saveTrackingAPI(configId, formData);
      onComplete();
      navigate('/invoices');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save tracking API credentials');
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.api_endpoint && formData.api_username &&
                  formData.api_password && formData.api_key;

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '60%' }}></div>
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
          <h1 className="title" style={{ fontSize: '26px' }}>🔑 Tracking API Credentials</h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>Connect your tracking data — or skip for now.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">API Endpoint URL</label>
            <input
              type="url"
              className="form-input"
              value={formData.api_endpoint}
              onChange={(e) => handleChange('api_endpoint', e.target.value)}
              placeholder="https://api.carrier.com/v1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">API Username</label>
            <input
              type="text"
              className="form-input"
              value={formData.api_username}
              onChange={(e) => handleChange('api_username', e.target.value)}
              placeholder="api_user_12345"
            />
          </div>

          <div className="form-group">
            <label className="form-label">API Password</label>
            <input
              type="password"
              className="form-input"
              value={formData.api_password}
              onChange={(e) => handleChange('api_password', e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="text"
              className="form-input"
              value={formData.api_key}
              onChange={(e) => handleChange('api_key', e.target.value)}
              placeholder="sk_live_xxxxxxxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Documentation (Optional)</label>
            <input
              type="file"
              className="form-file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
            {formData.api_documentation_file && (
              <span className="form-info">Selected: {formData.api_documentation_file.name}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              value={formData.api_notes}
              onChange={(e) => handleChange('api_notes', e.target.value)}
              placeholder="Add any helpful details or context for your API configuration"
              rows={4}
            />
          </div>

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
              {loading ? 'Saving securely...' : 'Continue →'}
            </button>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => navigate('/carrier-contacts')}
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
