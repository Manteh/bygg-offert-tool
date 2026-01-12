import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { OfferItem, OfferConfig } from '@/types';
import { formatPrice } from '@/lib/utils';
import { calculateRowLabor } from '@/lib/calculations';

// Register fonts if needed, but standard Helvetica is usually fine for basic matching.
// For "font-black" we might need to register a custom font or use Helvetica-Bold.
// React-PDF standard fonts: Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique.

const styles = StyleSheet.create({
    page: {
        padding: 50, // Approx 15mm ~ 42pt, but 50pt gives good breathing room
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155', // slate-700 base
        lineHeight: 1.5,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40, // mb-12 ~ 48px
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20, // gap-8 ~ 32px
    },
    logo: {
        width: 100, // h-32 ~ 128px, but constrained by PDF page width usually
        height: 80,
        objectFit: 'contain',
    },
    headerTextContainer: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 30, // text-4xl
        fontFamily: 'Helvetica-Bold', // font-black
        color: '#0f172a', // slate-900
        textTransform: 'uppercase',
        letterSpacing: -1, // tracking-tighter
        marginBottom: 4,
    },
    companyName: {
        fontSize: 14, // text-lg
        fontFamily: 'Helvetica-Bold', // font-medium
        color: '#334155', // slate-700
        marginBottom: 15, // mt-1 + mt-6 spacing
    },
    metadataContainer: {
        gap: 4, // space-y-2
    },
    metadataText: {
        fontSize: 10, // text-sm
        color: '#475569', // slate-600
    },
    headerRight: {
        alignItems: 'flex-start', // text-right in HTML but flex items align
        gap: 2, // space-y-1
    },
    customerLabel: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#0f172a', // gray-900
        marginBottom: 10, // mb-4
    },
    customerText: {
        fontSize: 10,
        color: '#334155',
    },

    // Table
    table: {
        width: '100%',
        marginBottom: 30, // mb-8
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#000000',
        paddingBottom: 8, // py-2
        marginBottom: 8,
    },
    tableHeaderCell: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: '#000000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb', // gray-200
        paddingVertical: 8, // py-2
    },
    tableCell: {
        fontSize: 10,
        color: '#334155',
    },
    // Column widths matching HTML w-24 (6rem~96px), w-32 (8rem~128px)
    colDesc: { flex: 1, textAlign: 'left' },
    colHours: { width: 60, textAlign: 'right' },
    colLabor: { width: 80, textAlign: 'right' },
    colMaterial: { width: 80, textAlign: 'right' },
    colTotal: { width: 80, textAlign: 'right' },

    // Totals
    totalsContainer: {
        alignSelf: 'flex-end',
        width: 250, // w-80 ~ 320px, adjusted for PDF scale
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb', // border-t
        paddingTop: 15, // pt-4
        gap: 5, // space-y-2
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 10,
        color: '#334155',
    },
    totalValue: {
        fontSize: 10,
        color: '#334155',
        fontFamily: 'Helvetica',
    },
    subtotalRow: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 8,
        marginTop: 5,
    },
    subtotalText: {
        fontFamily: 'Helvetica-Bold',
    },
    vatRow: {
        color: '#6b7280', // gray-500
    },
    finalTotalRow: {
        borderTopWidth: 1,
        borderTopColor: '#000000',
        paddingTop: 8,
        marginTop: 5,
    },
    finalTotalText: {
        fontSize: 12, // text-lg
        fontFamily: 'Helvetica-Bold',
    },
    rotContainer: {
        marginTop: 15, // mt-4
        paddingTop: 8, // pt-2
        borderTopWidth: 1,
        borderTopColor: '#d1d5db', // gray-300
        borderStyle: 'dashed',
    },
    rotRow: {
        color: '#16a34a', // green-600
    },
    rotTotalRow: {
        marginTop: 8, // mt-2
    },
    rotTotalText: {
        fontSize: 14, // text-xl
        fontFamily: 'Helvetica-Bold',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 40, // bottom-[15mm]
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 15,
    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
    },
    footerText: {
        fontSize: 8, // text-xs
        color: '#6b7280', // gray-500
    },
});

interface OfferPDFProps {
    items: OfferItem[];
    config: OfferConfig;
    totals: any;
}

export const OfferPDF = ({ items, config, totals }: OfferPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image src="/logo.png" style={styles.logo} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>OFFERT</Text>
                        <Text style={styles.companyName}>{config.companyName}</Text>
                        <View style={styles.metadataContainer}>
                            <Text style={styles.metadataText}>Datum: {config.offerDate}</Text>
                            <Text style={styles.metadataText}>Offertnr: {config.offerNumber}</Text>
                            <Text style={styles.metadataText}>Giltig t.o.m: {new Date(new Date(config.offerDate).setDate(new Date(config.offerDate).getDate() + 14)).toISOString().split('T')[0]}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.customerLabel}>Kund:</Text>
                    <Text style={styles.customerText}>{config.customerName || 'Kundnamn'}</Text>
                    <Text style={styles.customerText}>{config.customerAddress1}</Text>
                    <Text style={styles.customerText}>{config.customerZip} {config.customerCity}</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderCell, styles.colDesc]}>Beskrivning</Text>
                    {config.pricingMode === 'hourly' && (
                        <Text style={[styles.tableHeaderCell, styles.colHours]}>Timmar</Text>
                    )}
                    <Text style={[styles.tableHeaderCell, styles.colLabor]}>Arbetskostnad</Text>
                    <Text style={[styles.tableHeaderCell, styles.colMaterial]}>Material</Text>
                    <Text style={[styles.tableHeaderCell, styles.colTotal]}>Totalt</Text>
                </View>
                {items.map((item) => {
                    const labor = calculateRowLabor(item, config);
                    const total = labor + (item.materialCost || 0);
                    return (
                        <View key={item.id} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.colDesc]}>{item.descriptionSwedish || '-'}</Text>
                            {config.pricingMode === 'hourly' && (
                                <Text style={[styles.tableCell, styles.colHours]}>{item.hours}</Text>
                            )}
                            <Text style={[styles.tableCell, styles.colLabor]}>{formatPrice(labor)} kr</Text>
                            <Text style={[styles.tableCell, styles.colMaterial]}>{formatPrice(item.materialCost || 0)} kr</Text>
                            <Text style={[styles.tableCell, styles.colTotal]}>{formatPrice(total)} kr</Text>
                        </View>
                    );
                })}
            </View>

            {/* Totals */}
            <View style={styles.totalsContainer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Arbetskostnad:</Text>
                    <Text style={styles.totalValue}>{formatPrice(totals.totalLabor)} kr</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Materialkostnad:</Text>
                    <Text style={styles.totalValue}>{formatPrice(totals.totalMaterial)} kr</Text>
                </View>
                <View style={[styles.totalRow, styles.subtotalRow]}>
                    <Text style={[styles.totalLabel, styles.subtotalText]}>Delsumma:</Text>
                    <Text style={[styles.totalValue, styles.subtotalText]}>{formatPrice(totals.subtotal)} kr</Text>
                </View>
                <View style={[styles.totalRow, styles.vatRow]}>
                    <Text style={styles.totalLabel}>Moms (25%):</Text>
                    <Text style={styles.totalValue}>{formatPrice(totals.vat)} kr</Text>
                </View>
                <View style={[styles.totalRow, styles.finalTotalRow]}>
                    <Text style={[styles.totalLabel, styles.finalTotalText]}>Att betala:</Text>
                    <Text style={[styles.totalValue, styles.finalTotalText]}>{formatPrice(totals.totalWithVat)} kr</Text>
                </View>

                {config.useRot && (
                    <View style={styles.rotContainer}>
                        <View style={[styles.totalRow, styles.rotRow]}>
                            <Text style={styles.totalLabel}>ROT-avdrag (30%):</Text>
                            <Text style={styles.totalValue}>-{formatPrice(totals.rotDeduction)} kr</Text>
                        </View>
                        <View style={[styles.totalRow, styles.rotTotalRow]}>
                            <Text style={[styles.totalLabel, styles.rotTotalText]}>Att betala efter ROT:</Text>
                            <Text style={[styles.totalValue, styles.rotTotalText]}>{formatPrice(totals.totalToPay)} kr</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <Text style={styles.footerText}>Telefon: 076-313 25 01</Text>
                    <Text style={styles.footerText}>|</Text>
                    <Text style={styles.footerText}>Hemsida: www.jsbyggsnickeri.se</Text>
                    <Text style={styles.footerText}>|</Text>
                    <Text style={styles.footerText}>E-post: jsjonasbygg77@gmail.com</Text>
                    <Text style={styles.footerText}>|</Text>
                    <Text style={styles.footerText}>Innehar F-skatt</Text>
                </View>
            </View>
        </Page>
    </Document>
);
