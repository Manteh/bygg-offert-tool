export interface OfferItem {
    id: string;
    descriptionLithuanian: string;
    descriptionSwedish: string;
    hours: number | null;
    materialCost: number | null;
    fixedLaborCost: number | null;
}

export interface OfferConfig {
    pricingMode: 'hourly' | 'fixed';
    hourlyRate: number | null;
    vatRate: number | null;
    companyName: string;
    customerName: string;
    customerAddress1: string;
    customerZip: string;
    customerCity: string;
    useRot: boolean;
    offerNumber: string;
    offerDate: string;
}

export interface OfferState {
    items: OfferItem[];
    config: OfferConfig;
    language: 'sv' | 'lt';
    addItem: () => void;
    updateItem: (id: string, data: Partial<OfferItem>) => void;
    removeItem: (id: string) => void;
    setConfig: (data: Partial<OfferConfig>) => void;
    setLanguage: (lang: 'sv' | 'lt') => void;
}
