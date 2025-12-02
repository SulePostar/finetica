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
                <Spinner>Loading...</Spinner>
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
