import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { CARRIERS } from '../utils/carriers';

interface CarrierSelectionProps {
  customerId: string;
  onComplete: (carriers: Array<{ configId: string; carrier: string }>) => void;
}

export default function CarrierSelection({ customerId, onComplete }: CarrierSelectionProps) {
  const navigate = useNavigate();
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCarrierToggle = (carrierId: string) => {
    setSelectedCarriers(prev => {
      if (prev.includes(carrierId)) {
        return prev.filter(id => id !== carrierId);
      } else {
        return [...prev, carrierId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedCarriers.length === 0) {
      setError('Please select at least one carrier');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create carrier configs for each selected carrier
      const carrierConfigs = [];
      for (const carrierId of selectedCarriers) {
        const carrier = CARRIERS.find(c => c.id === carrierId);
        if (carrier) {
          const response = await apiService.createCarrierConfig(customerId, carrier.name);
          carrierConfigs.push({
            configId: response.id,
            carrier: carrier.name
          });
        }
      }

      // Pass all carrier configs to parent - this will update state
      onComplete(carrierConfigs);

      // Use setTimeout to ensure state updates before navigation
      setTimeout(() => {
        navigate('/carrier-intro');
      }, 50);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save carrier selection');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '40%' }}></div>
        </div>

        <div className="header">
          <h1 className="title" style={{ fontSize: '26px' }}>
            📦 2. Carrier Setup
          </h1>
          <p className="subtitle" style={{ fontSize: '18px', marginTop: '0.75rem' }}>
            Select your shipping carriers
          </p>
        </div>

        <div className="description" style={{ marginBottom: '2rem', fontSize: '16px', lineHeight: 1.7 }}>
          Choose one or more carriers you work with. You'll configure each one individually in the next steps.
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

        {selectedCarriers.length > 0 && (
          <div style={{
            padding: '1rem',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid var(--success)',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}>
            <p style={{ color: 'var(--success)', fontWeight: 600, margin: 0 }}>
              ✓ {selectedCarriers.length} carrier{selectedCarriers.length > 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {CARRIERS.map((carrier) => (
            <button
              key={carrier.id}
              type="button"
              onClick={() => handleCarrierToggle(carrier.id)}
              style={{
                padding: '1.5rem',
                background: selectedCarriers.includes(carrier.id) ? 'rgba(116, 93, 191, 0.05)' : 'white',
                border: `3px solid ${selectedCarriers.includes(carrier.id) ? 'var(--primary)' : 'var(--gray-200)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                minHeight: '140px',
                position: 'relative'
              }}
            >
              {selectedCarriers.includes(carrier.id) && (
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  ✓
                </div>
              )}
              <img
                src={carrier.logo}
                alt={carrier.name}
                style={{
                  width: '100%',
                  height: '60px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: selectedCarriers.includes(carrier.id) ? 'var(--primary)' : 'var(--gray-900)',
                textAlign: 'center'
              }}>
                {carrier.name}
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={() => navigate('/invite-users')}
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
            type="button"
            onClick={handleContinue}
            className="btn btn-primary"
            disabled={selectedCarriers.length === 0 || loading}
            style={{
              opacity: selectedCarriers.length === 0 ? 0.5 : 1,
              cursor: selectedCarriers.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
