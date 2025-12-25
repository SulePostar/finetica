import { Building2, Calendar, Mail, MapPin, Phone, User, CreditCard, Globe, FileText, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { formatDateTime } from "@/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { ReviewStatusBadge } from "../shared-ui/ReviewStatusBadge";
import { SectionItem } from "../shared-ui/SectionItem";
import { SectionCard } from "../shared-ui/SectionCard";

const StatusBadge = ({ isActive, isVat = false }) => (
    <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
        {isActive ? (
            <>
                <div className="p-1.5 rounded-full bg-green-500/10 shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                        {isVat ? 'VAT Status' : 'Account Status'}
                    </p>
                    <div className="mt-1">
                        <ReviewStatusBadge status={isVat ? "vat registered" : "active"} />
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className="p-1.5 rounded-full bg-red-500/10 shrink-0">
                    <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                        {isVat ? 'VAT Status' : 'Account Status'}
                    </p>
                    <div className="mt-1">
                        <ReviewStatusBadge status={isVat ? 'Not Registered' : 'Inactive'} />
                    </div>
                </div>
            </>
        )}
    </div>
);

export const PartnerInfo = ({ partner }) => {
    const partnerData = partner?.data || partner;

    const getPartnerTypeBadge = (type) => {
        const config = {
            customer: {
                color: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
            },
            supplier: {
                color: "bg-spurple text-white border-spurple hover:bg-spurple/90"
            },
            both: {
                color: "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
            }
        };
        const { color } = config[type] || config.customer;
        return (
            <Badge className={`capitalize font-semibold ${color} shadow-sm text-[10px] sm:text-xs`}>
                {type?.toUpperCase()}
            </Badge>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-w-[200px]">
            <SectionCard title="Basic Information">
                <SectionItem
                    icon={Building2}
                    label="Company Name"
                    value={partnerData?.name}
                />
                <SectionItem
                    icon={Briefcase}
                    label="Short Name"
                    value={partnerData?.shortName}
                />
                <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 mt-2 group">
                    <div className="p-1.5 rounded-md bg-spurple/10 group-hover:bg-spurple/15 transition-colors shrink-0">
                        <User className="w-5 h-5 text-spurple" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 truncate">Partner Type</p>
                        {partnerData?.type ? getPartnerTypeBadge(partnerData.type) : '—'}
                    </div>
                </div>
                <StatusBadge isActive={partnerData?.isActive} />
            </SectionCard>

            <SectionCard title="Contact Information">
                <div className="[&>div_p:last-child]:break-all">
                    <SectionItem icon={Mail} label="Email" value={partnerData?.email} />
                </div>
                <SectionItem icon={Phone} label="Phone" value={partnerData?.phone} />
                <SectionItem icon={Globe} label="Country Code" value={partnerData?.countryCode?.toUpperCase()} />
                <SectionItem icon={Globe} label="Language" value={partnerData?.languageCode?.toUpperCase()} />
            </SectionCard>

            <SectionCard title="Address & Location">
                <SectionItem icon={MapPin} label="Address" value={partnerData?.address} />
                <SectionItem icon={MapPin} label="City" value={partnerData?.city} />
                <SectionItem icon={MapPin} label="Postal Code" value={partnerData?.postalCode} />
                <SectionItem icon={Globe} label="Country" value={partnerData?.countryCode?.toUpperCase()} />
            </SectionCard>

            <SectionCard title="Tax & Registration">
                <SectionItem icon={FileText} label="VAT Number" value={partnerData?.vatNumber} />
                <SectionItem icon={FileText} label="Tax ID" value={partnerData?.taxId} />
                <SectionItem icon={FileText} label="Registration Number" value={partnerData?.registrationNumber} />
                <StatusBadge isActive={partnerData?.isVatRegistered} isVat={true} />
            </SectionCard>

            <SectionCard title="Banking Details">
                <div className="[&>div_p:last-child]:break-all">
                    <SectionItem icon={CreditCard} label="IBAN" value={partnerData?.iban} />
                </div>
                <SectionItem icon={Building2} label="Bank Name" value={partnerData?.bankName} />
                <SectionItem icon={CreditCard} label="SWIFT Code" value={partnerData?.swiftCode?.toUpperCase()} />
                <SectionItem icon={Globe} label="Default Currency" value={partnerData?.defaultCurrency?.toUpperCase()} />
            </SectionCard>

            {partnerData?.paymentTerms && (
                <SectionCard title="Payment Terms">
                    <div className="p-4 rounded-lg bg-muted/20 border">
                        <p className="text-sm font-semibold text-foreground">
                            {partnerData.paymentTerms} days
                        </p>
                    </div>
                </SectionCard>
            )}

            {partnerData?.note && (
                <SectionCard title="Notes" className="md:col-span-2">
                    <div className="p-4 rounded-lg bg-muted/30 border">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed break-words">
                            {partnerData.note}
                        </p>
                    </div>
                </SectionCard>
            )}

            <SectionCard title="Timestamps" className="md:col-span-2">
                <SectionItem
                    icon={Calendar}
                    label="Created At"
                    value={partnerData?.created_at ? formatDateTime(partnerData.created_at) : '—'}
                />
                <SectionItem
                    icon={Calendar}
                    label="Updated At"
                    value={partnerData?.updated_at ? formatDateTime(partnerData.updated_at) : '—'}
                />
            </SectionCard>
        </div>
    );
};