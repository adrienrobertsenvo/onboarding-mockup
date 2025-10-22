import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import type { CarrierConfig } from '../types';

interface DashboardProps {
  customerId?: string;
  customerName?: string;
  onAddCarrier: () => void;
}

export default function Dashboard({ customerId, customerName, onAddCarrier }: DashboardProps) {
  const navigate = useNavigate();
  const [carriers, setCarriers] = useState<CarrierConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadCarriers();
    }
  }, [customerId]);

  const loadCarriers = async () => {
    try {
      const response = await apiService.getCustomerCarriers(customerId!);
      setCarriers(response.carriers || []);
    } catch (error) {
      console.error('Failed to load carriers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    onAddCarrier();
    navigate('/carrier-selection');
  };

  if (!customerId) {
    return (
      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">Welcome to Senvo</h1>
            <p className="subtitle">Please start the onboarding process</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Start Onboarding →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Your Connected Carriers</h1>
          {customerName && <p className="subtitle">Welcome back, {customerName}!</p>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-600)' }}>
            Loading your carriers...
          </div>
        ) : carriers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-900)' }}>
              No carriers connected yet
            </h3>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
              Get started by connecting your first carrier
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '2rem' }}>
            {carriers.map((carrier, index) => {
              const checklistItems = [
                { label: 'Account Numbers & Contracts', completed: !!carrier.account_contract_mapping },
                { label: 'Account Manager Contact Info', completed: !!carrier.account_manager_name },
                { label: 'Tracking API Key', completed: !!carrier.api_key },
                { label: 'Invoice Setup', completed: !!carrier.invoice_method },
                { label: 'WMS Upload', completed: !!carrier.wms_file }
              ];

              const completedCount = checklistItems.filter(item => item.completed).length;
              const totalCount = checklistItems.length;
              const [expanded, setExpanded] = useState(false);

              return (
                <div
                  key={carrier.id || index}
                  style={{
                    padding: '1.5rem',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: expanded ? '1rem' : 0
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: 'var(--gray-900)',
                        marginBottom: '0.5rem'
                      }}>
                        {carrier.selected_carrier}
                      </h3>
                      {carrier.account_number && (
                        <p style={{
                          color: 'var(--gray-600)',
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem'
                        }}>
                          Account: {carrier.account_number}
                        </p>
                      )}
                      {carrier.premium_service === 'Yes' && (
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          marginTop: '0.5rem'
                        }}>
                          ⭐ Premium Service
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: completedCount === totalCount ? 'var(--success)' : 'var(--primary)',
                        color: 'white',
                        borderRadius: '16px',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        {completedCount}/{totalCount}
                      </span>
                      <button
                        onClick={() => setExpanded(!expanded)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          color: 'var(--gray-600)',
                          fontSize: '1.25rem',
                          transition: 'transform 0.2s',
                          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div style={{
                      padding: '1rem',
                      background: 'var(--gray-50)',
                      borderRadius: '8px',
                      marginTop: '1rem'
                    }}>
                      <h4 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--gray-700)',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Setup Checklist
                      </h4>
                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {checklistItems.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.5rem',
                              background: 'white',
                              borderRadius: '6px',
                              border: `1px solid ${item.completed ? 'var(--success)' : 'var(--gray-200)'}`
                            }}
                          >
                            <div style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: item.completed ? 'var(--success)' : 'var(--gray-200)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '0.5rem',
                              flexShrink: 0
                            }}>
                              {item.completed && (
                                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>✓</span>
                              )}
                            </div>
                            <span style={{
                              color: item.completed ? 'var(--gray-900)' : 'var(--gray-600)',
                              fontSize: '0.875rem',
                              fontWeight: item.completed ? 500 : 400
                            }}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleAddAnother}
        >
          + Add Another Carrier
        </button>

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--gray-50)',
          borderRadius: '12px',
          border: '2px solid var(--gray-200)'
        }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-900)', fontSize: '1rem' }}>
            📊 What's Next?
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: 'var(--gray-600)',
            fontSize: '0.9rem'
          }}>
            <li style={{ padding: '0.5rem 0' }}>
              • Start forwarding invoices to your designated email
            </li>
            <li style={{ padding: '0.5rem 0' }}>
              • We'll automatically process and audit your shipments
            </li>
            <li style={{ padding: '0.5rem 0' }}>
              • Review overcharge reports in your dashboard
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
