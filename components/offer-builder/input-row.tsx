"use client";

import { useState, useEffect } from "react";
import { useOfferStore } from "@/store/offer-store";
import { OfferItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Languages } from "lucide-react";
import { calculateRowLabor } from "@/lib/calculations";
import { translations } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

interface InputRowProps {
    item: OfferItem;
}

export function InputRow({ item }: InputRowProps) {
    const { updateItem, removeItem, config, language } = useOfferStore();
    const t = translations[language];
    const [isTranslating, setIsTranslating] = useState(false);

    // AI Translation
    const handleTranslate = async () => {
        if (!item.descriptionLithuanian) return;

        setIsTranslating(true);
        try {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: item.descriptionLithuanian,
                    targetLanguage: 'sv',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.translatedText) {
                    updateItem(item.id, { descriptionSwedish: data.translatedText });
                }
            }
        } catch (error) {
            console.error('Failed to translate:', error);
        } finally {
            setIsTranslating(false);
        }
    };

    const laborCost = calculateRowLabor(item, config);

    return (
        <div className="group relative grid grid-cols-12 gap-4 items-start p-4 rounded-xl bg-gray-900 border border-gray-800 shadow-sm hover:shadow-md hover:border-gray-700 transition-all duration-200">
            {/* Delete Button - Absolute Positioned */}
            <button
                onClick={() => removeItem(item.id)}
                className="absolute -right-2 -top-2 bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full p-1 shadow-sm border border-gray-700 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                title={t.deleteItem}
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <div className="col-span-12 md:col-span-5 space-y-3">
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">{t.descLt}</div>
                    <Input
                        placeholder={t.descLt}
                        value={item.descriptionLithuanian}
                        onChange={(e) => updateItem(item.id, { descriptionLithuanian: e.target.value })}
                        className="min-h-[40px] bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-700 focus:ring-1 focus:ring-primary/20"
                    />
                </div>
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">{t.descSv}</div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                placeholder={t.descSv}
                                value={item.descriptionSwedish}
                                onChange={(e) => updateItem(item.id, { descriptionSwedish: e.target.value })}
                                className="min-h-[40px] bg-gray-950/50 border-gray-800 text-gray-100 placeholder:text-gray-700 focus:ring-1 focus:ring-primary/20"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleTranslate}
                            disabled={isTranslating || !item.descriptionLithuanian}
                            title={t.translate}
                            className="shrink-0 border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                        >
                            {isTranslating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Languages className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {config.pricingMode !== 'materials' && (
                <div className="col-span-12 md:col-span-3 space-y-3">
                    <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-500">
                            {config.pricingMode === 'hourly' ? t.hours : 'Pris'}
                        </div>
                        {config.pricingMode === 'hourly' ? (
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={item.hours ?? ''}
                                    onChange={(e) => updateItem(item.id, { hours: e.target.value === '' ? null : Number(e.target.value) })}
                                    className="font-mono text-right bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-700"
                                />
                                <div className="text-[10px] text-gray-500 text-right mt-1">
                                    {formatPrice(laborCost)} kr
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={item.fixedLaborCost ?? ''}
                                    onChange={(e) => updateItem(item.id, { fixedLaborCost: e.target.value === '' ? null : Number(e.target.value) })}
                                    className="font-mono text-right bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-700"
                                />
                                <div className="text-[10px] text-gray-500 text-right mt-1">
                                    Fastpris
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className={`col-span-12 ${config.pricingMode === 'materials' ? 'md:col-span-7' : 'md:col-span-4'} space-y-3`}>
                <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">{config.pricingMode === 'materials' ? 'Kostnad' : t.material}</div>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0"
                            value={item.materialCost ?? ''}
                            onChange={(e) => updateItem(item.id, { materialCost: e.target.value === '' ? null : Number(e.target.value) })}
                            className="font-mono text-right pr-12 bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-700"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">kr</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
