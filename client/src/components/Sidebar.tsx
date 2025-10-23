import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ONBOARDING_STEPS, StepConfig } from '../config/steps.config';
import '../styles/Sidebar.css';

export interface StepCompletion {
  [stepId: string]: boolean | 'skipped';
}

interface SidebarProps {
  completedSteps: StepCompletion;
  carrierConfigs?: Array<{ id: string; carrierName: string }>;
  currentCarrierIndex?: number;
  onStepClick?: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  completedSteps,
  carrierConfigs = [],
  currentCarrierIndex = 0,
  onStepClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['customer-setup', 'carrier-setup'])
  );

  // Find which step contains the current route and auto-expand it
  useEffect(() => {
    const findAndExpandCurrentStep = (steps: StepConfig[], parentIds: string[] = []): boolean => {
      for (const step of steps) {
        if (step.route === location.pathname) {
          // Expand all parent sections
          setExpandedSections(prev => {
            const next = new Set(prev);
            parentIds.forEach(id => next.add(id));
            if (step.substeps) {
              next.add(step.id);
            }
            return next;
          });
          return true;
        }
        if (step.substeps) {
          if (findAndExpandCurrentStep(step.substeps, [...parentIds, step.id])) {
            return true;
          }
        }
      }
      return false;
    };

    findAndExpandCurrentStep(ONBOARDING_STEPS);
  }, [location.pathname]);

  const toggleSection = (stepId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleStepClick = (route?: string) => {
    if (route) {
      if (onStepClick) {
        onStepClick(route);
      } else {
        navigate(route);
      }
    }
  };

  const getStepStatus = (stepId: string, carrierIndex?: number): 'complete' | 'skipped' | 'incomplete' => {
    const key = carrierIndex !== undefined ? `${stepId}-${carrierIndex}` : stepId;
    const status = completedSteps[key];

    if (status === true) return 'complete';
    if (status === 'skipped') return 'skipped';
    return 'incomplete';
  };

  const getStatusIcon = (status: 'complete' | 'skipped' | 'incomplete') => {
    switch (status) {
      case 'complete':
        return <div className="step-icon complete">✓</div>;
      case 'skipped':
        return <div className="step-icon skipped">⊘</div>;
      case 'incomplete':
        return <div className="step-icon incomplete"></div>;
    }
  };

  // Helper to find the first step that matches the current route
  const findFirstMatchingStep = (steps: StepConfig[], currentPath: string): string | null => {
    for (const step of steps) {
      if (step.route === currentPath) {
        return step.id;
      }
      if (step.substeps) {
        const found = findFirstMatchingStep(step.substeps, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  const firstMatchingStepId = findFirstMatchingStep(ONBOARDING_STEPS, location.pathname);

  const renderStep = (step: StepConfig, level: number = 0, carrierIndex?: number, carrierName?: string) => {
    // For carrier-setup step, only show substeps if we have carriers selected
    if (step.id === 'carrier-setup' && carrierConfigs.length === 0) {
      const isCurrentStep = step.route === location.pathname && step.id === firstMatchingStepId;
      const status = getStepStatus(step.id, carrierIndex);
      const statusIcon = getStatusIcon(status);

      return (
        <div key={step.id} className={`sidebar-step level-${level}`}>
          <div
            className={`step-content ${status} ${isCurrentStep ? 'current' : ''}`}
            onClick={() => {
              if (step.route) {
                handleStepClick(step.route);
              }
            }}
          >
            {statusIcon}
            <span className="step-label">{step.label}</span>
          </div>
        </div>
      );
    }

    const hasSubsteps = step.substeps && step.substeps.length > 0;
    const isExpanded = expandedSections.has(step.id);
    const status = getStepStatus(step.id, carrierIndex);
    const statusIcon = getStatusIcon(status);
    // Only highlight if this is the first step matching the current route
    // AND if it's a carrier-specific step, only highlight if it's the current carrier
    const isCurrentStep = step.route === location.pathname && step.id === firstMatchingStepId &&
      (carrierIndex === undefined || carrierIndex === currentCarrierIndex);

    // Replace 2.x with actual carrier number for carrier-specific steps
    let displayLabel = step.label;

    // For carrier-config, show as "2.X Carrier Configuration (CarrierName)"
    if (step.id === 'carrier-config' && carrierName && carrierIndex !== undefined) {
      displayLabel = `2.${carrierIndex + 1} Carrier Configuration (${carrierName})`;
    } else if (carrierName && step.isCarrierSpecific && carrierIndex !== undefined) {
      // Replace 2.x.Y with 2.X.Y for nested carrier steps
      displayLabel = step.label.replace(/2\.x/g, `2.${carrierIndex + 1}`);
    }

    return (
      <div key={`${step.id}-${carrierIndex ?? 'global'}`} className={`sidebar-step level-${level}`}>
        <div
          className={`step-content ${status} ${isCurrentStep ? 'current' : ''}`}
          onClick={() => {
            // For carrier-setup, navigate to route if it exists, even with substeps
            if (step.id === 'carrier-setup' && step.route) {
              handleStepClick(step.route);
            } else if (hasSubsteps) {
              toggleSection(step.id);
            } else if (step.route) {
              handleStepClick(step.route);
            }
          }}
        >
          {hasSubsteps && (
            <span
              className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                // Allow expanding/collapsing carrier-setup substeps via arrow only
                if (step.id === 'carrier-setup') {
                  e.stopPropagation();
                  toggleSection(step.id);
                }
              }}
            >
              ▶
            </span>
          )}
          {statusIcon}
          <span className="step-label">{displayLabel}</span>
        </div>

        {hasSubsteps && isExpanded && (
          <div className="substeps">
            {/* Special handling for carrier-config: render once per carrier with all substeps */}
            {step.id === 'carrier-setup' && carrierConfigs.length > 0 ? (
              carrierConfigs.map((carrier, idx) => {
                // Only render and expand the current carrier being configured
                const carrierConfigStep = step.substeps!.find(s => s.id === 'carrier-config');
                if (carrierConfigStep) {
                  // Auto-expand current carrier's config
                  if (idx === currentCarrierIndex && !expandedSections.has(`${carrierConfigStep.id}-${idx}`)) {
                    setTimeout(() => {
                      setExpandedSections(prev => {
                        const next = new Set(prev);
                        next.add(`${carrierConfigStep.id}-${idx}`);
                        return next;
                      });
                    }, 0);
                  }
                  return renderStep(carrierConfigStep, level + 1, idx, carrier.carrierName);
                }
                return null;
              })
            ) : (
              step.substeps!.map(substep => {
                // For non-carrier-specific steps, just render normally
                if (!substep.isCarrierSpecific) {
                  return renderStep(substep, level + 1, carrierIndex, carrierName);
                }
                // If we're inside a carrier-config, render the substep with the carrier context
                if (carrierIndex !== undefined && carrierName) {
                  return renderStep(substep, level + 1, carrierIndex, carrierName);
                }
                return null;
              })
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="onboarding-sidebar">
      <div className="sidebar-header">
        <h3>Onboarding Progress</h3>
      </div>
      <div className="sidebar-steps">
        {ONBOARDING_STEPS.map(step => renderStep(step, 0))}
      </div>
    </aside>
  );
};
