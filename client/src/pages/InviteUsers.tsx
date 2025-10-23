import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface InviteUsersProps {
  customerId?: string;
  onComplete?: () => void;
}

interface User {
  email: string;
  name: string;
  role: string;
  id: string;
}

export default function InviteUsers({ customerId, onComplete }: InviteUsersProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Viewer');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleAddUser = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !name) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check for duplicate email
    if (users.some(u => u.email === email)) {
      setError('This email has already been added');
      return;
    }

    const newUser: User = {
      email,
      name,
      role,
      id: Math.random().toString(36).substr(2, 9)
    };

    setUsers([...users, newUser]);
    setEmail('');
    setName('');
    setRole('Viewer');
    setError('');
  };

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleSendInvites = async () => {
    if (users.length === 0) {
      setError('Please add at least one user to invite');
      return;
    }

    setSending(true);
    setError('');

    // Simulate sending invites
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSending(false);
    setSent(true);

    // Auto-continue after showing success
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
      navigate('/carrier-intro');
    }, 1500);
  };

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
    // Small delay to ensure state updates before navigation
    setTimeout(() => {
      navigate('/carrier-intro');
    }, 50);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '35%' }}></div>
        </div>

        <div className="header">
          <h1 className="title" style={{ fontSize: '26px' }}>
            👥 1.3 Invite Other Users
          </h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>
            Collaborate with your team
          </p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7 }}>
          Add team members who should have access to your Senvo account. They'll receive an email invitation to join.
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

        {sent && (
          <div style={{
            padding: '1.5rem',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid var(--success)',
            borderRadius: '12px',
            color: 'var(--success)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontSize: '1.125rem',
            fontWeight: 600
          }}>
            ✓ Invitations sent successfully! Redirecting...
          </div>
        )}

        {!sent && (
          <>
            {/* Add User Form */}
            <form onSubmit={handleAddUser} style={{ marginBottom: '2rem' }}>
              <div style={{
                padding: '1.5rem',
                background: 'var(--gray-50)',
                borderRadius: '12px',
                border: '2px solid var(--gray-200)'
              }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600 }}>
                  Add Team Member
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input
                      type="email"
                      className="form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.doe@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option>Viewer</option>
                      <option>Editor</option>
                      <option>Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ marginTop: '0.5rem' }}
                  >
                    + Add User
                  </button>
                </div>
              </div>
            </form>

            {/* Users List */}
            {users.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
                  Users to Invite ({users.length})
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {users.map(user => (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'white',
                        border: '2px solid var(--gray-200)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)', marginBottom: '0.25rem' }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          {user.email}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: 'var(--gray-100)',
                          color: 'var(--gray-700)',
                          borderRadius: '12px',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}>
                          {user.role}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveUser(user.id)}
                          style={{
                            padding: '0.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            lineHeight: 1
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div style={{
              padding: '1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
                💡 You can always invite more users later from your dashboard settings.
              </p>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/wms-file-ingestion')}
            className="btn"
            disabled={sending || sent}
            style={{
              background: 'transparent',
              color: 'var(--gray-600)',
              border: '2px solid var(--gray-300)',
              opacity: (sending || sent) ? 0.5 : 1
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {!sent && users.length === 0 && (
              <button
                type="button"
                onClick={handleSkip}
                className="btn"
                disabled={sending}
                style={{
                  background: 'transparent',
                  color: 'var(--gray-600)',
                  border: '2px solid var(--gray-300)'
                }}
              >
                Skip for Now
              </button>
            )}
            {!sent && users.length > 0 && (
              <button
                type="button"
                onClick={handleSendInvites}
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? 'Sending Invites...' : `Send ${users.length} Invite${users.length > 1 ? 's' : ''} →`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
