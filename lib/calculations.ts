import { OfferItem, OfferConfig } from "@/types";

export function calculateRowLabor(item: OfferItem, config: OfferConfig): number {
    if (config.pricingMode === 'fixed') {
        return item.fixedLaborCost || 0;
    }
    return (item.hours || 0) * (config.hourlyRate || 0);
}

export function calculateRowTotal(item: OfferItem, config: OfferConfig): number {
    const labor = calculateRowLabor(item, config);
    return labor + (item.materialCost || 0);
}

export function calculateTotals(items: OfferItem[], config: OfferConfig) {
    const totalLabor = items.reduce((sum, item) => sum + calculateRowLabor(item, config), 0);
    const totalMaterial = items.reduce((sum, item) => sum + (item.materialCost || 0), 0);
    const subtotal = totalLabor + totalMaterial;
    const vat = subtotal * (config.vatRate || 0);
    const totalWithVat = subtotal + vat;

    let rotDeduction = 0;
    if (config.useRot) {
        rotDeduction = totalLabor * 0.30; // 30% ROT deduction on labor
    }

    const totalToPay = totalWithVat - rotDeduction;

    return {
        totalLabor,
        totalMaterial,
        subtotal,
        vat,
        totalWithVat,
        rotDeduction,
        totalToPay
    };
}
