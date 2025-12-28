import { CheckCircle, XCircle } from "lucide-react";
import { ReviewStatusBadge } from "./ReviewStatusBadge";

export const StatusBadge = ({ isActive, isVat = false }) => (
    <div className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200">
        {isActive ? (
            <>
                <div className="p-1.5 rounded-full bg-green/10 shrink-0">
                    <CheckCircle className="w-5 h-5 text-green" />
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
                <div className="p-1.5 rounded-full bg-destructive/10 shrink-0">
                    <XCircle className="w-5 h-5 text-destructive" />
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
