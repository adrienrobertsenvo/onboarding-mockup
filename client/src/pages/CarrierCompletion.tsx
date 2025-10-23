import { useNavigate } from 'react-router-dom';
import { getCarrierLogo } from '../utils/carriers';

interface CarrierCompletionProps {
  carrierName: string;
  carrierIndex: number;
  totalCarriers: number;
  completedSteps: {
    contacts: boolean;
    contracts: boolean;
    trackingAPI: boolean;
    invoices: boolean;
  };
  onNext?: () => void;
}

export default function CarrierCompletion({
  carrierName,
  carrierIndex,
  totalCarriers,
  completedSteps,
  onNext
}: CarrierCompletionProps) {
  const navigate = useNavigate();
  const carrierLogo = getCarrierLogo(carrierName);
  const hasMoreCarriers = carrierIndex < totalCarriers - 1;

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    if (hasMoreCarriers) {
      // Go to next carrier intro
      navigate('/carrier-intro');
    } else {
      // All carriers done, go to final completion
      navigate('/completion');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((carrierIndex + 1) / totalCarriers) * 40 + 50}%` }}></div>
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

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 className="title" style={{ fontSize: '26px', marginBottom: '0.75rem' }}>
            {carrierName} Configuration Complete!
          </h1>
          <p className="subtitle" style={{ fontSize: '18px' }}>
            Great job! Here's what we set up for {carrierName}
          </p>
        </div>

        <div style={{
          padding: '1.5rem',
          background: 'var(--gray-50)',
          borderRadius: '12px',
          border: '2px solid var(--gray-200)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 600, color: 'var(--gray-900)' }}>
            Configuration Summary
          </h3>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${completedSteps.contacts ? 'var(--success)' : 'var(--gray-300)'}`
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: completedSteps.contacts ? 'var(--success)' : 'var(--gray-300)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {completedSteps.contacts ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>Carrier Contacts</span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: completedSteps.contacts ? 'rgba(34, 197, 94, 0.1)' : 'var(--gray-100)',
                color: completedSteps.contacts ? 'var(--success)' : 'var(--gray-600)',
                fontWeight: 600
              }}>
                {completedSteps.contacts ? 'Completed' : 'Skipped'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${completedSteps.contracts ? 'var(--success)' : 'var(--gray-300)'}`
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: completedSteps.contracts ? 'var(--success)' : 'var(--gray-300)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {completedSteps.contracts ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>Contract & Rates</span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: completedSteps.contracts ? 'rgba(34, 197, 94, 0.1)' : 'var(--gray-100)',
                color: completedSteps.contracts ? 'var(--success)' : 'var(--gray-600)',
                fontWeight: 600
              }}>
                {completedSteps.contracts ? 'Completed' : 'Skipped'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${completedSteps.trackingAPI ? 'var(--success)' : 'var(--gray-300)'}`
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: completedSteps.trackingAPI ? 'var(--success)' : 'var(--gray-300)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {completedSteps.trackingAPI ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>Tracking API</span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: completedSteps.trackingAPI ? 'rgba(34, 197, 94, 0.1)' : 'var(--gray-100)',
                color: completedSteps.trackingAPI ? 'var(--success)' : 'var(--gray-600)',
                fontWeight: 600
              }}>
                {completedSteps.trackingAPI ? 'Completed' : 'Skipped'}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${completedSteps.invoices ? 'var(--success)' : 'var(--gray-300)'}`
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: completedSteps.invoices ? 'var(--success)' : 'var(--gray-300)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {completedSteps.invoices ? '✓' : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color: 'var(--gray-900)' }}>Invoice Ingestion</span>
              </div>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: completedSteps.invoices ? 'rgba(34, 197, 94, 0.1)' : 'var(--gray-100)',
                color: completedSteps.invoices ? 'var(--success)' : 'var(--gray-600)',
                fontWeight: 600
              }}>
                {completedSteps.invoices ? 'Completed' : 'Skipped'}
              </span>
            </div>
          </div>
        </div>

        {hasMoreCarriers && (
          <div style={{
            padding: '1rem',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
              📦 You have {totalCarriers - carrierIndex - 1} more carrier{totalCarriers - carrierIndex - 1 > 1 ? 's' : ''} to configure
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleNext}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {hasMoreCarriers ? 'Configure Next Carrier →' : 'Complete Onboarding →'}
        </button>
      </div>
    </div>
  );
}
