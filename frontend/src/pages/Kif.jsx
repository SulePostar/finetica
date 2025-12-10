import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList } from "@/queries/KifQueries";
import { getKifColumns } from "@/components/tables/columns/kifColumns";
import { useState } from "react";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

const Kif = () => {
    const [page, setPage] = useState(1);
    const perPage = 10;
    const { data: response, isPending, isError, error, } = useKifList({ page, perPage });

    if (isPending) {
        return (
            <>
                <PageTitle text="Kif" />
                <div className="flex items-center justify-center h-40">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </>
        );
    }

    if (isError) {
        return (
            <>
                <PageTitle text="Kif" />
                <IsError error={error} />
            </>
        );
    }

    return (
        <>
            <PageTitle text="Kif" />
            <DynamicTable
                columns={getKifColumns((item) => console.log("Action on:", item))} data={response.data ? response.data : []} total={response?.total || 0}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />

        </>
    );
};

export default Kif;
