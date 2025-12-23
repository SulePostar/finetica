import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import { useContracts, contractKeys } from "../queries/useContracts";
import { Spinner } from '@/components/ui/spinner.jsx';
import IsError from "@/components/shared-ui/IsError";
import { getContractsColumns } from "@/components/tables/columns/ContractsColumns";
import DefaultLayout from "@/layout/DefaultLayout";
import UploadButton from "@/components/shared-ui/UploadButton";
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/hooks/useBucketFileUpload";

export default function Contracts() {
  const [timeRange, setTimeRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data, isPending, isError, error } = useContracts({ timeRange });

  const handleAction = useAction('contracts');

  const {
    mutateAsync: uploadFile,
    isPending: isUploading
  } = useBucketFileUpload({
    bucketName: "contracts",
    invalidateKeys: [contractKeys.all],
    successMessage: "Contract uploaded",
    successDescription: "The contract file has been processed successfully.",
  });

  const allRows = data?.data ?? [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = allRows.slice(startIndex, endIndex);

  const handleFileUpload = async (file) => {
    await uploadFile({
      file,
      description: "Contract Document"
    });
  };

  const handleTimeChange = (newValue) => {
    setTimeRange(newValue);
    setCurrentPage(1);
  };

  if (isPending) {
    return (
      <DefaultLayout>
        <PageTitle text="Contracts" />
        <div className="flex items-center justify-center h-40">
          <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
        </div>
      </DefaultLayout>
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
              <div className="flex items-center gap-4">
                {isUploading && (
                  <span className="text-sm text-muted-foreground animate-pulse">
                    Uploading...
                  </span>
                )}
                <UploadButton
                  onUploadSuccess={handleFileUpload}
                  buttonText="Upload Kuf"
                  className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
                />
                <TimeFilter
                  value={timeRange}
                  onChange={handleTimeChange}
                />
              </div>
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