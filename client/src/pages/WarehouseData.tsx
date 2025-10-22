import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface WarehouseDataProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  wms_file: File | null;
  wms_notes: string;
}

export default function WarehouseData({ configId, carrierName, onComplete }: WarehouseDataProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    wms_file: null,
    wms_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, wms_file: e.target.files![0] }));
    }
  };

  const handleSkip = () => {
    navigate('/completion');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const apiData: any = {
        wms_notes: formData.wms_notes
      };

      if (formData.wms_file) {
        apiData.wms_file = formData.wms_file;
      }

      await apiService.updateCarrierDetails(configId, apiData);
      onComplete();
      navigate('/completion');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save warehouse data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '85%' }}></div>
        </div>

        <div className="header">
          <h1 className="title" style={{ fontSize: '26px' }}>🏭 Warehouse Management or End-of-Day Report</h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>Upload a sample file or skip for now.</p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '18px', lineHeight: 1.7 }}>
          This helps us match your shipment data to invoices and detect discrepancies.
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">Upload Report</label>
            <input
              type="file"
              className="form-file"
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls,.pdf"
            />
            {formData.wms_file && (
              <span className="form-info" style={{ marginTop: '0.5rem', display: 'block' }}>
                Selected: {formData.wms_file.name}
              </span>
            )}
          </div>

          {/* Frequency Notes */}
          <div className="form-group">
            <label className="form-label">How often do you plan to send this report?</label>
            <textarea
              className="form-textarea"
              value={formData.wms_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, wms_notes: e.target.value }))}
              placeholder="e.g., Daily, Weekly, Monthly"
              rows={3}
            />
          </div>

          {/* Guidelines Box */}
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            borderRadius: '12px',
            border: '2px solid var(--gray-200)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              marginBottom: '1rem',
              color: 'var(--gray-900)',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              Recommended Fields
            </h3>
            <div style={{ color: 'var(--gray-700)', lineHeight: 1.7 }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--gray-900)' }}>Required:</strong>
              </div>
              <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Carrier</li>
                <li>Shipment Number (Tracking / Waybill)</li>
                <li>Shipment Date</li>
              </ul>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: 'var(--gray-900)' }}>Additional fields for better audits:</strong>
              </div>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Commercial Value</li>
                <li>Weight</li>
                <li>Dimensions</li>
              </ul>
            </div>
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
              {loading ? 'Saving...' : 'Finish Setup'}
            </button>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => navigate('/invoices')}
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
