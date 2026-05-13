"use client";

import { useOfferStore } from "@/store/offer-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { translations } from "@/lib/i18n";

export function ConfigPanel() {
    const { config, setConfig, language } = useOfferStore();
    const t = translations[language];

    return (
        <Card className="border border-gray-800 shadow-md bg-gray-900 text-gray-100">
            <CardContent className="grid gap-6 p-6">
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.pricingMode}</Label>
                    <div className="flex items-center gap-4 p-1 bg-gray-950 rounded-lg w-fit border border-gray-800">
                        <button
                            onClick={() => setConfig({ pricingMode: 'hourly' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${config.pricingMode === 'hourly'
                                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {t.hourlyMode}
                        </button>
                        <button
                            onClick={() => setConfig({ pricingMode: 'fixed' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${config.pricingMode === 'fixed'
                                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {t.fixedMode}
                        </button>
                        <button
                            onClick={() => setConfig({ pricingMode: 'materials' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${config.pricingMode === 'materials'
                                ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {t.materialsMode}
                        </button>
                    </div>
                </div>

                <div className={`grid gap-6 ${config.pricingMode === 'materials' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {config.pricingMode !== 'materials' && (
                        <div className="space-y-2">
                            <Label className="text-gray-300">{t.hourlyRate}</Label>
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={config.hourlyRate ?? ''}
                                    onChange={(e) => setConfig({ hourlyRate: e.target.value === '' ? null : Number(e.target.value) })}
                                    disabled={config.pricingMode === 'fixed'}
                                    className={`pr-16 bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700 ${config.pricingMode === 'fixed' ? 'opacity-50' : ''}`}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">SEK/h</span>
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-gray-300">{t.vatRate}</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="1"
                                value={config.vatRate ? Math.round(config.vatRate * 100) : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    setConfig({ vatRate: val === null ? null : val / 100 });
                                }}
                                className="pr-8 bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-800">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Kundinformation</Label>
                    <div className="space-y-2">
                        <Label className="text-gray-300">{t.customerName}</Label>
                        <Input
                            value={config.customerName}
                            onChange={(e) => setConfig({ customerName: e.target.value })}
                            className="bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700"
                            placeholder="T.ex. Anna Andersson"
                        />
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 space-y-2">
                            <Label className="text-gray-300">{t.customerAddress1}</Label>
                            <Input
                                value={config.customerAddress1}
                                onChange={(e) => setConfig({ customerAddress1: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700"
                                placeholder="Gatuadress"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label className="text-gray-300">{t.customerZip}</Label>
                            <Input
                                value={config.customerZip}
                                onChange={(e) => {
                                    // Strip non-digits and limit to 5 chars
                                    const raw = e.target.value.replace(/\D/g, '').slice(0, 5);
                                    // Format as "XXX XX"
                                    const formatted = raw.length > 3
                                        ? `${raw.slice(0, 3)} ${raw.slice(3)}`
                                        : raw;
                                    setConfig({ customerZip: formatted });
                                }}
                                className="bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700"
                                placeholder="123 45"
                                maxLength={6} // Account for space
                            />
                        </div>
                        <div className="col-span-4 space-y-2">
                            <Label className="text-gray-300">{t.customerCity}</Label>
                            <Input
                                value={config.customerCity}
                                onChange={(e) => setConfig({ customerCity: e.target.value })}
                                className="bg-gray-950 border-gray-800 text-gray-100 placeholder:text-gray-600 focus-visible:ring-gray-700"
                                placeholder="Stad"
                            />
                        </div>
                    </div>
                </div>

                {config.pricingMode !== 'materials' && <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
                    <Checkbox
                        id="rot"
                        checked={config.useRot}
                        onCheckedChange={(checked) => setConfig({ useRot: checked as boolean })}
                        className="h-5 w-5 border-gray-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="rot" className="font-medium cursor-pointer text-gray-300 hover:text-white transition-colors">{t.enableRot}</Label>
                </div>}
            </CardContent>
        </Card>
    );
}
