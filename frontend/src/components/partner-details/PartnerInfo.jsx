import { Building2, Calendar, Mail, MapPin, Phone, User, CreditCard, Globe, FileText, Briefcase } from "lucide-react";
import { formatDateTime } from "@/helpers/formatDate";
import { SectionCard } from "../shared-ui/SectionCard";
import { StatusBadge } from "../shared-ui/PartnerStatusBadge";
import { getPartnerTypeBadge } from "../shared-ui/PartnerBadge";

export const PartnerInfo = ({ partner }) => {
    const data = partner?.data;
    const basicItems = [
        { icon: Building2, label: "Company Name", value: data?.name },
        { icon: Briefcase, label: "Short Name", value: data?.shortName }
    ];

    const contactItems = [
        { icon: Mail, label: "Email", value: data?.email, className: "[&>div_p:last-child]:break-all" },
        { icon: Phone, label: "Phone", value: data?.phone },
        { icon: Globe, label: "Country Code", value: data?.countryCode?.toUpperCase() },
        { icon: Globe, label: "Language", value: data?.languageCode?.toUpperCase() }
    ];

    const addressItems = [
        { icon: MapPin, label: "Address", value: data?.address },
        { icon: MapPin, label: "City", value: data?.city },
        { icon: MapPin, label: "Postal Code", value: data?.postalCode },
        { icon: Globe, label: "Country", value: data?.countryCode?.toUpperCase() }
    ];

    const taxItems = [
        { icon: FileText, label: "VAT Number", value: data?.vatNumber },
        { icon: FileText, label: "Tax ID", value: data?.taxId },
        { icon: FileText, label: "Registration Number", value: data?.registrationNumber }
    ];

    const bankingItems = [
        { icon: CreditCard, label: "IBAN", value: data?.iban, className: "[&>div_p:last-child]:break-all" },
        { icon: Building2, label: "Bank Name", value: data?.bankName },
        { icon: CreditCard, label: "SWIFT Code", value: data?.swiftCode?.toUpperCase() },
        { icon: Globe, label: "Default Currency", value: data?.defaultCurrency?.toUpperCase() }
    ];

    const timestampItems = [
        { icon: Calendar, label: "Created At", value: data?.created_at ? formatDateTime(data.created_at) : '—' },
        { icon: Calendar, label: "Updated At", value: data?.updated_at ? formatDateTime(data.updated_at) : '—' }
    ];

    const sections = [
        {
            title: "Basic Information",
            items: basicItems,
            children: (
                <>
                    <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 mt-2 group">
                        <div className="p-1.5 rounded-md bg-spurple/10 group-hover:bg-spurple/15 transition-colors shrink-0">
                            <User className="w-5 h-5 text-spurple" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 truncate">Partner Type</p>
                            {data?.type ? getPartnerTypeBadge(data.type) : '—'}
                        </div>
                    </div>
                    <StatusBadge isActive={data?.isActive} />
                </>
            )
        },
        {
            title: "Contact Information",
            items: contactItems
        },
        {
            title: "Address & Location",
            items: addressItems
        },
        {
            title: "Tax & Registration",
            items: taxItems,
            children: <StatusBadge isActive={data?.isVatRegistered} isVat={true} />
        },
        {
            title: "Banking Details",
            items: bankingItems
        },
        data?.paymentTerms ? {
            title: "Payment Terms",
            children: (
                <div className="p-4 rounded-lg bg-muted/20 border">
                    <p className="text-sm font-semibold text-foreground">
                        {data.paymentTerms} days
                    </p>
                </div>
            )
        } : null,
        data?.note ? {
            title: "Notes",
            className: "md:col-span-2",
            children: (
                <div className="p-4 rounded-lg bg-muted/30 border">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
                        {data.note}
                    </p>
                </div>
            )
        } : null,
        {
            title: "Timestamps",
            className: "md:col-span-2",
            items: timestampItems
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-w-[200px]">
            {sections
                .filter(Boolean)
                .map((section, index) => (
                    <SectionCard
                        key={index}
                        title={section.title}
                        items={section.items}
                        className={section.className}
                    >
                        {section.children}
                    </SectionCard>
                ))}
        </div>
    );
};