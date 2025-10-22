import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import type { CustomerInfo } from '../types';

interface WelcomeProps {
  onComplete: (customerId: string, data: CustomerInfo) => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CustomerInfo>({
    customer_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.createCustomer(formData);
      onComplete(response.id, formData);
      navigate('/what-to-expect');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create customer record');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setFormData({ customer_name: value });
  };

  const isValid = formData.customer_name.trim().length > 0;

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1 className="title">Welcome to Senvo</h1>
          <p className="subtitle">Recover Every Cent.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="description" style={{ marginBottom: '2rem' }}>
          Let's get started! We'll walk you through a few steps to connect your carriers
          and set up your invoice auditing. Please enter your name so we can personalize
          your onboarding experience.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.customer_name}
              onChange={(e) => handleChange(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || loading}
          >
            {loading ? 'Creating account...' : 'Get Started →'}
          </button>
        </form>
      </div>
    </div>
  );
}
