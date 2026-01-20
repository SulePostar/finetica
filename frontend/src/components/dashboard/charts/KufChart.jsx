import DailyDocsChart from "@/components/dashboard/charts/DailyDocsCharts"
import { useKufDailyStats } from "@/queries/Kuf"
import { mapKufDailyStats } from "@/helpers/chartHelpers"

export default function KufDailyAreaChart() {
    return (
        <DailyDocsChart
            title="KUF – Daily documents"
            description="Number of KUF invoices per day"
            seriesLabel="KUF documents"
            toDateISO="2025-08-13"
            useDailyStatsHook={useKufDailyStats}
            mapApiRows={mapKufDailyStats}
        />
    )
}
