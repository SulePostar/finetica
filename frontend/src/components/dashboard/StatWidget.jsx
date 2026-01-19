export default function StatWidget({
    title,
    value,
    delta,
    positive = true,
    icon,
}) {
    return (
        <div className="bg-card shadow-sm rounded-2xl p-5 flex justify-between items-center">
            <div>
                <p className="text-muted-foreground text-sm">{title}</p>

                <div className="flex items-end gap-2 mt-1 text-card-foreground">
                    <h2 className="text-3xl font-semibold">{value}</h2>

                    {delta !== undefined && (
                        <span
                            className={`text-md ${positive ? "text-green" : "text-destructive"
                                }`}
                        >
                            {positive ? "+" : "-"}
                            {delta} %
                        </span>
                    )}
                </div>
            </div>

            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-background">
                {icon}
            </div>
        </div>
    );
}
