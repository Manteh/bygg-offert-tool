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
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="grid gap-6 p-6">
                <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">{t.pricingMode}</Label>
                    <div className="flex items-center gap-4 p-1 bg-gray-100 rounded-lg w-fit">
                        <button
                            onClick={() => setConfig({ pricingMode: 'hourly' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${config.pricingMode === 'hourly'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t.hourlyMode}
                        </button>
                        <button
                            onClick={() => setConfig({ pricingMode: 'fixed' })}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${config.pricingMode === 'fixed'
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t.fixedMode}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>{t.hourlyRate}</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={config.hourlyRate ?? ''}
                                onChange={(e) => setConfig({ hourlyRate: e.target.value === '' ? null : Number(e.target.value) })}
                                disabled={config.pricingMode === 'fixed'}
                                className={`pr-16 ${config.pricingMode === 'fixed' ? 'opacity-50 bg-gray-50' : ''}`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">SEK/h</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t.vatRate}</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                step="1"
                                value={config.vatRate ? Math.round(config.vatRate * 100) : ''}
                                onChange={(e) => {
                                    const val = e.target.value === '' ? null : Number(e.target.value);
                                    setConfig({ vatRate: val === null ? null : val / 100 });
                                }}
                                className="pr-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Kundinformation</Label>
                    <div className="space-y-2">
                        <Label>{t.customerName}</Label>
                        <Input
                            value={config.customerName}
                            onChange={(e) => setConfig({ customerName: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 space-y-2">
                            <Label>{t.customerAddress1}</Label>
                            <Input
                                value={config.customerAddress1}
                                onChange={(e) => setConfig({ customerAddress1: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>{t.customerZip}</Label>
                            <Input
                                value={config.customerZip}
                                onChange={(e) => setConfig({ customerZip: e.target.value })}
                            />
                        </div>
                        <div className="col-span-4 space-y-2">
                            <Label>{t.customerCity}</Label>
                            <Input
                                value={config.customerCity}
                                onChange={(e) => setConfig({ customerCity: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t">
                    <Checkbox
                        id="rot"
                        checked={config.useRot}
                        onCheckedChange={(checked) => setConfig({ useRot: checked as boolean })}
                        className="h-5 w-5"
                    />
                    <Label htmlFor="rot" className="font-medium cursor-pointer">{t.enableRot}</Label>
                </div>
            </CardContent>
        </Card>
    );
}
