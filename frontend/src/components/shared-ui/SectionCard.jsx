import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SectionCard = ({ title, icon: TitleIcon, children, className = "" }) => (
    <Card className={`shadow-sm hover:shadow-md transition-shadow ${className}`}>
        <CardHeader className="border-b bg-muted/20">
            <CardTitle className="text-base flex items-center gap-2 font-semibold">
                {TitleIcon && (
                    <div className="p-1.5 rounded-md bg-muted/30">
                        <TitleIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                )}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-1">
            {children}
        </CardContent>
    </Card>
);