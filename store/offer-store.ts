import { create } from 'zustand';
import { OfferItem, OfferConfig, OfferState, SavedOffer } from '@/types';
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

export const useOfferStore = create<OfferState>((set, get) => ({
    items: [],
    config: { ...DEFAULT_CONFIG, offerNumber: generateOfferNumber() },
    language: 'sv',
    selectedOfferId: null,
    savedOffers: [],

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

    saveCurrentOffer: () => set((state) => {
        if (!state.selectedOfferId) return {}; // Don't save if no offer is selected (technically create new should set ID first)

        const newSavedOffer: SavedOffer = {
            id: state.selectedOfferId, // Use the selected ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            config: state.config,
            items: state.items,
        };

        // Check if we are updating an existing saved offer
        const existingIndex = state.savedOffers.findIndex(o => o.id === state.selectedOfferId);

        let newSavedOffers;
        if (existingIndex >= 0) {
            // Update existing
            newSavedOffers = [...state.savedOffers];
            newSavedOffers[existingIndex] = {
                ...newSavedOffers[existingIndex],
                updatedAt: new Date().toISOString(),
                config: state.config,
                items: state.items
            };
        } else {
            // Create new
            newSavedOffers = [newSavedOffer, ...state.savedOffers];
        }

        // Persist
        if (typeof window !== 'undefined') {
            localStorage.setItem('saved_offers', JSON.stringify(newSavedOffers));
        }

        return { savedOffers: newSavedOffers };
    }),

    loadOffer: (id) => set((state) => {
        const offer = state.savedOffers.find(o => o.id === id);
        if (offer) {
            return {
                selectedOfferId: id,
                config: { ...offer.config },
                items: [...offer.items],
            };
        }
        return {};
    }),

    deleteOffer: (id) => set((state) => {
        const newSavedOffers = state.savedOffers.filter(o => o.id !== id);
        if (typeof window !== 'undefined') {
            localStorage.setItem('saved_offers', JSON.stringify(newSavedOffers));
        }

        // If deleting the currently selected offer, deselect it
        if (state.selectedOfferId === id) {
            return { savedOffers: newSavedOffers, selectedOfferId: null };
        }
        return { savedOffers: newSavedOffers };
    }),

    loadFromStorage: () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('saved_offers');
            if (stored) {
                try {
                    set({ savedOffers: JSON.parse(stored) });
                } catch (e) {
                    console.error("Failed to load offers", e);
                }
            }
        }
    },

    resetOffer: () => {
        const newId = generateId();
        let newOfferNumber = generateOfferNumber();
        const existingNumbers = new Set(get().savedOffers.map(o => o.config.offerNumber));

        // Ensure uniqueness
        while (existingNumbers.has(newOfferNumber)) {
            newOfferNumber = generateOfferNumber();
        }

        set(() => ({
            selectedOfferId: newId,
            items: [],
            config: { ...DEFAULT_CONFIG, offerNumber: newOfferNumber },
        }));
        get().saveCurrentOffer();
    },
}));
