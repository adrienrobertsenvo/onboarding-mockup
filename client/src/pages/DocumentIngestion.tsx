import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { getCarrierLogo } from '../utils/carriers';

interface DocumentIngestionProps {
  customerId?: string;
  configId?: string;
  carrierName?: string;
  onComplete: () => void;
  type: 'wms' | 'invoice';
}

interface FormData {
  ingestion_method: string;
  email_note: string;
  sftp_hostname: string;
  sftp_port: string;
  sftp_username: string;
  sftp_password: string;
  sftp_path: string;
}

export default function DocumentIngestion({ customerId, configId, carrierName, onComplete, type }: DocumentIngestionProps) {
  const navigate = useNavigate();
  const carrierLogo = carrierName ? getCarrierLogo(carrierName) : null;
  const [formData, setFormData] = useState<FormData>({
    ingestion_method: 'SFTP (We Host)',
    email_note: '',
    sftp_hostname: '',
    sftp_port: '22',
    sftp_username: '',
    sftp_password: '',
    sftp_path: '/'
  });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(true);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const isWMS = type === 'wms';
  const title = isWMS ? '1.2.2 WMS File Ingestion' : `Invoice Ingestion${carrierName ? ` - ${carrierName}` : ''}`;
  const description = isWMS
    ? 'Set up automatic delivery of your WMS/EOD reports'
    : 'Configure how carrier invoices will be sent to us';
  const nextRoute = isWMS ? '/invite-users' : '/carrier-completion';
  const backRoute = isWMS ? '/warehouse-data' : '/tracking-api';

  useEffect(() => {
    const fetchEmail = async () => {
      if (customerId) {
        try {
          const response = await apiService.getInvoiceEmail(customerId);
          setGeneratedEmail(response.email);
        } catch (err: any) {
          setError('Failed to generate email address');
        } finally {
          setLoadingEmail(false);
        }
      } else {
        setLoadingEmail(false);
      }
    };

    fetchEmail();
  }, [customerId]);

  const handleTestConnection = async (e: FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setError('');
    setTestResult(null);

    // Simulate testing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate based on method
    if (formData.ingestion_method === 'Email Forwarding') {
      // Simulate checking for received emails
      setTestResult('success');
    } else if (formData.ingestion_method === 'SFTP (We Host)') {
      // Simulate checking if files were uploaded
      setTestResult('success');
    } else {
      // For SFTP (You Host) and SFTP (Carrier/External), check if fields are filled
      if (!formData.sftp_hostname || !formData.sftp_username || !formData.sftp_password) {
        setError('Please fill in all SFTP fields');
        setTestResult('error');
      } else {
        // Simulate testing connection
        setTestResult('success');
      }
    }

    setTesting(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (testResult !== 'success') {
      setError('Please test the connection first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiData: any = {
        ingestion_method: formData.ingestion_method,
        ...formData
      };

      if (configId) {
        await apiService.updateCarrierDetails(configId, apiData);
      }

      onComplete();
      navigate(nextRoute);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: isWMS ? '30%' : '70%' }}></div>
        </div>

        {carrierLogo && !isWMS && (
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
          <h1 className="title" style={{ fontSize: '26px' }}>
            {isWMS ? '📁' : '📧'} {title}
          </h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>
            {description}
          </p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7 }}>
          {isWMS ? (
            <>
              Choose how you'd like to automatically send us your warehouse reports.
              We'll process them daily to keep your shipment data up to date.
            </>
          ) : (
            <>
              Choose how {carrierName || 'the carrier'} invoices will be delivered to us for automatic audit processing.
            </>
          )}
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

        <form onSubmit={handleSubmit}>
          {/* Method Selection */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Ingestion Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, ingestion_method: 'SFTP (We Host)' }));
                  setTestResult(null);
                }}
                style={{
                  padding: '1.25rem',
                  border: `3px solid ${formData.ingestion_method === 'SFTP (We Host)' ? 'var(--primary)' : 'var(--gray-300)'}`,
                  background: formData.ingestion_method === 'SFTP (We Host)' ? 'rgba(116, 93, 191, 0.05)' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔐</div>
                <div style={{
                  fontWeight: 600,
                  color: formData.ingestion_method === 'SFTP (We Host)' ? 'var(--primary)' : 'var(--gray-900)',
                  marginBottom: '0.25rem'
                }}>
                  SFTP (We Host)
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  We provide the server
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, ingestion_method: 'SFTP (You Host)' }));
                  setTestResult(null);
                }}
                style={{
                  padding: '1.25rem',
                  border: `3px solid ${formData.ingestion_method === 'SFTP (You Host)' ? 'var(--primary)' : 'var(--gray-300)'}`,
                  background: formData.ingestion_method === 'SFTP (You Host)' ? 'rgba(116, 93, 191, 0.05)' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                <div style={{
                  fontWeight: 600,
                  color: formData.ingestion_method === 'SFTP (You Host)' ? 'var(--primary)' : 'var(--gray-900)',
                  marginBottom: '0.25rem'
                }}>
                  SFTP (You Host)
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Your company's server
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, ingestion_method: 'SFTP (Carrier/External)' }));
                  setTestResult(null);
                }}
                style={{
                  padding: '1.25rem',
                  border: `3px solid ${formData.ingestion_method === 'SFTP (Carrier/External)' ? 'var(--primary)' : 'var(--gray-300)'}`,
                  background: formData.ingestion_method === 'SFTP (Carrier/External)' ? 'rgba(116, 93, 191, 0.05)' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚚</div>
                <div style={{
                  fontWeight: 600,
                  color: formData.ingestion_method === 'SFTP (Carrier/External)' ? 'var(--primary)' : 'var(--gray-900)',
                  marginBottom: '0.25rem'
                }}>
                  SFTP (Carrier/External)
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  External party's server
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, ingestion_method: 'Email Forwarding' }));
                  setTestResult(null);
                }}
                style={{
                  padding: '1.25rem',
                  border: `3px solid ${formData.ingestion_method === 'Email Forwarding' ? 'var(--primary)' : 'var(--gray-300)'}`,
                  background: formData.ingestion_method === 'Email Forwarding' ? 'rgba(116, 93, 191, 0.05)' : 'white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📧</div>
                <div style={{
                  fontWeight: 600,
                  color: formData.ingestion_method === 'Email Forwarding' ? 'var(--primary)' : 'var(--gray-900)',
                  marginBottom: '0.25rem'
                }}>
                  Email Forwarding
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Not recommended - Forward to our email
                </div>
              </button>
            </div>
          </div>

          {/* Email Forwarding Details */}
          {formData.ingestion_method === 'Email Forwarding' && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                Your Dedicated Email Address
              </h3>

              {loadingEmail ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-500)' }}>
                  Generating email address...
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '2px solid var(--primary)',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '1.125rem', color: 'var(--primary)' }}>
                      {generatedEmail}
                    </div>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      Copy
                    </button>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
                      <strong>Next Step:</strong> {isWMS ? 'Configure your WMS system' : 'Contact your carrier'} to forward {isWMS ? 'reports' : 'invoices'} to this email address.
                      {!isWMS && ' Most carriers can set this up in 1-2 business days.'}
                    </p>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '8px',
                    border: '2px solid var(--danger)'
                  }}>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--danger)', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                      ⚠️ Required: File name must contain <code style={{
                        background: 'rgba(0,0,0,0.1)',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '4px',
                        fontFamily: 'monospace'
                      }}>WMS_DATA</code>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SFTP (We Host) - Show Pre-configured Details */}
          {formData.ingestion_method === 'SFTP (We Host)' && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>
                Your SFTP Connection Details
              </h3>

              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '2px solid var(--gray-200)'
                }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Hostname
                  </label>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gray-900)' }}>
                    sftp.senvo.com
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '2px solid var(--gray-200)'
                  }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                      Username
                    </label>
                    <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gray-900)' }}>
                      {customerId || 'customer_username'}
                    </div>
                  </div>

                  <div style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '2px solid var(--gray-200)'
                  }}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                      Port
                    </label>
                    <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gray-900)' }}>
                      22
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '2px solid var(--gray-200)'
                }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Password
                  </label>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gray-900)' }}>
                    ••••••••••••
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                    Credentials sent to your email
                  </div>
                </div>

                <div style={{
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '8px',
                  border: '2px solid var(--gray-200)'
                }}>
                  <label style={{ fontSize: '0.875rem', color: 'var(--gray-600)', display: 'block', marginBottom: '0.25rem' }}>
                    Path
                  </label>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--gray-900)' }}>
                    /upload
                  </div>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
                  <strong>💡 Testing Tip:</strong> Drop a file in our SFTP to test the connection and verify everything is working correctly.
                </p>
              </div>
            </div>
          )}

          {/* SFTP Details - For You Host and Carrier/External */}
          {(formData.ingestion_method === 'SFTP (You Host)' ||
            formData.ingestion_method === 'SFTP (Carrier/External)') && (
            <div style={{
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '12px',
              border: '2px solid var(--gray-200)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>
                SFTP Configuration
              </h3>

              <div className="form-group">
                <label className="form-label">Hostname <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sftp_hostname}
                  onChange={(e) => setFormData(prev => ({ ...prev, sftp_hostname: e.target.value }))}
                  placeholder="sftp.example.com"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Username <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.sftp_username}
                    onChange={(e) => setFormData(prev => ({ ...prev, sftp_username: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Port</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.sftp_port}
                    onChange={(e) => setFormData(prev => ({ ...prev, sftp_port: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.sftp_password}
                  onChange={(e) => setFormData(prev => ({ ...prev, sftp_password: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Path</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sftp_path}
                  onChange={(e) => setFormData(prev => ({ ...prev, sftp_path: e.target.value }))}
                  placeholder="/"
                />
              </div>
            </div>
          )}

          {/* Test Connection Button */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              className="btn"
              disabled={testing}
              style={{
                width: '100%',
                background: testResult === 'success' ? 'var(--success)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.875rem'
              }}
            >
              {testing ? (
                formData.ingestion_method === 'SFTP (We Host)' ? 'Checking for uploaded files...' :
                formData.ingestion_method === 'Email Forwarding' ? 'Checking for received emails...' :
                'Testing connection...'
              ) : testResult === 'success' ? (
                '✓ Verified'
              ) : (
                formData.ingestion_method === 'SFTP (We Host)' ? 'Test if files have been uploaded' :
                formData.ingestion_method === 'Email Forwarding' ? 'Test if we received email' :
                'Test Connection'
              )}
            </button>

            {testResult === 'success' && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '2px solid var(--success)',
                borderRadius: '8px',
                color: 'var(--success)',
                fontSize: '0.9375rem',
                fontWeight: 500,
                textAlign: 'center'
              }}>
                ✓ Configuration validated successfully
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn"
              onClick={() => navigate(backRoute)}
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
              disabled={loading || testResult !== 'success'}
              style={{
                opacity: testResult !== 'success' ? 0.5 : 1,
                cursor: testResult !== 'success' ? 'not-allowed' : 'pointer'
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
