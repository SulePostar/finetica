import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";

const demoColumns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
];

const demoData = [
    { id: 1, name: "Ken", role: "Developer" },
    { id: 2, name: "John", role: "Tester" },
    { id: 3, name: "Jon", role: "Team Lead" },
];

const BankStatements = () => {
    return (
        <div>
            <PageTitle text="Bank Statements" subtitle="Bank Statements" />
            <DynamicTable columns={demoColumns} data={demoData} />
        </div>
    );
};

export default BankStatements;