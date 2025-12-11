import { FileText, CreditCard, FileCheck, FileSignature } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTitle from "@/components/shared-ui/PageTitle";
import DefaultLayout from "@/layout/DefaultLayout";

const InvalidPdfs = () => {
    const tabs = [
        { id: "bank", label: "Bank Transactions", icon: FileText },
        { id: "kif", label: "KIF", icon: CreditCard },
        { id: "kuf", label: "KUF", icon: FileCheck },
        { id: "contracts", label: "Contracts", icon: FileSignature },
    ];

    return (
        <DefaultLayout>
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="w-full">
                    <div className="min-h-[85vh] mt-4 mb-4 bg-secondary dark:bg-secondary text-foreground p-4 sm:p-6 md:p-6 xl:p-8 transition-colors rounded-lg">
                        <PageTitle text="Invalid PDFs" compact className="text-spurple" />

                        <Tabs defaultValue="bank" className="w-full">
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
                            {tabs.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                                    <div className="
                                    bg-card dark:bg-light-gray 
                                    border border-border 
                                    rounded-xl 
                                    p-4 sm:p-6 md:p-6 xl:p-8 
                                    min-h-[500px] sm:min-h-[600px] xl:min-h-[700px] 
                                    flex items-center justify-center 
                                    transition-colors
                                ">
                                        <p className="text-muted-foreground dark:text-foreground text-center text-sm sm:text-base xl:text-lg">
                                            There are no {tab.label.toLowerCase()} records to display
                                        </p>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default InvalidPdfs;