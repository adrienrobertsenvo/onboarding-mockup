import { useNavigate } from 'react-router-dom';

interface WhatToExpectProps {
  customerName: string;
}

export default function WhatToExpect({ customerName }: WhatToExpectProps) {
  const navigate = useNavigate();

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
            Before we begin, here's what you'll need to complete your carrier integration.
            Having these details ready will make the process much smoother:
          </p>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            marginBottom: '2rem'
          }}>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              ✓ Carrier Account Number
            </li>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              ✓ Account Manager Contact (name, email, phone)
            </li>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              ✓ Premium Customer Service Contact (if applicable)
            </li>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              ✓ Tracking API Keys and Credentials
            </li>
            <li style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
              ✓ Contract and Rate Files
            </li>
          </ul>

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
          onClick={() => navigate('/carrier-selection')}
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
