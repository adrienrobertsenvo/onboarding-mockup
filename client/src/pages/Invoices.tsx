import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface InvoicesProps {
  customerId: string;
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

interface FormData {
  invoice_method: string;
  email_note: string;
  sftp_host_type: string;
  sftp_hostname: string;
  sftp_port: string;
  sftp_username: string;
  sftp_password: string;
  sftp_path: string;
}

export default function Invoices({ customerId, configId, carrierName, onComplete }: InvoicesProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    invoice_method: 'Email Forwarding',
    email_note: '',
    sftp_host_type: 'My Company (Self-Hosted)',
    sftp_hostname: '',
    sftp_port: '22',
    sftp_username: '',
    sftp_password: '',
    sftp_path: '/'
  });
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoiceEmail = async () => {
      try {
        const response = await apiService.getInvoiceEmail(customerId);
        setInvoiceEmail(response.email);
      } catch (err: any) {
        setError('Failed to generate invoice email');
      } finally {
        setLoadingEmail(false);
      }
    };

    fetchInvoiceEmail();
  }, [customerId]);

  const handleSkip = () => {
    navigate('/warehouse-data');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await apiService.updateCarrierDetails(configId, formData);
      onComplete();
      navigate('/warehouse-data');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save invoice setup');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generated SFTP credentials for Senvo hosted option
  const senvoSftpUsername = `customer-${customerId}`;
  const senvoSftpPassword = '●●●●●●●● (Auto-generated securely)';

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '70%' }}></div>
        </div>

        <div className="header">
          <h1 className="title" style={{ fontSize: '30px' }}>💌 Invoice Forwarding Setup</h1>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '18px', lineHeight: 1.7 }}>
          This is where you decide how Senvo will receive your carrier invoices.
          Choose one of the two options below.
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Invoice Method Selection */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.9375rem' }}>How would you like to share your invoices?</label>
            <select
              className="form-select"
              value={formData.invoice_method}
              onChange={(e) => setFormData(prev => ({ ...prev, invoice_method: e.target.value }))}
            >
              <option value="Email Forwarding">Email Forwarding</option>
              <option value="SFTP Upload">SFTP Upload</option>
            </select>
          </div>

          {/* Email Forwarding Option */}
          {formData.invoice_method === 'Email Forwarding' && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)', fontSize: '1.125rem', fontWeight: 600 }}>
                📧 Email Forwarding
              </h3>

              <div style={{
                padding: '1.25rem',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid var(--gray-200)',
                marginBottom: '1.25rem'
              }}>
                <p style={{
                  color: 'var(--gray-700)',
                  lineHeight: 1.7,
                  fontSize: '0.9375rem'
                }}>
                  <strong style={{ color: 'var(--gray-900)' }}>Quick & Easy:</strong> Forward invoice emails with PDF or CSV attachments to{' '}
                  <strong style={{ color: 'var(--primary)' }}>report-import@companyname.io</strong> and we'll process them automatically.
                </p>
              </div>
            </div>
          )}

          {/* SFTP Upload Option */}
          {formData.invoice_method === 'SFTP Upload' && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--gray-900)', fontSize: '1.125rem', fontWeight: 600 }}>
                💾 SFTP Upload
              </h3>

              <div className="form-group">
                <label className="form-label">Who will host the SFTP?</label>
                <select
                  className="form-select"
                  value={formData.sftp_host_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, sftp_host_type: e.target.value }))}
                >
                  <option value="My Company (Self-Hosted)">My Company</option>
                  <option value="Senvo Hosted">Senvo</option>
                </select>
              </div>

              {/* Senvo Hosted SFTP */}
              {formData.sftp_host_type === 'Senvo Hosted' && (
                <div style={{
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '2px solid var(--success)'
                }}>
                  <p style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9375rem',
                    marginBottom: '1.25rem',
                    lineHeight: 1.6
                  }}>
                    We'll set up a secure Senvo-hosted SFTP for you automatically. Use these credentials:
                  </p>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Hostname
                      </div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                        sftp.senvo.de
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Port
                      </div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                        22
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Username
                      </div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                        {senvoSftpUsername}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Password
                      </div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                        Auto-generated securely
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                        Path
                      </div>
                      <div style={{ fontFamily: 'monospace', color: 'var(--gray-900)', fontSize: '0.9375rem' }}>
                        / (base directory)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Hosted SFTP */}
              {formData.sftp_host_type === 'My Company (Self-Hosted)' && (
                <div style={{
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-200)'
                }}>

                  <div className="form-group">
                    <label className="form-label">Hostname</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sftp_hostname}
                      onChange={(e) => setFormData(prev => ({ ...prev, sftp_hostname: e.target.value }))}
                      placeholder="ftp.yourcompany.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Port</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sftp_port}
                      onChange={(e) => setFormData(prev => ({ ...prev, sftp_port: e.target.value }))}
                      placeholder="22"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sftp_username}
                      onChange={(e) => setFormData(prev => ({ ...prev, sftp_username: e.target.value }))}
                      placeholder="username"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.sftp_password}
                      onChange={(e) => setFormData(prev => ({ ...prev, sftp_password: e.target.value }))}
                      placeholder="●●●●●●●●"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Path</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sftp_path}
                      onChange={(e) => setFormData(prev => ({ ...prev, sftp_path: e.target.value }))}
                      placeholder="/base/directory"
                    />
                  </div>
                </div>
              )}
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
              disabled={loading || loadingEmail}
            >
              {loading ? 'Saving...' : 'Continue →'}
            </button>
          </div>

          <button
            type="button"
            className="btn"
            onClick={() => navigate('/tracking-api')}
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
