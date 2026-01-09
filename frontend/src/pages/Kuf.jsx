import React, { useState } from "react";
import DynamicTable from "@/components/table/DynamicTable";
import PageTitle from "@/components/shared-ui/PageTitle";
import UploadButton from "@/components/shared-ui/UploadButton";
import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useKufInvoices, kufKeys, useKufInvoiceTypes } from "@/queries/Kuf";
import { getKufColumns } from "@/components/tables/columns/kufColumns";

import { TimeFilter } from "@/components/shared-ui/TimeFilter";
import { useAction } from "@/hooks/use-action";
import { useBucketFileUpload } from "@/queries/uploadedFiles";

const Kuf = () => {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [timeRange, setTimeRange] = useState("all");
  const [invoiceType, setInvoiceType] = useState("all");

  const handleAction = useAction("kuf");
  const { data, isPending, isError, error, refetch } = useKufInvoices({
    page,
    perPage,
    timeRange,
    invoiceType: invoiceType === "all" ? null : invoiceType
  });

  const { data: invoiceTypesData, isPending: isLoadingTypes, isError: isTypesError } = useKufInvoiceTypes();

  const { mutateAsync: uploadFile, isPending: isUploading } = useBucketFileUpload({
    bucketName: "kuf",
    invalidateKeys: [kufKeys.all],
    successMessage: "KUF uploaded",
    successDescription: "KUF file has been processed successfully.",
  });

  const handleFileUpload = async (file) => {
    await uploadFile({ file, description: "KUF purchase invoices" });
  };

  const handleTimeChange = (newValue) => {
    setTimeRange(newValue);
    setPage(1);
  };

  if (isPending) {
    return (
      <div className="pt-20">
        <PageTitle text="KUF" />
        <div className="flex items-center justify-center h-40">
          <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pt-20">
        <PageTitle text="KUF - Purchase Invoices" />
        <IsError error={error} onRetry={() => refetch()} title="Failed to load KUF" showDetails />
      </div>
    );
  }

  return (
    <div className="pt-20">
      <DynamicTable
        header={
          <div className="flex items-center justify-between w-full">
            <PageTitle text="KUF" subtitle="Overview of all KUF Purchase Invoices" compact />
            <div className="flex items-center gap-4">
              {isUploading && (
                <span className="text-sm text-muted-foreground">Uploading & processing...</span>
              )}
              <UploadButton
                onUploadSuccess={handleFileUpload}
                buttonText="Upload KUF"
                disabled={isUploading}
                className="bg-[var(--spurple)] hover:bg-[var(--spurple)]/90 text-white"
              />
              <TimeFilter value={timeRange} onChange={handleTimeChange} />
            </div>
          </div>
        }
        toolbar={{
          filters: (
            <Select
              value={invoiceType}
              onValueChange={(value) => {
                setInvoiceType(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All invoices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All invoices</SelectItem>
                {isLoadingTypes ? (
                  <SelectItem value="loading" disabled>
                    Loading types...
                  </SelectItem>
                ) : isTypesError ? (
                  <SelectItem value="error" disabled>
                    Error loading types
                  </SelectItem>
                ) : (
                  invoiceTypesData?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          ),
          button: (
            <Button
              variant="outline"
              onClick={() => {
                setInvoiceType("all");
                setTimeRange("all");
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          ),
        }}
        columns={getKufColumns(handleAction)}
        data={data?.data ?? []}
        total={data?.total ?? 0}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
      />
      {
        isPending && (
          <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-white/40">
            <Spinner className="w-12 h-12 text-[var(--spurple)]" />
          </div>
        )
      }
    </div>
  );
};

export default Kuf;