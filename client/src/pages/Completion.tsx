import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface CompletionProps {
  customerId?: string;
  configId?: string;
}

interface CarrierConfig {
  id: string;
  selected_carrier: string;
  account_contract_mapping?: string;
  account_manager_name?: string;
  api_key?: string;
  invoice_method?: string;
  wms_file?: string;
}

export default function Completion({ customerId, configId }: CompletionProps) {
  const navigate = useNavigate();
  const [carrierConfig, setCarrierConfig] = useState<CarrierConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarrierConfig = async () => {
      if (customerId && configId) {
        try {
          const response = await apiService.getCustomerCarriers(customerId);
          const config = response.carriers.find((c: CarrierConfig) => c.id === configId);
          if (config) {
            setCarrierConfig(config);
          }
        } catch (err) {
          console.error('Failed to load carrier config:', err);
        }
      }
      setLoading(false);
    };

    loadCarrierConfig();
  }, [customerId, configId]);

  const checklistItems = [
    {
      label: 'Account Numbers & Contracts',
      completed: !!carrierConfig?.account_contract_mapping,
      field: 'account_contract_mapping'
    },
    {
      label: 'Account Manager Contact Information',
      completed: !!carrierConfig?.account_manager_name,
      field: 'account_manager_name'
    },
    {
      label: 'Tracking API Key',
      completed: !!carrierConfig?.api_key,
      field: 'api_key'
    },
    {
      label: 'Invoice Method Selected',
      completed: !!carrierConfig?.invoice_method,
      field: 'invoice_method'
    },
    {
      label: 'WMS Report Uploaded',
      completed: !!carrierConfig?.wms_file,
      field: 'wms_file'
    }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '100%' }}></div>
        </div>

        <div style={{
          fontSize: '4rem',
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          🎉
        </div>

        <div className="header">
          <h1 className="title">Congratulations!</h1>
          <p className="subtitle">Your carrier setup is complete</p>
        </div>

        <div className="description" style={{ textAlign: 'center', lineHeight: 1.8, marginBottom: '2rem' }}>
          Now that you've added your carriers, it's our turn to connect them and start auditing.
          We'll automatically identify overcharges and help you recover every cent.
        </div>

        {/* Setup Progress Checklist */}
        {!loading && carrierConfig && (
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--gray-50)',
            borderRadius: '12px',
            border: '2px solid var(--gray-200)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                color: 'var(--gray-900)',
                fontSize: '1.125rem',
                fontWeight: 600
              }}>
                Setup Progress Overview
              </h3>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: completionPercentage === 100 ? 'var(--success)' : 'var(--primary)',
                color: 'white',
                borderRadius: '16px',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {completedCount}/{totalCount} Complete
              </span>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {checklistItems.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: `2px solid ${item.completed ? 'var(--success)' : 'var(--gray-200)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: item.completed ? 'var(--success)' : 'var(--gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.75rem',
                    flexShrink: 0
                  }}>
                    {item.completed && (
                      <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>✓</span>
                    )}
                  </div>
                  <span style={{
                    color: item.completed ? 'var(--gray-900)' : 'var(--gray-600)',
                    fontWeight: item.completed ? 600 : 400,
                    fontSize: '0.9375rem'
                  }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Next Section */}
        <div style={{
          marginBottom: '2.5rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderRadius: '16px',
          border: '2px solid var(--gray-200)'
        }}>
          <h3 style={{
            marginBottom: '1.5rem',
            color: 'var(--gray-900)',
            fontSize: '1.25rem',
            textAlign: 'center'
          }}>
            What's Next?
          </h3>
          <div style={{
            display: 'grid',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📧</span>
              <div>
                <strong style={{ color: 'var(--gray-900)' }}>Start forwarding your carrier invoices</strong>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Send invoices to the email address we provided
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚙️</span>
              <div>
                <strong style={{ color: 'var(--gray-900)' }}>We'll process them automatically</strong>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Our system audits every shipment for overcharges
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📊</span>
              <div>
                <strong style={{ color: 'var(--gray-900)' }}>Review your audit reports</strong>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Check your dashboard for detailed insights
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <div>
                <strong style={{ color: 'var(--gray-900)' }}>Start saving money</strong>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  Recover overcharges on every shipment
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            className="btn"
            onClick={() => navigate('/carrier-selection')}
            style={{
              background: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)'
            }}
          >
            + Add Another Carrier
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
