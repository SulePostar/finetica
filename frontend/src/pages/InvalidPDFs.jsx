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
        <div className="min-h-screen bg-slate-100 dark:bg-[#171717] text-slate-900 dark:text-white p-4 sm:p-6 md:p-8 lg:p-12 transition-colors rounded-lg">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#6C69FF] mb-4 sm:mb-6 md:mb-8 lg:mb-12">
                PDF Issues
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 sm:px-6 lg:px-8 lg:py-4 rounded-lg font-medium transition-all w-full sm:w-auto",
                                activeTab === tab.id
                                    ? "bg-[#6C69FF] text-white shadow-lg shadow-[#6C69FF]/30"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-slate-800"
                            )}
                        >
                            <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                            <span className="text-sm sm:text-base lg:text-lg">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center transition-colors">
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm sm:text-base lg:text-lg">
                    There are no {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} records to display
                </p>
            </div>
        </div>
    );
};

export default InvalidPdfs;