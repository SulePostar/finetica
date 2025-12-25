import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, Mail, MapPin, Phone, User, CreditCard, Globe, FileText, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { formatDateTime } from "@/helpers/formatDate";
import { Badge } from "@/components/ui/badge";
import { ReviewStatusBadge } from "../shared-ui/ReviewStatusBadge";

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
        <div className="p-2 rounded-md bg-spurple/10 group-hover:bg-spurple/15 transition-colors">
            <Icon className="w-5 h-5 text-spurple" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-0.5 uppercase tracking-wider">{label}</p>
            <p className="text-sm text-primary font-medium break-words">{value || '—'}</p>
        </div>
    </div>
);

const StatusBadge = ({ isActive, isVat = false }) => (
    <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
        {isActive ? (
            <>
                <div className="p-1.5 rounded-full bg-green-500/10">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 w-[400px]">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {isVat ? 'VAT Status' : 'Account Status'}
                    </p>
                    <ReviewStatusBadge status={isVat ? "vat registered" : "active"} />
                </div>
            </>
        ) : (
            <>
                <div className="p-1.5 rounded-full bg-red-500/10">
                    <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {isVat ? 'VAT Status' : 'Account Status'}
                    </p>
                    <ReviewStatusBadge status={isVat ? 'Not Registered' : 'Inactive'} />
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
            <Badge className={`capitalize font-semibold ${color} shadow-sm`}>
                {type.toUpperCase()}
            </Badge>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem
                        icon={Building2}
                        label="Company Name"
                        value={partnerData?.name}
                    />
                    <InfoItem
                        icon={Briefcase}
                        label="Short Name"
                        value={partnerData?.shortName}
                    />
                    <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 mt-2 group">
                        <div className="p-1.5 rounded-md bg-spurple/10 group-hover:bg-spurple/15 transition-colors">
                            <User className="w-5 h-5 text-spurple" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Partner Type</p>
                            {partnerData?.type ? getPartnerTypeBadge(partnerData.type) : '—'}
                        </div>
                    </div>
                    <StatusBadge isActive={partnerData?.isActive} />
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem icon={Mail} label="Email" value={partnerData?.email} />
                    <InfoItem icon={Phone} label="Phone" value={partnerData?.phone} />
                    <InfoItem icon={Globe} label="Country Code" value={partnerData?.countryCode} />
                    <InfoItem icon={Globe} label="Language" value={partnerData?.languageCode} />
                </CardContent>
            </Card>

            {/* Address & Location */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        Location
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem icon={MapPin} label="Address" value={partnerData?.address} />
                    <InfoItem icon={MapPin} label="City" value={partnerData?.city} />
                    <InfoItem icon={MapPin} label="Postal Code" value={partnerData?.postalCode} />
                    <InfoItem icon={Globe} label="Country" value={partnerData?.countryCode} />
                </CardContent>
            </Card>

            {/* Tax & Registration */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        Tax & Registration
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem icon={FileText} label="VAT Number" value={partnerData?.vatNumber} />
                    <InfoItem icon={FileText} label="Tax ID" value={partnerData?.taxId} />
                    <InfoItem icon={FileText} label="Registration Number" value={partnerData?.registrationNumber} />
                    <StatusBadge isActive={partnerData?.isVatRegistered} isVat={true} />
                </CardContent>
            </Card>

            {/* Banking Details */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        Banking Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem icon={CreditCard} label="IBAN" value={partnerData?.iban} />
                    <InfoItem icon={Building2} label="Bank Name" value={partnerData?.bankName} />
                    <InfoItem icon={CreditCard} label="SWIFT Code" value={partnerData?.swiftCode} />
                    <InfoItem icon={Globe} label="Default Currency" value={partnerData?.defaultCurrency} />
                </CardContent>
            </Card>

            {/* Payment Terms */}
            {partnerData?.paymentTerms && (
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="text-base flex items-center gap-2 font-semibold">
                            Payment Terms
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="p-4 rounded-lg bg-muted/20 border">
                            <p className="text-sm font-semibold text-foreground">
                                {partnerData.paymentTerms} days
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {partnerData?.note && (
                <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                    <CardHeader className="border-b bg-muted/20">
                        <CardTitle className="text-base flex items-center gap-2 font-semibold">
                            <div className="p-1.5 rounded-md bg-muted/30">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                            </div>
                            Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="p-4 rounded-lg bg-muted/30 border">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {partnerData.note}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timestamps */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-base flex items-center gap-2 font-semibold">
                        <div className="p-1.5 rounded-md bg-muted/30">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        Record Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                    <InfoItem
                        icon={Calendar}
                        label="Created At"
                        value={partnerData?.created_at ? formatDateTime(partnerData.created_at) : '—'}
                    />
                    <InfoItem
                        icon={Calendar}
                        label="Updated At"
                        value={partnerData?.updated_at ? formatDateTime(partnerData.updated_at) : '—'}
                    />
                </CardContent>
            </Card>
        </div>
    );
};