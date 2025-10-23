import DocumentIngestion from './DocumentIngestion';

interface InvoicesProps {
  customerId: string;
  configId: string;
  carrierName: string;
  onComplete: () => void;
}

export default function Invoices({ customerId, configId, carrierName, onComplete }: InvoicesProps) {
  return (
    <DocumentIngestion
      customerId={customerId}
      configId={configId}
      carrierName={carrierName}
      onComplete={onComplete}
      type="invoice"
    />
  );
}
