import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface SharedEmailProps {
  customerId?: string;
  onComplete: () => void;
}

const EMAIL_PROVIDERS = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook / Microsoft 365' },
  { value: 'yahoo', label: 'Yahoo Mail' },
  { value: 'other', label: 'Other IMAP' }
];

export default function SharedEmail({ customerId, onComplete }: SharedEmailProps) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState('gmail');
  const [email, setEmail] = useState('claims@senvocompany.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [error, setError] = useState('');

  const handleTest = async (e: FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);
    setError('');

    // Simulate testing connection
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email && password) {
      setTestResult('success');
      setTesting(false);
    } else {
      setError('Please fill in all fields');
      setTestResult('error');
      setTesting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (testResult !== 'success') {
      setError('Please test the connection first');
      return;
    }

    // Mock save
    await new Promise(resolve => setTimeout(resolve, 500));

    onComplete();
    navigate('/warehouse-data');
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '15%' }}></div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h1 style={{ marginBottom: '0.5rem' }}>1.1 Shared Email</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Here you can provide access to the shared email. This will be used by our claiming department to contact carriers and retrieve claims for you.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Provider Selection */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Email Provider</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              {EMAIL_PROVIDERS.map(prov => (
                <button
                  key={prov.value}
                  type="button"
                  onClick={() => setProvider(prov.value)}
                  style={{
                    padding: '0.875rem 1rem',
                    border: `2px solid ${provider === prov.value ? 'var(--primary)' : 'var(--gray-300)'}`,
                    background: provider === prov.value ? 'rgba(116, 93, 191, 0.05)' : 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: provider === prov.value ? 600 : 400,
                    color: provider === prov.value ? 'var(--primary)' : 'var(--gray-700)',
                    transition: 'all 0.2s'
                  }}
                >
                  {prov.label}
                </button>
              ))}
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="claims@yourcompany.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password / App Password <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or app-specific password"
              required
            />
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--gray-500)',
              marginTop: '0.5rem'
            }}>
              For Gmail and Outlook, we recommend using an app-specific password
            </p>
          </div>

          {/* Test Connection Button */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !email || !password}
              className="btn"
              style={{
                width: '100%',
                background: testResult === 'success' ? 'var(--success)' : 'transparent',
                color: testResult === 'success' ? 'white' : 'var(--primary)',
                border: `2px solid ${testResult === 'success' ? 'var(--success)' : 'var(--primary)'}`,
                opacity: testing || !email || !password ? 0.5 : 1
              }}
            >
              {testing ? 'Testing Connection...' : testResult === 'success' ? '✓ Connection Successful' : 'Test Connection'}
            </button>

            {testResult === 'success' && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid var(--success)',
                borderRadius: '8px',
                color: 'var(--success)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                ✓ Successfully connected to {EMAIL_PROVIDERS.find(p => p.value === provider)?.label}
              </div>
            )}

            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid var(--danger)',
                borderRadius: '8px',
                color: 'var(--danger)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={() => navigate('/what-to-expect')}
              className="btn"
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
              disabled={testResult !== 'success'}
              onClick={(e) => {
                if (testResult === 'success') {
                  handleSubmit(e);
                }
              }}
              style={{
                opacity: testResult !== 'success' ? 0.5 : 1,
                cursor: testResult !== 'success' ? 'not-allowed' : 'pointer'
              }}
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
