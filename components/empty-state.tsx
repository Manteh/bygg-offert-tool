"use client";

import { useOfferStore } from "@/store/offer-store";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

export function EmptyState() {
    const { resetOffer, language } = useOfferStore();

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-950 h-full">
            <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-500">

                <div className="mx-auto w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/10 ring-1 ring-gray-800">
                    <FileText className="w-10 h-10 text-gray-500" />
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        {language === 'sv' ? 'Välkommen till Bygg Offert' : 'Sveiki atvykę į Bygg Offert'}
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        {language === 'sv'
                            ? 'Välj en offert från historiken eller skapa en ny för att komma igång.'
                            : 'Pasirinkite pasiūlymą iš istorijos arba sukurkite naują.'
                        }
                    </p>
                </div>

                <div className="pt-8">
                    <Button
                        size="lg"
                        onClick={resetOffer}
                        className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        {language === 'sv' ? 'Skapa ny offert' : 'Kurti naują pasiūlymą'}
                    </Button>
                </div>

            </div>
        </div>
    );
}
