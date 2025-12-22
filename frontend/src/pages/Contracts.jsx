import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useContracts } from "../queries/useContracts";
import { Spinner } from '@/components/ui/spinner.jsx';
import IsError from "@/components/shared-ui/IsError";
import { getContractsColumns } from "@/components/tables/columns/ContractsColumns";
import DefaultLayout from "@/layout/DefaultLayout";
import UploadButton from "@/components/shared-ui/UploadButton";
import { useAction } from "@/hooks/use-action";

export default function Contracts() {
  const { data, isPending, isError, error } = useContracts();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handleAction = useAction('contracts');

  const allRows = data?.data ?? [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = allRows.slice(startIndex, endIndex);


  const handleFileUpload = (file) => {
    console.log("File uploaded:", file);
  };

  if (isPending) {
    return (
      <>
        <PageTitle text="Contracts" />
        <div className="flex items-center justify-center h-40">
          <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <IsError
        error={error}
        title="Failed to load contracts"
        showDetails={false}
      />
    );
  }

  return (
    <DefaultLayout>
      <div className="pt-20">
        <DynamicTable
          header={
            <div className="flex items-center justify-between">
              <PageTitle
                text="Contracts"
                subtitle="Overview of all Contracts files"
                compact
              />
              <UploadButton
                onUploadSuccess={handleFileUpload}
                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
              />
            </div>
          }
          columns={getContractsColumns(handleAction)}
          data={paginatedRows}
          total={allRows.length}
          page={currentPage}
          perPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </DefaultLayout>
  );
}