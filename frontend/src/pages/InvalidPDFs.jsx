import { FileText, CreditCard, FileCheck, FileSignature } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTitle from "@/components/shared-ui/PageTitle";
import DefaultLayout from "@/layout/DefaultLayout";
import DynamicTable from "@/components/table/DynamicTable";
import { getInvalidPdfsColumns } from "@/components/tables/columns/invalidPdfsColumns";
import { useAction } from "@/hooks/use-action";
import { useState } from "react";
import { useInvalidPdfs } from "@/hooks/use-invalid-pdfs";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

const InvalidPdfs = () => {
    const tabs = [
        { id: "bank", label: "Bank Transactions", icon: FileText },
        { id: "kif", label: "KIF", icon: CreditCard },
        { id: "kuf", label: "KUF", icon: FileCheck },
        { id: "contracts", label: "Contracts", icon: FileSignature },
    ];

    const handleAction = useAction('invalid-pdfs');
    const [activeTab, setActiveTab] = useState("bank");
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, isPending, isError, error, refetch } = useInvalidPdfs(activeTab, page, perPage);

    if (isPending) {
        return (
            <>
                <PageTitle text="Invalid PDFs" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <div>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load Invalid PDFs"
                    showDetails={true}
                />
            </div>
        );
    }

    const rows = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full">
                <div className="min-h-[85vh] mt-4 mb-4 bg-secondary dark:bg-secondary text-foreground p-4 sm:p-6 md:p-6 xl:p-8 transition-colors rounded-lg">
                    <PageTitle text="Invalid PDFs" compact className="text-spurple" />

                    <Tabs value={activeTab ?? "bank"} onValueChange={(v) => { setActiveTab(v); setPage(1); }} className="w-full">
                        <TabsList
                            className="
                                flex flex-col gap-2
                                lg:grid lg:grid-cols-4
                                bg-transparent
                                h-auto p-0 mb-3 sm:mb-4 md:mb-4 xl:mb-6
                                w-full
                            "
                        >
                            {tabs.map((tab) => {
                                const Icon = tab.icon;

                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="
                                            flex items-center gap-2 
                                            w-full
                                            px-4 py-3 
                                            rounded-lg font-medium transition-all
                                            
                                            justify-center

                                            data-[state=active]:bg-spurple 
                                            data-[state=active]:text-white 
                                            data-[state=active]:shadow-md 
                                            data-[state=active]:shadow-spurple/30

                                            data-[state=inactive]:bg-secondary 
                                            data-[state=inactive]:text-secondary-foreground
                                            data-[state=inactive]:hover:bg-ring/10

                                            dark:data-[state=inactive]:bg-secondary 
                                            dark:data-[state=inactive]:text-foreground 
                                            dark:data-[state=inactive]:hover:bg-gray-background
                                        "
                                    >
                                        <Icon className="w-4 h-4 xl:w-5 xl:h-5 flex-shrink-0" />
                                        <span className="text-sm xl:text-base">{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-0">
                            <div className="w-full h-full flex-1 flex">
                                <div className="w-full h-full">
                                    <DynamicTable
                                        columns={getInvalidPdfsColumns(handleAction)}
                                        data={rows}
                                        total={total}
                                        page={page}
                                        perPage={perPage}
                                        onPageChange={setPage}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default InvalidPdfs;