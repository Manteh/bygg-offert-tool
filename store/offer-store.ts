import { create } from 'zustand';
import { OfferItem, OfferConfig, OfferState } from '@/types';
import { generateId, generateOfferNumber } from '@/lib/utils';

const DEFAULT_CONFIG: OfferConfig = {
    pricingMode: 'hourly',
    hourlyRate: 440,
    vatRate: 0.25,
    companyName: 'JS Bygg & Snickeri',
    customerName: '',
    customerAddress1: '',
    customerZip: '',
    customerCity: '',
    useRot: false,
    offerNumber: '', // Will be set on init
    offerDate: new Date().toISOString().split('T')[0],
};

export const useOfferStore = create<OfferState>((set) => ({
    items: [],
    config: { ...DEFAULT_CONFIG, offerNumber: generateOfferNumber() },
    language: 'lt',
    addItem: () =>
        set((state) => ({
            items: [
                ...state.items,
                {
                    id: generateId(),
                    descriptionLithuanian: '',
                    descriptionSwedish: '',
                    hours: 0,
                    materialCost: 0,
                    fixedLaborCost: 0,
                },
            ],
        })),
    updateItem: (id, data) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...data } : item
            ),
        })),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    setConfig: (data) =>
        set((state) => ({
            config: { ...state.config, ...data },
        })),
    setLanguage: (lang) => set({ language: lang }),
}));
