import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { CARRIERS, type CarrierOption } from '../types';

interface CarrierSelectionProps {
  customerId: string;
  onComplete: (configId: string, carrier: string) => void;
}

export default function CarrierSelection({ customerId, onComplete }: CarrierSelectionProps) {
  const navigate = useNavigate();
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCarrierSelect = (carrier: CarrierOption) => {
    setSelectedCarrier(carrier);
  };

  const handleContinue = async () => {
    if (!selectedCarrier) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiService.createCarrierConfig(customerId, selectedCarrier);
      onComplete(response.id, selectedCarrier);
      navigate('/account-contracts');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save carrier selection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '20%' }}></div>
        </div>

        <div className="header">
          <h1 className="title">Connect Your Carrier</h1>
          <p className="subtitle">Select your shipping carrier to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="carrier-grid">
          {CARRIERS.map((carrier) => (
            <div
              key={carrier}
              className={`carrier-card ${selectedCarrier === carrier ? 'selected' : ''}`}
              onClick={() => handleCarrierSelect(carrier)}
            >
              <h3>{carrier}</h3>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={handleContinue}
          disabled={!selectedCarrier || loading}
        >
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
