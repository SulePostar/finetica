import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useBankTransactions } from "@/queries/BankStatementsQueries";
import { Spinner } from "@/components/ui/spinner";
import IsError from "@/components/shared-ui/IsError";
import { getBankStatementsColumns } from "@/components/tables/columns/BankTransactionsColumns";
import { useState } from "react";
import { PanelsLeftBottom } from "lucide-react";

const BankStatements = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data, isPending, isError, error, refetch } = useBankTransactions({ page, perPage });

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-40">
                <Spinner className="size-10" />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <IsError error={error} onRetry={() => refetch()} title="Failed to load Bank Transactions" showDetails={true} />
            </div>
        );
    }

    const rows = data?.data ?? [];
    const total = data?.total ?? 0;

    return (
        <div>
            <PageTitle text="Bank Statements" />
            <DynamicTable
                columns={getBankStatementsColumns()}
                data={rows}
                total={total}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </div>
    );
}

export default BankStatements;