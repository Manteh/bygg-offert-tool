"use client";

import { useOfferStore } from "@/store/offer-store";
import { ConfigPanel } from "@/components/offer-builder/config-panel";
import { InputRow } from "@/components/offer-builder/input-row";
import { DocumentView } from "@/components/offer-preview/document-view";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { translations } from "@/lib/i18n";

export default function Home() {
    const { items, addItem, language, setLanguage } = useOfferStore();
    const t = translations[language];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            {/* Simple Icon Placeholder */}
                            <div className="w-6 h-6 bg-primary rounded-sm" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">{t.appTitle}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={language === 'sv' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setLanguage('sv')}
                            className="font-medium"
                        >
                            🇸🇪 Svenska
                        </Button>
                        <Button
                            variant={language === 'lt' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setLanguage('lt')}
                            className="font-medium"
                        >
                            🇱🇹 Lietuvių
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-[1600px] mx-auto w-full p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-7rem)]">

                    {/* Left Panel: Builder (Scrollable) */}
                    <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-10 no-scrollbar">
                        <ConfigPanel />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-800">{t.offerItems}</h2>
                                <Button onClick={addItem} size="sm" className="shadow-sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t.addItem}
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {items.map((item) => (
                                    <InputRow key={item.id} item={item} />
                                ))}
                                {items.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                                        <p>{t.noItems}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Preview (Sticky/Fixed) */}
                    <div className="lg:col-span-7 bg-gray-100/50 rounded-2xl border border-gray-200 p-8 overflow-y-auto flex justify-center items-start shadow-inner">
                        <DocumentView />
                    </div>
                </div>
            </main>
        </div>
    );
}
