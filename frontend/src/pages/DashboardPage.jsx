import StatWidget from "@/components/dashboard/StatWidget";
import PageTitle from "@/components/shared-ui/PageTitle";
import { DollarSign, Activity, Users } from "lucide-react";

const Dashboard = () => {
    const statsData = [
        {
            title: "Total Revenue",
            value: "$54,239",
            delta: "12.5",
            positive: true,
            icon: <DollarSign className="text-blue-600 w-6 h-6" />,
        },
        {
            title: "Active Users",
            value: "1,340",
            delta: "8.2",
            positive: true,
            icon: <Users className="text-purple-600 w-6 h-6" />,
        },
        {
            title: "Site Traffic",
            value: "89.2k",
            delta: "25.6",
            positive: true,
            icon: <Activity className="text-green-600 w-6 h-6" />,
        },
    ];
    return (
        <div className="pt-20">
            <PageTitle text="Dashboard" compact />
            <div className="flex w-full gap-4">
                {statsData.map((widget, index) => (
                    <div key={index} className="flex-1">
                        <StatWidget
                            title={widget.title}
                            value={widget.value}
                            delta={widget.delta}
                            positive={widget.positive}
                            icon={widget.icon}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Dashboard;