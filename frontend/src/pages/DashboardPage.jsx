import { useMemo } from "react";
import StatWidget from "@/components/dashboard/StatWidget";
import KufDailyAreaChart from "@/components/dashboard/charts/KufChart";
import PageTitle from "@/components/shared-ui/PageTitle";
import {
    FileText,
    FileWarning,
    CreditCard,
    Brain,
    Activity
} from "lucide-react";
import { useInvalidPdfsCount } from "@/queries/InvalidPdfs/count";
import { useActiveContractsCount } from "@/queries/useContracts";

const bottomRowData = [
    {
        title: "AI Accuracy",
        value: "94.8%",
        delta: "1.2",
        positive: true,
        icon: <Brain className="text-chart-4 w-6 h-6" />,
    },
    {
        title: "Site Traffic",
        value: "89.2k",
        delta: "25.6",
        positive: true,
        icon: <Activity className="text-green w-6 h-6" />,
    },
];

const Dashboard = () => {
    const { data: invalidPdfCount, isLoadingPdf, isErrorPdf } = useInvalidPdfsCount();
    const { data: activeContractsCount, isLoading: isLoadingContracts, isError: isErrorContracts } = useActiveContractsCount();

    const topRowData = useMemo(() => [
        {
            title: "Active Contracts",
            value: isLoadingContracts ? "—" : isErrorContracts ? "Error" : String(activeContractsCount ?? 0),
            //delta: "12.5",
            positive: true,
            icon: <FileText className="text-brand w-6 h-6" />,
        },
        {
            title: "Invalid PDFs",
            value: isLoadingPdf ? "—" : isErrorPdf ? "Error" : String(invalidPdfCount ?? 0),
            //delta: "4.2",
            positive: false,
            icon: <FileWarning className="text-destructive w-6 h-6" />,
        },
        {
            title: "Bank Transactions",
            value: "1,240",
            delta: "8.1",
            positive: true,
            icon: <CreditCard className="text-spurple w-6 h-6" />,
        },
    ], [isLoadingPdf, isErrorPdf, invalidPdfCount, isLoadingContracts, isErrorContracts, activeContractsCount]);
    return (
        <div className="pt-20">
            <PageTitle text="Dashboard" compact />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mt-6">

                {topRowData.map((data, index) => (
                    <div key={index} className="md:col-span-2">
                        <StatWidget
                            title={data.title}
                            value={data.value}
                            delta={data.delta}
                            positive={data.positive}
                            icon={data.icon}
                        />
                    </div>
                ))}

                {/* LEFT: KUF Chart */}
                <div className="md:col-span-3 h-80">
                    <KufDailyAreaChart />
                </div>

                {/* RIGHT: KIF Chart */}
                <div className="md:col-span-3 h-80 bg-muted/20 border border-dashed border-border rounded-2xl flex items-center justify-center relative">
                    <div className="w-full max-w-xs">
                        <StatWidget
                            title="AI Accuracy"
                            value="94.8%"
                            delta="1.2"
                            positive={true}
                            icon={<Brain className="text-chart-4 w-6 h-6" />}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Dashboard;