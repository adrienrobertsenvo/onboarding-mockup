import { useState, FormEvent, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import DragDropMatcher from '../components/DragDropMatcher';
import { getCarrierLogo } from '../utils/carriers';

interface AccountContractsProps {
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  account_input_method: string;
  manual_account_numbers: string;
  account_numbers_file: File | null;
  contract_files: File[];
  account_contract_mapping: Record<string, string>;
}

export default function AccountContracts({ configId, carrierName, onComplete }: AccountContractsProps) {
  const navigate = useNavigate();
  const carrierLogo = getCarrierLogo(carrierName);
  const [formData, setFormData] = useState<FormData>({
    account_input_method: 'Add Manually',
    manual_account_numbers: '',
    account_numbers_file: null,
    contract_files: [],
    account_contract_mapping: {}
  });
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAccountNumbers = (): string[] => {
    if (formData.account_input_method === 'Add Manually') {
      return formData.manual_account_numbers
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    }
    // For uploaded file, we'd parse it - for now just return empty
    // In production, you'd use a library like xlsx or papaparse
    return [];
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        contract_files: [...prev.contract_files, ...newFiles]
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, field: 'contract_files' | 'account_numbers_file') => {
    if (e.target.files) {
      if (field === 'account_numbers_file') {
        setFormData(prev => ({ ...prev, [field]: e.target.files![0] || null }));
      } else {
        const newFiles = Array.from(e.target.files);
        setFormData(prev => ({
          ...prev,
          contract_files: [...prev.contract_files, ...newFiles]
        }));
      }
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contract_files: prev.contract_files.filter((_, i) => i !== index)
    }));
  };

  const handleSkip = () => {
    navigate('/tracking-api');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const accountNumbers = getAccountNumbers();

    if (accountNumbers.length === 0) {
      setError('Please add at least one account number');
      return;
    }

    if (formData.contract_files.length === 0) {
      setError('Please upload at least one contract file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiData: any = {
        account_input_method: formData.account_input_method,
        manual_account_numbers: formData.manual_account_numbers,
        account_contract_mapping: JSON.stringify(formData.account_contract_mapping)
      };

      if (formData.account_numbers_file) {
        apiData.account_numbers_file = formData.account_numbers_file;
      }

      formData.contract_files.forEach((file, index) => {
        apiData[`contract_file_${index}`] = file;
      });

      await apiService.updateCarrierDetails(configId, apiData);
      onComplete();
      navigate('/tracking-api');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save account and contract information');
    } finally {
      setLoading(false);
    }
  };

  const accountNumbers = getAccountNumbers();

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '30%' }}></div>
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
          <h1 className="title" style={{ fontSize: '26px' }}>📦 Account Numbers & Contracts</h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>Connect your carrier accounts and upload all related contracts.</p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '18px', lineHeight: 1.7 }}>
          Add or import your account numbers below and link them to contract files.
          You can assign <strong>multiple contracts to multiple account numbers</strong> — for example,
          one account number might have three contracts.
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Account Number Input Method */}
          <div className="form-group">
            <label className="form-label">How would you like to add your account numbers? *</label>
            <select
              className="form-select"
              value={formData.account_input_method}
              onChange={(e) => setFormData(prev => ({ ...prev, account_input_method: e.target.value }))}
            >
              <option value="Add Manually">Add Manually</option>
              <option value="Upload Spreadsheet (.csv / .xlsx)">Upload Spreadsheet (.csv / .xlsx)</option>
            </select>
          </div>

          {/* Manual Entry */}
          {formData.account_input_method === 'Add Manually' && (
            <div className="form-group">
              <label className="form-label">Enter Account Numbers *</label>
              <textarea
                className="form-textarea"
                value={formData.manual_account_numbers}
                onChange={(e) => setFormData(prev => ({ ...prev, manual_account_numbers: e.target.value }))}
                placeholder="Add one account number per line&#10;Example:&#10;123456789&#10;987654321&#10;555666777"
                rows={6}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem'
                }}
              />
              <span className="form-info">
                Enter one account number per line
              </span>
            </div>
          )}

          {/* Spreadsheet Upload */}
          {formData.account_input_method === 'Upload Spreadsheet (.csv / .xlsx)' && (
            <div className="form-group">
              <label className="form-label">Upload File (.csv or .xlsx) *</label>
              <input
                type="file"
                className="form-file"
                onChange={(e) => handleFileSelect(e, 'account_numbers_file')}
                accept=".csv,.xlsx"
              />
              {formData.account_numbers_file && (
                <span className="form-info">Selected: {formData.account_numbers_file.name}</span>
              )}
              <span className="form-info" style={{ display: 'block', marginTop: '0.5rem' }}>
                The file should have account numbers in the first column
              </span>
            </div>
          )}

          {/* Contract Files - Drag and Drop */}
          <div className="form-group">
            <label className="form-label">Upload Contract Files *</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--gray-300)'}`,
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                background: dragActive ? 'rgba(37, 99, 235, 0.05)' : 'var(--gray-50)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <input
                type="file"
                id="contract-files"
                multiple
                onChange={(e) => handleFileSelect(e, 'contract_files')}
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
              />
              <label htmlFor="contract-files" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                <div style={{ color: 'var(--gray-700)', fontWeight: 600 }}>
                  Drag & drop contract files here
                </div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  or click to browse (PDF, DOC, DOCX)
                </div>
              </label>
            </div>
            {formData.contract_files.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                {formData.contract_files.map((file, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem' }}>📄 {file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: 'transparent',
                        color: 'var(--danger)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.25rem'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drag-Drop Matcher */}
          {accountNumbers.length > 0 && formData.contract_files.length > 0 && (
            <DragDropMatcher
              accountNumbers={accountNumbers}
              contractFiles={formData.contract_files}
              mappings={formData.account_contract_mapping}
              onMappingChange={(mappings) => setFormData(prev => ({ ...prev, account_contract_mapping: mappings }))}
            />
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
              Skip for Now
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
