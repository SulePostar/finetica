import { Badge } from "@/components/ui/badge";

export const getPartnerTypeBadge = (type) => {
    const config = {
        customer: { color: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600" },
        supplier: { color: "bg-spurple text-white border-spurple hover:bg-spurple/90" },
        both: { color: "bg-amber-500 text-white border-amber-500 hover:bg-amber-600" }
    };
    const { color } = config[type] || config.customer;
    return (
        <Badge className={`capitalize font-semibold ${color} shadow-sm text-[10px] sm:text-xs`}>
            {type?.toUpperCase()}
        </Badge>
    );
};