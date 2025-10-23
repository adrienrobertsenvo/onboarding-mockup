export interface Carrier {
  id: string;
  name: string;
  logo: string;
}

export const CARRIERS: Carrier[] = [
  { id: 'dhl', name: 'DHL', logo: '/images/dhl.svg' },
  { id: 'dhl-express', name: 'DHL Express', logo: '/images/dhl-express.svg' },
  { id: 'fedex', name: 'FedEx', logo: '/images/fedex.svg' },
  { id: 'ups', name: 'UPS', logo: '/images/ups.svg' },
  { id: 'dpd', name: 'DPD', logo: '/images/dpd.svg' },
  { id: 'gls-de', name: 'GLS-DE', logo: '/images/gls.svg' },
  { id: 'gls-it', name: 'GLS-IT', logo: '/images/gls.svg' },
  { id: 'gls-es', name: 'GLS-ES', logo: '/images/gls.svg' },
  { id: 'tnt-express', name: 'TNT Express', logo: '/images/tnt-express.svg' },
  { id: 'royal-mail', name: 'Royal Mail', logo: '/images/royal-mail.svg' },
  { id: 'swiss-post', name: 'Swiss Post', logo: '/images/swiss-post.svg' },
  { id: 'colissimo', name: 'Colissimo', logo: '/images/colissimo.svg' },
  { id: 'post-at', name: 'Post AT', logo: '/images/post-at.svg' },
  { id: 'asendia', name: 'Asendia', logo: '/images/asendia.svg' },
  { id: 'in-post', name: 'InPost', logo: '/images/in-post.svg' },
  { id: 'parcel-one', name: 'Parcel One', logo: '/images/parcel-one.svg' },
  { id: 'warenpost', name: 'Warenpost', logo: '/images/warenpost.svg' },
  { id: 'pro-carrier', name: 'Pro Carrier', logo: '/images/pro-carrier.svg' },
];

export function getCarrierLogo(carrierName: string): string | null {
  const carrier = CARRIERS.find(c =>
    c.name.toLowerCase() === carrierName.toLowerCase()
  );
  return carrier?.logo || null;
}
