import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface WarehouseDataProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FieldMapping {
  [requiredField: string]: string; // Maps required field to CSV column
}

const REQUIRED_FIELDS = [
  { id: 'carrier', label: 'Carrier', description: 'Shipping carrier name' },
  { id: 'tracking_number', label: 'Shipment Number', description: 'Tracking/Waybill number' },
  { id: 'shipment_date', label: 'Shipment Date', description: 'Date the shipment was created' }
];

const OPTIONAL_FIELDS = [
  { id: 'commercial_value', label: 'Commercial Value', description: 'Declared value of shipment' },
  { id: 'weight', label: 'Weight', description: 'Package weight' },
  { id: 'dimensions', label: 'Dimensions', description: 'Package dimensions' }
];

export default function WarehouseData({ configId, carrierName, onComplete }: WarehouseDataProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(true);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError('');

      // Parse CSV headers
      if (selectedFile.name.endsWith('.csv')) {
        try {
          const text = await selectedFile.text();
          const lines = text.split('\n');
          if (lines.length > 0) {
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            setCsvHeaders(headers);

            // Auto-map fields with similar names
            const autoMapping: FieldMapping = {};
            REQUIRED_FIELDS.forEach(field => {
              const matchingHeader = headers.find(h =>
                h.toLowerCase().includes(field.id.replace('_', ' ')) ||
                h.toLowerCase().includes(field.label.toLowerCase())
              );
              if (matchingHeader) {
                autoMapping[field.id] = matchingHeader;
              }
            });
            setFieldMapping(autoMapping);
          }
        } catch (err) {
          setError('Failed to parse CSV file');
        }
      }
    }
  };

  const handleMappingChange = (fieldId: string, csvColumn: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [fieldId]: csvColumn
    }));
  };

  const allRequiredFieldsMapped = () => {
    return REQUIRED_FIELDS.every(field =>
      fieldMapping[field.id] && fieldMapping[field.id] !== ''
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a CSV file');
      return;
    }

    if (!allRequiredFieldsMapped()) {
      setError('Please map all required fields before continuing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // If we have a configId, update carrier details
      // Otherwise, just proceed (this is customer setup, not carrier-specific)
      if (configId) {
        const apiData: any = {
          wms_file: file,
          field_mapping: fieldMapping
        };
        await apiService.updateCarrierDetails(configId, apiData);
      }

      onComplete();
      navigate('/wms-file-ingestion');
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
          <div className="progress-fill" style={{ width: '25%' }}></div>
        </div>

        <div className="header">
          <h1 className="title" style={{ fontSize: '26px' }}>🏭 WMS / End-of-Day Report</h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>
            Upload your warehouse management system report
          </p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7 }}>
          This helps us match your shipment data to carrier invoices and automatically detect billing discrepancies.
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid var(--danger)',
            borderRadius: '8px',
            color: 'var(--danger)',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}

        {/* Tutorial Info Box */}
        {showTutorial && (
          <div style={{
            padding: '1.5rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '12px',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTutorial(false)}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: 'var(--gray-500)'
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
              <div style={{ fontSize: '2rem' }}>💡</div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', color: 'rgb(59, 130, 246)', fontSize: '1rem', fontWeight: 600 }}>
                  How Field Mapping Works
                </h3>
                <p style={{ color: 'var(--gray-700)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                  Once you upload your CSV file, we'll show you the column headers. Simply match our required fields to your CSV columns using the dropdowns below.
                </p>
                <p style={{ color: 'var(--gray-700)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                  We'll try to auto-match fields with similar names to save you time!
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Upload */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">
              Upload CSV File <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="file"
              className="form-file"
              onChange={handleFileSelect}
              accept=".csv"
              required
            />
            {file && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--gray-50)',
                borderRadius: '8px',
                border: '2px solid var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>📄</span>
                <span style={{ color: 'var(--gray-700)', fontWeight: 500 }}>{file.name}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                  {csvHeaders.length} columns detected
                </span>
              </div>
            )}
          </div>

          {/* Field Mapping Section */}
          {csvHeaders.length > 0 && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{
                  color: 'var(--gray-900)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  margin: 0
                }}>
                  Field Mapping
                </h3>
                {allRequiredFieldsMapped() && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--success)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}>
                    <span>✓</span>
                    All required fields mapped
                  </div>
                )}
              </div>

              {/* Required Fields */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--gray-700)',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Required Fields
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {REQUIRED_FIELDS.map(field => (
                    <div key={field.id} style={{
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: `2px solid ${fieldMapping[field.id] ? 'var(--success)' : 'var(--gray-300)'}`
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                          {field.label} <span style={{ color: 'var(--danger)' }}>*</span>
                        </label>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                          {field.description}
                        </p>
                      </div>
                      <select
                        className="form-select"
                        value={fieldMapping[field.id] || ''}
                        onChange={(e) => handleMappingChange(field.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: '6px',
                          border: '2px solid var(--gray-300)',
                          fontSize: '0.9375rem'
                        }}
                      >
                        <option value="">-- Select CSV Column --</option>
                        {csvHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--gray-700)',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Optional Fields (Recommended)
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {OPTIONAL_FIELDS.map(field => (
                    <div key={field.id} style={{
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '2px solid var(--gray-200)'
                    }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                          {field.label}
                        </label>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                          {field.description}
                        </p>
                      </div>
                      <select
                        className="form-select"
                        value={fieldMapping[field.id] || ''}
                        onChange={(e) => handleMappingChange(field.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.625rem',
                          borderRadius: '6px',
                          border: '2px solid var(--gray-300)',
                          fontSize: '0.9375rem'
                        }}
                      >
                        <option value="">-- Select CSV Column --</option>
                        {csvHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/shared-email')}
              style={{
                background: 'transparent',
                color: 'var(--gray-600)',
                border: '2px solid var(--gray-300)'
              }}
            >
              ← Back
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !file || !allRequiredFieldsMapped()}
              style={{
                opacity: (!file || !allRequiredFieldsMapped()) ? 0.5 : 1,
                cursor: (!file || !allRequiredFieldsMapped()) ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving...' : 'Continue →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
