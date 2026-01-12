"use client";

import { useEffect, useState } from "react";
import { useOfferStore } from "@/store/offer-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, FileText, Calendar, PanelLeftClose, Plus } from "lucide-react";
import { translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface HistorySidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export function HistorySidebar({ isOpen, onToggle }: HistorySidebarProps) {
    const {
        savedOffers,
        loadOffer,
        deleteOffer,
        loadFromStorage,
        language,
        config,
        addItem,
        resetOffer
    } = useOfferStore();
    const t = translations[language];
    const [searchQuery, setSearchQuery] = useState("");
    const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

    // Load offers from local storage on mount
    useEffect(() => {
        loadFromStorage();
    }, []);

    const filteredOffers = savedOffers.filter((offer) => {
        const query = searchQuery.toLowerCase();
        const clientName = offer.config.customerName?.toLowerCase() || "";
        const offerNumber = offer.config.offerNumber?.toLowerCase() || "";
        const date = offer.config.offerDate?.toLowerCase() || "";
        const address = offer.config.customerAddress1?.toLowerCase() || "";
        const city = offer.config.customerCity?.toLowerCase() || "";
        const zip = offer.config.customerZip?.toLowerCase() || "";

        return clientName.includes(query) ||
            offerNumber.includes(query) ||
            date.includes(query) ||
            address.includes(query) ||
            city.includes(query) ||
            zip.includes(query);
    });

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out overflow-hidden",
                isOpen ? "w-[260px] border-r border-gray-800" : "w-0 border-none opacity-0"
            )}
        >
            <div className="w-[260px] flex flex-col h-full relative">
                {/* Delete Confirmation Overlay - Global Fixed */}
                {offerToDelete && (
                    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl max-w-sm w-full transform transition-all scale-100">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="p-3 bg-red-900/20 rounded-full">
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-white">
                                        {language === 'sv' ? 'Radera offert?' : 'Ištrinti pasiūlymą?'}
                                    </h3>
                                    <p className="text-gray-400">
                                        {language === 'sv'
                                            ? 'Är du säker? Detta går inte att ångra.'
                                            : 'Ar tikrai? Šio veiksmo negalima atšaukti.'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
                                    onClick={() => setOfferToDelete(null)}
                                >
                                    {language === 'sv' ? 'Avbryt' : 'Atšaukti'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                                    onClick={() => {
                                        if (offerToDelete) {
                                            deleteOffer(offerToDelete);
                                            setOfferToDelete(null);
                                        }
                                    }}
                                >
                                    {language === 'sv' ? 'Radera' : 'Ištrinti'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-3 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <Button
                            onClick={resetOffer}
                            variant="ghost"
                            className="flex-1 justify-start gap-2 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-700/50 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-medium">{language === 'sv' ? 'Ny offert' : 'Naujas pasiūlymas'}</span>
                        </Button>

                        <Button
                            onClick={onToggle}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-gray-800 ml-2"
                            title={language === 'sv' ? 'Stäng sidofält' : 'Uždaryti'}
                        >
                            <PanelLeftClose className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder={language === 'sv' ? 'Sök...' : 'Ieškoti...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-gray-800 border-transparent text-gray-100 placeholder:text-gray-500 focus-visible:ring-gray-700"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar pb-8">
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
                        {language === 'sv' ? 'Dina offerter' : 'Jūsų pasiūlymai'}
                    </div>
                    {filteredOffers.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-500">
                            {searchQuery
                                ? (language === 'sv' ? 'Inga träffar' : 'Nerasta')
                                : (language === 'sv' ? 'Tomt' : 'Tuščia')
                            }
                        </div>
                    ) : (
                        filteredOffers.map((offer) => (
                            <div
                                key={offer.id}
                                className={cn(
                                    "group relative p-2.5 rounded-lg text-sm transition-colors cursor-pointer",
                                    config.offerNumber === offer.config.offerNumber
                                        ? "bg-gray-800 text-white"
                                        : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                                )}
                                onClick={() => loadOffer(offer.id)}
                            >
                                <div className="truncate pr-6">
                                    <span className="font-medium">{offer.config.customerName || (language === 'sv' ? 'Namnlös Kund' : 'Klientas be vardo')}</span>
                                    <span className="text-gray-500"> | {offer.config.offerNumber}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-1.5 right-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOfferToDelete(offer.id);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
