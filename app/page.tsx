"use client";

import { useEffect, useState } from "react";
import { useOfferStore } from "@/store/offer-store";
import { ConfigPanel } from "@/components/offer-builder/config-panel";
import { HistorySidebar } from "@/components/history-sidebar";
import { InputRow } from "@/components/offer-builder/input-row";
import { DocumentView } from "@/components/offer-preview/document-view";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Plus, PanelLeftOpen } from "lucide-react";
import { translations } from "@/lib/i18n";

export default function Home() {
    const { items, addItem, config, saveCurrentOffer, language, setLanguage, selectedOfferId } = useOfferStore();
    const t = translations[language];
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Auto-save logic
    useEffect(() => {
        if (!selectedOfferId) return;

        const timeout = setTimeout(() => {
            saveCurrentOffer();
        }, 1000);

        return () => clearTimeout(timeout);
    }, [items, config, saveCurrentOffer, selectedOfferId]); // Dependency on data that needs saving



    return (
        <div className="h-screen bg-gray-950 flex font-sans text-gray-100 overflow-hidden">
            {/* Sidebar (Fully controlled) */}
            <HistorySidebar
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(false)}
            />

            {/* Main Layout (Flex Column) */}
            <div className="flex-1 flex flex-col min-w-0 h-full">

                {/* Header */}
                <header className="bg-gray-900 border-b border-gray-800 flex-shrink-0 z-10 shadow-sm relative">
                    {/* Toggle Button - Absolute Left */}
                    {!isSidebarOpen && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(true)}
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                                title="Open Sidebar"
                            >
                                <PanelLeftOpen className="w-6 h-6" />
                            </Button>
                        </div>
                    )}

                    <div className="max-w-[1920px] mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Logo Removed as requested */}
                            <h1 className="text-xl font-bold tracking-tight text-white ml-8 md:ml-0">{t.appTitle}</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={language === 'sv' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setLanguage('sv')}
                                className={`rounded-full ${language !== 'sv' ? 'bg-transparent hover:bg-gray-800' : 'bg-gray-800 hover:bg-gray-700'} border border-gray-700`}
                                title="Svenska"
                            >
                                <span className="text-xl">🇸🇪</span>
                            </Button>
                            <Button
                                variant={language === 'lt' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setLanguage('lt')}
                                className={`rounded-full ${language !== 'lt' ? 'bg-transparent hover:bg-gray-800' : 'bg-gray-800 hover:bg-gray-700'} border border-gray-700`}
                                title="Lietuvių"
                            >
                                <span className="text-xl">🇱🇹</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-hidden">
                    {!selectedOfferId ? (
                        <EmptyState />
                    ) : (
                        <div className="h-full flex flex-col lg:flex-row">

                            {/* Builder Panel (Scrollable) */}
                            <div className="flex-1 max-w-3xl border-r border-gray-800 bg-gray-950 flex flex-col h-full overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                                    <div className="space-y-6 pb-20">
                                        <ConfigPanel />

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-lg font-semibold text-gray-200">{t.offerItems}</h2>
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
                                                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
                                                        <p>{t.noItems}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Panel */}
                            <div className="flex-1 bg-gray-900 h-full overflow-y-auto p-8 flex justify-center items-start">
                                <div className="sticky top-8 w-full max-w-[210mm]">
                                    <DocumentView />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
