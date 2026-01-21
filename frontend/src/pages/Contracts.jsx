import React, { useState } from "react";

import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from '@/components/ui/spinner.jsx';
import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { Button } from "@/components/ui/button";

import { useContracts, contractKeys } from "../queries/useContracts";
import { getContractsColumns } from "@/components/tables/columns/ContractsColumns";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";

export default function Contracts() {
  const [page, setPage] = useState(1);
  const [timeRange, setTimeRange] = useState("all");
  const perPage = 10;

  const handleAction = useAction('contracts');

  const { data, isPending, isError, error, refetch } = useContracts({
    page,
    perPage,
    timeRange: timeRange === "all" ? null : timeRange,
  });

  const {
    mutateAsync: uploadFile,
    isPending: isUploading,
  } = useBucketFileUpload({
    bucketName: "contracts",
    invalidateKeys: [contractKeys.all],
    successMessage: "Contract uploaded",
    successDescription: "Contract file has been processed successfully.",
  });

  const handleFileUpload = async (file) => {
    await uploadFile({ file, description: "Contract Document" });
  };

  const handleTimeChange = (newValue) => {
    const val = newValue || "all";
    setTimeRange(val);
    setPage(1);
  };

  if (isPending) {
    return (
      <>
        <div className="pt-20">
          <PageTitle text="Contracts" />
          <div className="flex items-center justify-center h-40">
            <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div className="pt-20">
          <IsError
            error={error}
            onRetry={() => refetch()}
            title="Failed to load contracts"
            showDetails={true}
          />
        </div>
      </>
    );
  }

  return (
    <div className="pt-20">
      <DynamicTable
        header={
          <div className="flex items-center justify-between w-full">
            <PageTitle
              text="Contracts"
              subtitle="Overview of all Contracts files"
              compact
            />
            <div className="flex items-center gap-4">
              {isUploading && (
                <div className="flex items-center gap-3">
                  <Spinner className="w-4 h-4 text-[var(--spurple)]" />
                  <span className="text-sm text-muted-foreground">
                    Uploading & processing...
                  </span>
                </div>
              )}

              <UploadButton
                onUploadSuccess={handleFileUpload}
                buttonText="Upload Contract"
                disabled={isUploading}
                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
              />

              <TimeFilter
                value={timeRange}
                onChange={handleTimeChange}
              />
            </div>
          </div>
        }
        toolbar={{
          button: (
            <Button variant="outline" onClick={() => {
              setTimeRange("all");
              setPage(1);
            }}
            >
              Clear filters
            </Button>
          ),
        }}
        columns={getContractsColumns(handleAction)}
        data={data?.data ?? []}
        total={data?.total || 0}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
      />
    </div>
  );
}