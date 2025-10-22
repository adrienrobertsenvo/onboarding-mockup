import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import WhatToExpect from './pages/WhatToExpect';
import CarrierSelection from './pages/CarrierSelection';
import AccountContracts from './pages/AccountContracts';
import CarrierContacts from './pages/CarrierContacts';
import TrackingAPI from './pages/TrackingAPI';
import Invoices from './pages/Invoices';
import WarehouseData from './pages/WarehouseData';
import Completion from './pages/Completion';
import Dashboard from './pages/Dashboard';
import autosaveService from './services/autosave';
import type { OnboardingState, CustomerInfo, CarrierConfig } from './types';

function App() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    carrierConfigs: []
  });
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const autosaveInterval = useRef<NodeJS.Timeout | null>(null);

  // Check for saved progress on mount
  useEffect(() => {
    if (autosaveService.hasSaved()) {
      setShowResumePrompt(true);
    }
  }, []);

  // Start autosave when user starts onboarding
  useEffect(() => {
    if (state.customerId && !autosaveInterval.current) {
      autosaveInterval.current = autosaveService.startAutosave(() => state);
    }

    return () => {
      if (autosaveInterval.current) {
        autosaveService.stopAutosave(autosaveInterval.current);
      }
    };
  }, [state.customerId]);

  const handleResumeProgress = () => {
    const savedState = autosaveService.load();
    if (savedState) {
      setState(savedState);
    }
    setShowResumePrompt(false);
  };

  const handleStartFresh = () => {
    autosaveService.clear();
    setShowResumePrompt(false);
  };

  const handleWelcomeComplete = (customerId: string, data: CustomerInfo) => {
    setState(prev => ({
      ...prev,
      customerId,
      customerInfo: data,
      currentStep: 1
    }));
  };

  const handleCarrierSelect = (configId: string, carrier: string) => {
    setState(prev => ({
      ...prev,
      currentCarrierConfigId: configId,
      carrierConfigs: [
        ...(prev.carrierConfigs || []),
        {
          id: configId,
          selected_carrier: carrier
        }
      ],
      currentStep: 2
    }));
  };

  const handleCarrierDetailsComplete = () => {
    setState(prev => ({ ...prev, currentStep: 3 }));
  };

  const handleTrackingAPIComplete = () => {
    setState(prev => ({ ...prev, currentStep: 4 }));
  };

  const handleInvoicesComplete = () => {
    setState(prev => ({ ...prev, currentStep: 5 }));
    // Clear autosave when onboarding is complete
    if (autosaveInterval.current) {
      autosaveService.stopAutosave(autosaveInterval.current);
      autosaveInterval.current = null;
    }
    autosaveService.clear();
  };

  const handleAddAnotherCarrier = () => {
    setState(prev => ({
      ...prev,
      currentCarrierConfigId: undefined,
      currentStep: 1
    }));
  };

  const currentCarrierConfig = state.carrierConfigs?.find(
    c => c.id === state.currentCarrierConfigId
  );

  // Resume prompt overlay
  if (showResumePrompt) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '16px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💾</div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>
            Welcome Back!
          </h2>
          <p style={{ marginBottom: '2rem', color: 'var(--gray-600)' }}>
            We found your saved progress. Would you like to continue where you left off,
            or start fresh?
          </p>
          <button
            onClick={handleResumeProgress}
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            Resume Progress
          </button>
          <button
            onClick={handleStartFresh}
            className="btn"
            style={{
              width: '100%',
              background: 'transparent',
              color: 'var(--gray-600)',
              border: '2px solid var(--gray-300)'
            }}
          >
            Start Fresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome onComplete={handleWelcomeComplete} />} />

        <Route
          path="/what-to-expect"
          element={
            state.customerInfo?.customer_name ? (
              <WhatToExpect customerName={state.customerInfo.customer_name} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/carrier-selection"
          element={
            state.customerId ? (
              <CarrierSelection
                customerId={state.customerId}
                onComplete={handleCarrierSelect}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/account-contracts"
          element={
            state.currentCarrierConfigId && currentCarrierConfig ? (
              <AccountContracts
                configId={state.currentCarrierConfigId}
                carrierName={currentCarrierConfig.selected_carrier}
                onComplete={handleCarrierDetailsComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/carrier-contacts"
          element={
            state.currentCarrierConfigId && currentCarrierConfig ? (
              <CarrierContacts
                configId={state.currentCarrierConfigId}
                carrierName={currentCarrierConfig.selected_carrier}
                onComplete={handleCarrierDetailsComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/tracking-api"
          element={
            state.currentCarrierConfigId && currentCarrierConfig ? (
              <TrackingAPI
                configId={state.currentCarrierConfigId}
                carrierName={currentCarrierConfig.selected_carrier}
                onComplete={handleTrackingAPIComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/invoices"
          element={
            state.customerId && state.currentCarrierConfigId && currentCarrierConfig ? (
              <Invoices
                customerId={state.customerId}
                configId={state.currentCarrierConfigId}
                carrierName={currentCarrierConfig.selected_carrier}
                onComplete={handleInvoicesComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/warehouse-data"
          element={
            state.currentCarrierConfigId && currentCarrierConfig ? (
              <WarehouseData
                configId={state.currentCarrierConfigId}
                carrierName={currentCarrierConfig.selected_carrier}
                onComplete={handleInvoicesComplete}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/completion"
          element={
            <Completion
              customerId={state.customerId}
              configId={state.currentCarrierConfigId}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <Dashboard
              customerId={state.customerId}
              customerName={state.customerInfo?.customer_name}
              onAddCarrier={handleAddAnotherCarrier}
            />
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
