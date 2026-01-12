"use client";

import { useRef } from "react";
import { useOfferStore } from "@/store/offer-store";
import { calculateTotals, calculateRowLabor } from "@/lib/calculations";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { translations } from "@/lib/i18n";

export function DocumentView() {
    const { items, config, language } = useOfferStore();
    const totals = calculateTotals(items, config);
    const t = translations[language];
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Offert-${config.offerNumber || 'dokument'}`,
    });

    const validUntilDate = new Date(config.offerDate);
    validUntilDate.setDate(validUntilDate.getDate() + 14);

    return (
        <>
            {/* Print Styles */}
            <style jsx global>{`
                @page {
                    size: A4;
                    margin: 0;
                }
                @media print {
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-hidden {
                        display: none !important;
                    }
                    .print-container {
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 100% !important;
                        min-height: 100vh !important;
                        padding: 15mm !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    .print-content {
                        flex: 1 !important;
                    }
                    .print-footer {
                        position: relative !important;
                        bottom: auto !important;
                        left: auto !important;
                        right: auto !important;
                        margin-top: auto !important;
                    }
                }
            `}</style>

            <div className="flex flex-col gap-4 relative">
                {/* Floating Download Button - Hidden when printing */}
                <div className="fixed bottom-8 right-8 z-50 print-hidden">
                    <Button
                        onClick={() => handlePrint()}
                        size="lg"
                        className="shadow-xl rounded-full px-6 py-6 bg-primary hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer"
                    >
                        <Download className="mr-2 h-5 w-5" />
                        {t.downloadPdf}
                    </Button>
                </div>

                {/* Printable Content */}
                <div
                    ref={componentRef}
                    className="print-container bg-white p-[15mm] shadow-2xl min-h-[297mm] w-[210mm] mx-auto text-sm leading-relaxed flex flex-col"
                >
                    <div className="print-content flex-1">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center gap-8">
                                <img src="/logo.png" alt="Logo" className="h-32 w-auto object-contain" />
                                <div className="flex flex-col justify-center">
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">OFFERT</h1>
                                    <p className="text-lg text-slate-700 font-medium mt-1">{config.companyName}</p>
                                    <div className="mt-6 space-y-2">
                                        <p className="text-sm text-slate-600">Datum: {config.offerDate}</p>
                                        <p className="text-sm text-slate-600">Offertnr: {config.offerNumber}</p>
                                        <p className="text-sm text-slate-600">Giltig t.o.m: {validUntilDate.toISOString().split('T')[0]}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="mb-4">
                                    <p className="font-bold text-gray-900">Kund:</p>
                                    <p>{config.customerName || 'Kundnamn'}</p>
                                    <p>{config.customerAddress1}</p>
                                    <p>{config.customerZip} {config.customerCity}</p>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full mb-8 border-collapse">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left py-2 font-bold">Beskrivning</th>
                                    {config.pricingMode === 'hourly' && (
                                        <th className="text-right py-2 font-bold w-24">Timmar</th>
                                    )}
                                    <th className="text-right py-2 font-bold w-32">Arbetskostnad</th>
                                    <th className="text-right py-2 font-bold w-32">Material</th>
                                    <th className="text-right py-2 font-bold w-32">Totalt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    const labor = calculateRowLabor(item, config);
                                    const total = labor + (item.materialCost || 0);
                                    return (
                                        <tr key={item.id} className="border-b border-gray-200">
                                            <td className="py-2">{item.descriptionSwedish || '-'}</td>
                                            {config.pricingMode === 'hourly' && (
                                                <td className="text-right py-2">{item.hours}</td>
                                            )}
                                            <td className="text-right py-2">{formatPrice(labor)} kr</td>
                                            <td className="text-right py-2">{formatPrice(item.materialCost || 0)} kr</td>
                                            <td className="text-right py-2">{formatPrice(total)} kr</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex flex-col items-end space-y-2 mt-8 border-t pt-4">
                            <div className="w-80 flex justify-between">
                                <span>Arbetskostnad:</span>
                                <span>{formatPrice(totals.totalLabor)} kr</span>
                            </div>
                            <div className="w-80 flex justify-between">
                                <span>Materialkostnad:</span>
                                <span>{formatPrice(totals.totalMaterial)} kr</span>
                            </div>
                            <div className="w-80 flex justify-between font-bold border-t pt-2">
                                <span>Delsumma:</span>
                                <span>{formatPrice(totals.subtotal)} kr</span>
                            </div>
                            <div className="w-80 flex justify-between text-gray-500">
                                <span>Moms ({(config.vatRate || 0) * 100}%):</span>
                                <span>{formatPrice(totals.vat)} kr</span>
                            </div>
                            <div className="w-80 flex justify-between font-bold text-lg border-t border-black pt-2">
                                <span>Att betala:</span>
                                <span>{formatPrice(totals.totalWithVat)} kr</span>
                            </div>

                            {config.useRot && (
                                <div className="w-80 mt-4 pt-2 border-t border-dashed border-gray-300">
                                    <div className="flex justify-between text-green-600">
                                        <span>ROT-avdrag (30%):</span>
                                        <span>-{formatPrice(totals.rotDeduction)} kr</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl mt-2">
                                        <span>Att betala efter ROT:</span>
                                        <span className="whitespace-nowrap">{formatPrice(totals.totalToPay)} kr</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer - Now at bottom using flexbox */}
                    <div className="print-footer border-t pt-4 mt-auto">
                        <div className="flex justify-center gap-4 flex-wrap text-xs text-gray-500">
                            <span>Telefon: 076-313 25 01</span>
                            <span>|</span>
                            <span>Hemsida: www.jsbyggsnickeri.se</span>
                            <span>|</span>
                            <span>E-post: jsjonasbygg77@gmail.com</span>
                            <span>|</span>
                            <span>Innehar F-skatt</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
