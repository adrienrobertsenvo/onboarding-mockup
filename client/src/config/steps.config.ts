export interface StepConfig {
  id: string;
  label: string;
  route?: string;
  substeps?: StepConfig[];
  isCarrierSpecific?: boolean; // Will be repeated per carrier
}

export const ONBOARDING_STEPS: StepConfig[] = [
  {
    id: 'welcome',
    label: 'Welcome',
    route: '/'
  },
  {
    id: 'what-to-expect',
    label: 'What to Expect',
    route: '/what-to-expect'
  },
  {
    id: 'customer-setup',
    label: '1. Customer Setup',
    substeps: [
      {
        id: 'shared-email',
        label: '1.1 Shared Email',
        route: '/shared-email'
      },
      {
        id: 'wms-eod-report',
        label: '1.2 WMS/EOD Report',
        substeps: [
          {
            id: 'wms-example-file',
            label: '1.2.1 WMS Example File',
            route: '/warehouse-data'
          },
          {
            id: 'wms-file-ingestion',
            label: '1.2.2 WMS File Ingestion',
            route: '/wms-file-ingestion'
          }
        ]
      },
      {
        id: 'invite-users',
        label: '1.3 Invite Other Users',
        route: '/invite-users'
      }
    ]
  },
  {
    id: 'carrier-setup',
    label: '2. Carrier Setup',
    route: '/carrier-selection',
    substeps: [
      {
        id: 'carrier-config',
        label: 'Carrier Configuration',
        isCarrierSpecific: true,
        substeps: [
          {
            id: 'carrier-contacts',
            label: '2.x.1 Carrier Contacts',
            route: '/carrier-contacts',
            isCarrierSpecific: true
          },
          {
            id: 'contract-rates',
            label: '2.x.2 Contract Rates',
            route: '/account-contracts',
            isCarrierSpecific: true
          },
          {
            id: 'data-ingress',
            label: '2.x.3 Data Ingress',
            isCarrierSpecific: true,
            substeps: [
              {
                id: 'tracking-api',
                label: '2.x.3.1 Tracking API',
                route: '/tracking-api',
                isCarrierSpecific: true
              },
              {
                id: 'invoices-ingestion',
                label: '2.x.3.2 Invoices Ingestion',
                route: '/invoices',
                isCarrierSpecific: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'completion',
    label: '3. Completion',
    route: '/completion'
  }
];

// Helper function to get a flat list of all step IDs
export const getAllStepIds = (): string[] => {
  const ids: string[] = [];

  const traverse = (steps: StepConfig[]) => {
    steps.forEach(step => {
      ids.push(step.id);
      if (step.substeps) {
        traverse(step.substeps);
      }
    });
  };

  traverse(ONBOARDING_STEPS);
  return ids;
};

// Helper to get step by ID
export const getStepById = (stepId: string): StepConfig | null => {
  const traverse = (steps: StepConfig[]): StepConfig | null => {
    for (const step of steps) {
      if (step.id === stepId) return step;
      if (step.substeps) {
        const found = traverse(step.substeps);
        if (found) return found;
      }
    }
    return null;
  };

  return traverse(ONBOARDING_STEPS);
};
