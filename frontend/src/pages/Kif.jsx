import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useKifList } from "@/queries/KifQueries";
import { getKifColumns } from "@/components/tables/columns/kifColumns";
import { useState } from "react";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";

const Kif = () => {
    const { data: response, isPending, isError, error } = useKifList();

    const [page, setPage] = useState(1);
    const perPage = 10;

    const columns = getKifColumns((item) => {
        console.log("Delete:", item);
    });

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
            <>:
                <PageTitle text="Kif" />
                <isError error={error} />
            </>
        );
    }

    return (
        <>
            <PageTitle text="Kif" />
            <DynamicTable
                columns={columns}
                data={response?.data || []}
                page={page}
                perPage={perPage}
                onPageChange={setPage}
            />
        </>
    );
};

export default Kif;
