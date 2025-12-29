export default function StatWidget({
    title,
    value,
    delta,
    positive = true,
    icon,
}) {
    return (
        <div className="bg-white shadow-sm rounded-2xl p-5 flex justify-between items-center">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>

                <div className="flex items-end gap-2 mt-1 text-black">
                    <h2 className="text-3xl font-semibold">{value}</h2>

                    {delta !== undefined && (
                        <span
                            className={`text-md ${positive ? "text-green-600" : "text-red-500"
                                }`}
                        >
                            {positive ? "+" : "-"}
                            {delta} %
                        </span>
                    )}
                </div>
            </div>

            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--background)]">
                {icon}
            </div>
        </div>
    );
}
