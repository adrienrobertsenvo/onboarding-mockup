import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import WhatToExpect from './pages/WhatToExpect';
import SharedEmail from './pages/SharedEmail';
import CarrierSelection from './pages/CarrierSelection';
import CarrierIntro from './pages/CarrierIntro';
import CarrierCompletion from './pages/CarrierCompletion';
import AccountContracts from './pages/AccountContracts';
import CarrierContacts from './pages/CarrierContacts';
import TrackingAPI from './pages/TrackingAPI';
import Invoices from './pages/Invoices';
import WarehouseData from './pages/WarehouseData';
import DocumentIngestion from './pages/DocumentIngestion';
import Completion from './pages/Completion';
import Dashboard from './pages/Dashboard';
import InviteUsers from './pages/InviteUsers';
import { Sidebar } from './components/Sidebar';
import autosaveService from './services/autosave';
import type { OnboardingState, CustomerInfo, CarrierConfig, StepCompletion } from './types';

// Layout wrapper component that conditionally shows sidebar
function Layout({ children, showSidebar, state }: { children: React.ReactNode; showSidebar: boolean; state: OnboardingState }) {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar
        completedSteps={state.completedSteps || {}}
        carrierConfigs={state.carrierConfigs?.map(c => ({ id: c.id!, carrierName: c.selected_carrier }))}
        currentCarrierIndex={state.currentCarrierIndex}
      />
      <div style={{ marginLeft: '320px', width: 'calc(100% - 320px)', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 0,
    carrierConfigs: [],
    completedSteps: {},
    currentCarrierIndex: 0
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

  // Helper function to mark steps as complete
  const markStepComplete = (stepId: string, carrierIndex?: number) => {
    setState(prev => {
      const key = carrierIndex !== undefined ? `${stepId}-${carrierIndex}` : stepId;
      return {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [key]: true
        }
      };
    });
  };

  const handleWelcomeComplete = (customerId: string, data: CustomerInfo) => {
    setState(prev => ({
      ...prev,
      customerId,
      customerInfo: data,
      currentStep: 1,
      completedSteps: {
        ...prev.completedSteps,
        'welcome': true
      }
    }));
  };

  const handleCarrierSelect = (carriers: Array<{ configId: string; carrier: string }>) => {
    setState(prev => {
      const newCarrierConfigs = carriers.map(c => ({
        id: c.configId,
        selected_carrier: c.carrier
      }));

      return {
        ...prev,
        currentCarrierConfigId: carriers[0]?.configId, // Set first carrier as current
        currentCarrierIndex: 0, // Initialize to first carrier
        carrierConfigs: newCarrierConfigs,
        currentStep: 2,
        completedSteps: {
          ...prev.completedSteps,
          'carrier-setup': true
        }
      };
    });
  };

  const handleCarrierDetailsComplete = () => {
    setState(prev => {
      const carrierIndex = prev.carrierConfigs?.findIndex(c => c.id === prev.currentCarrierConfigId) ?? 0;
      return {
        ...prev,
        currentStep: 3,
        completedSteps: {
          ...prev.completedSteps,
          [`contract-rates-${carrierIndex}`]: true,
          [`carrier-contacts-${carrierIndex}`]: true
        }
      };
    });
  };

  const handleTrackingAPIComplete = () => {
    setState(prev => {
      const carrierIndex = prev.carrierConfigs?.findIndex(c => c.id === prev.currentCarrierConfigId) ?? 0;
      return {
        ...prev,
        currentStep: 4,
        completedSteps: {
          ...prev.completedSteps,
          [`tracking-api-${carrierIndex}`]: true
        }
      };
    });
  };

  const handleInvoicesComplete = () => {
    setState(prev => {
      const carrierIndex = prev.carrierConfigs?.findIndex(c => c.id === prev.currentCarrierConfigId) ?? 0;
      return {
        ...prev,
        currentStep: 5,
        completedSteps: {
          ...prev.completedSteps,
          'shared-email': true,
          [`invoices-ingestion-${carrierIndex}`]: true
        }
      };
    });
    // Clear autosave when onboarding is complete
    if (autosaveInterval.current) {
      autosaveService.stopAutosave(autosaveInterval.current);
      autosaveInterval.current = null;
    }
    autosaveService.clear();
  };

  const handleWarehouseDataComplete = () => {
    setState(prev => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        'wms-example-file': true
      }
    }));
  };

  const handleWMSIngestionComplete = () => {
    setState(prev => ({
      ...prev,
      currentStep: 5,
      completedSteps: {
        ...prev.completedSteps,
        'wms-file-ingestion': true,
        'wms-eod-report': true  // Mark parent step as complete when both substeps are done
      }
    }));
  };

  const handleInviteUsersComplete = () => {
    setState(prev => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        'invite-users': true
      }
    }));
  };

  const handleSharedEmailComplete = () => {
    setState(prev => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        'shared-email': true
      }
    }));
  };

  const handleWhatToExpectComplete = () => {
    setState(prev => ({
      ...prev,
      completedSteps: {
        ...prev.completedSteps,
        'what-to-expect': true
      }
    }));
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
        <Route
          path="/"
          element={
            <Layout showSidebar={false} state={state}>
              <Welcome onComplete={handleWelcomeComplete} />
            </Layout>
          }
        />

        <Route
          path="/what-to-expect"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerInfo?.customer_name ? (
                <WhatToExpect
                  customerName={state.customerInfo.customer_name}
                  onComplete={handleWhatToExpectComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/shared-email"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId ? (
                <SharedEmail
                  customerId={state.customerId}
                  onComplete={handleSharedEmailComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/carrier-selection"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId ? (
                <CarrierSelection
                  customerId={state.customerId}
                  onComplete={handleCarrierSelect}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/carrier-intro"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId && state.carrierConfigs && state.carrierConfigs.length > 0 ? (
                <CarrierIntro
                  carrierName={state.carrierConfigs[state.currentCarrierIndex || 0]?.selected_carrier || ''}
                  carrierIndex={state.currentCarrierIndex || 0}
                  totalCarriers={state.carrierConfigs.length}
                />
              ) : (
                <Navigate to="/carrier-selection" />
              )}
            </Layout>
          }
        />

        <Route
          path="/carrier-completion"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId && state.carrierConfigs && state.carrierConfigs.length > 0 ? (
                <CarrierCompletion
                  carrierName={state.carrierConfigs[state.currentCarrierIndex || 0]?.selected_carrier || ''}
                  carrierIndex={state.currentCarrierIndex || 0}
                  totalCarriers={state.carrierConfigs.length}
                  completedSteps={{
                    contacts: !!state.completedSteps?.[`carrier-contacts-${state.currentCarrierIndex || 0}`],
                    contracts: !!state.completedSteps?.[`contract-rates-${state.currentCarrierIndex || 0}`],
                    trackingAPI: !!state.completedSteps?.[`tracking-api-${state.currentCarrierIndex || 0}`],
                    invoices: !!state.completedSteps?.[`invoices-ingestion-${state.currentCarrierIndex || 0}`]
                  }}
                  onNext={() => {
                    setState(prev => ({
                      ...prev,
                      currentCarrierIndex: (prev.currentCarrierIndex || 0) + 1,
                      currentCarrierConfigId: prev.carrierConfigs?.[(prev.currentCarrierIndex || 0) + 1]?.id
                    }));
                  }}
                />
              ) : (
                <Navigate to="/carrier-selection" />
              )}
            </Layout>
          }
        />

        <Route
          path="/account-contracts"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.currentCarrierConfigId && currentCarrierConfig ? (
                <AccountContracts
                  configId={state.currentCarrierConfigId}
                  carrierName={currentCarrierConfig.selected_carrier}
                  onComplete={handleCarrierDetailsComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/carrier-contacts"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.currentCarrierConfigId && currentCarrierConfig ? (
                <CarrierContacts
                  configId={state.currentCarrierConfigId}
                  carrierName={currentCarrierConfig.selected_carrier}
                  onComplete={handleCarrierDetailsComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/tracking-api"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.currentCarrierConfigId && currentCarrierConfig ? (
                <TrackingAPI
                  configId={state.currentCarrierConfigId}
                  carrierName={currentCarrierConfig.selected_carrier}
                  onComplete={handleTrackingAPIComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/invoices"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId && state.currentCarrierConfigId && currentCarrierConfig ? (
                <Invoices
                  customerId={state.customerId}
                  configId={state.currentCarrierConfigId}
                  carrierName={currentCarrierConfig.selected_carrier}
                  onComplete={handleInvoicesComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/warehouse-data"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId ? (
                <WarehouseData
                  configId={state.currentCarrierConfigId || ''}
                  carrierName={currentCarrierConfig?.selected_carrier || ''}
                  onComplete={handleWarehouseDataComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/wms-file-ingestion"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId ? (
                <DocumentIngestion
                  customerId={state.customerId}
                  configId={state.currentCarrierConfigId}
                  carrierName={currentCarrierConfig?.selected_carrier}
                  onComplete={handleWMSIngestionComplete}
                  type="wms"
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/invite-users"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              {state.customerId ? (
                <InviteUsers
                  customerId={state.customerId}
                  onComplete={handleInviteUsersComplete}
                />
              ) : (
                <Navigate to="/" />
              )}
            </Layout>
          }
        />

        <Route
          path="/completion"
          element={
            <Layout showSidebar={!!state.customerId} state={state}>
              <Completion
                customerId={state.customerId}
                configId={state.currentCarrierConfigId}
              />
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout showSidebar={false} state={state}>
              <Dashboard
                customerId={state.customerId}
                customerName={state.customerInfo?.customer_name}
                onAddCarrier={handleAddAnotherCarrier}
              />
            </Layout>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
