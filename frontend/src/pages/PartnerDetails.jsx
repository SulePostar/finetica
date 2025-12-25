import IsError from "@/components/shared-ui/IsError";
import { Spinner } from "@/components/ui/spinner";
import DefaultLayout from "@/layout/DefaultLayout";
import { usePartnerById } from "@/queries/partners";
import { useParams } from "react-router-dom";
import { PartnerInfo } from "@/components/partner-details/PartnerInfo";

const PartnerDetails = () => {
    const { id } = useParams();

    const { data: partner, isPending, isError, error, refetch } = usePartnerById(id);

    if (isPending) {
        return (
            <DefaultLayout>
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <Spinner className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-[var(--spurple)]" />
                </div>
            </DefaultLayout>
        );
    }

    if (isError) {
        return (
            <DefaultLayout>
                <IsError
                    error={error}
                    onRetry={() => refetch()}
                    title="Failed to load partner details"
                    showDetails={true}
                />
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto p-6 max-w-6xl pt-20">
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-spurple mb-2">
                                {partner?.data?.name || 'Partner Details'}
                            </h1>
                            <p className="text-muted-foreground">
                                Detailed information about this business partner
                            </p>
                        </div>
                    </div>
                </div>

                <PartnerInfo partner={partner} />
            </div>
        </DefaultLayout>
    );
};

export default PartnerDetails;