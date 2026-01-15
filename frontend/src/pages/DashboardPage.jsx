import StatWidget from "@/components/dashboard/StatWidget";
import PageTitle from "@/components/shared-ui/PageTitle";
import {
    FileText,
    FileWarning,
    CreditCard,
    Brain,
    Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInvalidPdfsCount } from "@/api/invalidPdf";
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
    const { data: invalidPdfData, isLoading } = useQuery({
        queryKey: ["invalidPdfsCount"],
        queryFn: getInvalidPdfsCount,
    });
    const topRowData = [
        {
            title: "Active Contracts",
            value: "156",
            delta: "12.5",
            positive: true,
            icon: <FileText className="text-brand w-6 h-6" />,
        },
        {
            title: "Invalid PDFs",
            value: isLoading ? "..." : invalidPdfData?.total ?? "0",
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
    ];
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

                {bottomRowData.map((data, index) => (
                    <div
                        key={index}
                        className="md:col-span-3 h-80 bg-muted/20 border border-dashed border-border rounded-2xl flex items-center justify-center relative"
                    >
                        <div className="w-full max-w-xs">
                            <StatWidget
                                title={data.title}
                                value={data.value}
                                delta={data.delta}
                                positive={data.positive}
                                icon={data.icon}
                            />
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default Dashboard;