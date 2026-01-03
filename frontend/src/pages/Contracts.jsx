import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import DefaultLayout from "@/layout/DefaultLayout";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from '@/components/ui/spinner.jsx';
import { TimeFilter } from "@/components/shared-ui/TimeFilter";

import { useContracts, contractKeys } from "../queries/useContracts";
import { getContractsColumns } from "@/components/tables/columns/ContractsColumns";
import { useAction } from "@/hooks/use-action";
import { uploadFileToBucket } from "@/api/uploadedFiles";
import { notify } from "@/lib/notifications";
import { useQueryToast } from "@/hooks/use-query-toast";

export default function Contracts() {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [timeRange, setTimeRange] = useState("all");

  const handleAction = useAction('contracts');
  const queryClient = useQueryClient();

  const { data, isPending, isError, error, refetch } = useContracts({
    page,
    perPage,
    timeRange
  });

  const {
    mutateAsync: uploadFile,
    isPending: isUploading,
  } = useMutation({
    mutationFn: ({ file, description }) =>
      uploadFileToBucket({
        file,
        bucketName: "contracts",
        description,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      notify.success("Contract uploaded", {
        description: "The contract file has been processed successfully.",
      });
    },

    onError: (err) => {
      notify.error("Upload failed", {
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong during upload.",
      });
    },
  });

  const handleFileUpload = async (file) => {
    await uploadFile({ file, description: "Contract Document" });
  };

  useQueryToast({
    isPending,
    isError,
    data,
    error,
    successMessage: "Contracts loaded",
    successDescription: "All contracts have been fetched successfully.",
    errorMessage: "Failed to load contracts",
  });

  const handleTimeChange = (newValue) => {
    setTimeRange(newValue);
    setPage(1); // Merged: ensures we reset to first page on filter change
  };

  if (isPending) {
    return (
      <DefaultLayout>
        <div className="pt-20">
          <PageTitle text="Contracts" />
          <div className="flex items-center justify-center h-40">
            <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (isError) {
    return (
      <DefaultLayout>
        <div className="pt-20">
          <IsError
            error={error}
            onRetry={() => refetch()}
            title="Failed to load contracts"
            showDetails={true}
          />
        </div>
      </DefaultLayout>
    );
  }

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <DefaultLayout>
      <div className="pt-20">
        <DynamicTable
          header={
            <div className="flex items-center justify-between gap-4">
              <PageTitle
                text="Contracts"
                subtitle="Overview of all Contracts files"
                compact
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {isUploading && (
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Uploading & processing...
                    </span>
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
            </div>
          }
          columns={getContractsColumns(handleAction)}
          data={rows}
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
        />
      </div>
    </DefaultLayout>
  );
}