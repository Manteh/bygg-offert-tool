import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

export function generateOfferNumber(): string {
    const date = new Date();
    const yy = String(date.getFullYear()).slice(-2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 90 + 10); // 10-99
    return `${yy}${mm}${dd}${random}`;
}

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('sv-SE', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}
