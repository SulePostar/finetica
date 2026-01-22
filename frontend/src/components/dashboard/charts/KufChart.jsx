import DailyDocsChart from "@/components/dashboard/charts/DailyDocsCharts"
import { useKufDailyStats } from "@/queries/Kuf"
import { mapKufDailyStats } from "@/helpers/chartHelpers"
import { todayISO } from "@/helpers/chartHelpers"

export default function KufDailyAreaChart() {
    return (
        <DailyDocsChart
            title="KUF – Daily documents"
            description="Number of KUF invoices per day"
            seriesLabel="KUF documents"
            toDateISO={todayISO()}
            useDailyStatsHook={useKufDailyStats}
            mapApiRows={mapKufDailyStats}
        />
    )
}
