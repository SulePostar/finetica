import { useState } from "react";
import { FileText, CreditCard, FileCheck, FileSignature } from "lucide-react";
import { cn } from "@/lib/utils";

const InvalidPdfs = () => {
    const [activeTab, setActiveTab] = useState("bank");
    const tabs = [
        { id: "bank", label: "Bank Transactions", icon: FileText },
        { id: "kif", label: "KIF", icon: CreditCard },
        { id: "kuf", label: "KUF", icon: FileCheck },
        { id: "contracts", label: "Contracts", icon: FileSignature },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full">
                <div className="min-h-[85vh] mt-4 mb-4 bg-secondary dark:bg-secondary text-foreground p-4 sm:p-6 md:p-6 xl:p-8 transition-colors rounded-lg">
                    <h1 className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl font-bold text-spurple mb-3 sm:mb-4 md:mb-4 xl:mb-6">
                        PDF Issues
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 xl:gap-4 mb-3 sm:mb-4 md:mb-4 xl:mb-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 xl:px-5 xl:py-3 rounded-lg font-medium transition-all w-full sm:w-auto cursor-pointer",
                                        activeTab === tab.id
                                            ? "bg-spurple text-white shadow-md shadow-spurple/30"
                                            : "bg-secondary text-secondary-foreground hover:bg-ring/10 dark:bg-secondary dark:text-foreground dark:hover:bg-gray-background"
                                    )}
                                >
                                    <Icon className="w-4 h-4 xl:w-5 xl:h-5" />
                                    <span className="text-sm sm:text-sm xl:text-base">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-card dark:bg-light-gray border border-border rounded-xl p-4 sm:p-6 md:p-6 xl:p-8 min-h-[500px] sm:min-h-[600px] xl:min-h-[700px] flex items-center justify-center transition-colors">
                        <p className="text-muted-foreground dark:text-foreground text-center text-sm sm:text-base xl:text-lg">
                            There are no {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} records to display
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvalidPdfs;