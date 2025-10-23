import { useNavigate } from 'react-router-dom';
import { getCarrierLogo } from '../utils/carriers';

interface CarrierIntroProps {
  carrierName: string;
  carrierIndex: number;
  totalCarriers: number;
  onComplete?: () => void;
}

export default function CarrierIntro({ carrierName, carrierIndex, totalCarriers, onComplete }: CarrierIntroProps) {
  const navigate = useNavigate();
  const carrierLogo = getCarrierLogo(carrierName);

  const handleContinue = () => {
    if (onComplete) {
      onComplete();
    }
    navigate('/carrier-contacts');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '45%' }}></div>
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
          <h1 className="title" style={{ fontSize: '26px' }}>
            🚀 Let's Configure {carrierName}
          </h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>
            Carrier {carrierIndex + 1} of {totalCarriers}
          </p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7 }}>
          We'll walk you through setting up {carrierName} step by step. This should only take a few minutes.
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'var(--gray-50)',
          borderRadius: '12px',
          border: '2px solid var(--gray-200)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--gray-900)' }}>
            Here's what we'll set up:
          </h3>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid var(--gray-200)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                  Carrier Contacts
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Who manages your {carrierName} account and premium support
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid var(--gray-200)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                  Contract & Rates
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Upload your contract file and account numbers
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '1rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              border: '2px solid var(--gray-200)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                  Data Integration
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Configure tracking API and invoice ingestion
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '1rem',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
            💡 You can skip any step and come back to it later from your dashboard.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/carrier-selection')}
            className="btn"
            style={{
              background: 'transparent',
              color: 'var(--gray-600)',
              border: '2px solid var(--gray-300)'
            }}
          >
            ← Back to Carriers
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="btn btn-primary"
          >
            Start Configuration →
          </button>
        </div>
      </div>
    </div>
  );
}
