import { useNavigate } from 'react-router-dom';

interface WhatToExpectProps {
  customerName: string;
  onComplete?: () => void;
}

export default function WhatToExpect({ customerName, onComplete }: WhatToExpectProps) {
  const navigate = useNavigate();

  const handleStartSetup = () => {
    if (onComplete) {
      onComplete();
    }
    navigate('/shared-email');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '10%' }}></div>
        </div>

        <div className="header">
          <h1 className="title">What to Expect</h1>
          <p className="subtitle">Welcome, {customerName}!</p>
        </div>

        <div className="description">
          <p style={{ marginBottom: '1.5rem' }}>
            Before we begin, here's what you'll need to complete your onboarding.
            Having these details ready will make the process much smoother:
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '0.75rem',
              marginTop: '1.5rem'
            }}>
              1. Customer Setup
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '1rem'
            }}>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Shared Email Credentials (for claims processing)
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ WMS/EOD Report File (warehouse management data)
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Team Members to Invite (optional)
              </li>
            </ul>

            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '0.75rem',
              marginTop: '1.5rem'
            }}>
              2. Carrier Setup (Per Carrier)
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: '0'
            }}>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Carrier Selection (DHL, UPS, FedEx, etc.)
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Carrier Contact Information (account manager details)
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Account Numbers and Contract Files
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Tracking API Keys and Credentials
              </li>
              <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                ✓ Invoice Forwarding Setup
              </li>
            </ul>
          </div>

          <div style={{
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: '8px',
            marginBottom: '2rem',
            border: '2px solid var(--gray-200)'
          }}>
            <strong>💾 Your progress is automatically saved</strong>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              You can pause anytime and resume later. We'll save your work every 20 seconds.
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleStartSetup}
        >
          Start Setup →
        </button>

        <button
          className="btn"
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            background: 'transparent',
            color: 'var(--gray-600)',
            border: '2px solid var(--gray-300)'
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
