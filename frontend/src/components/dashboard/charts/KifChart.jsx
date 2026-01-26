import DailyDocsChart from "@/components/dashboard/charts/DailyDocsCharts"
import { useKifDailyStats } from "@/queries/KifQueries"
import { mapKifDailyStats, todayISO } from "@/helpers/chartHelpers"

export default function KifDailyAreaChart() {
    return (
        <DailyDocsChart
            title="KIF – Daily documents"
            description="Number of KIF invoices per day"
            seriesLabel="KIF documents"
            toDateISO={todayISO()}
            useDailyStatsHook={useKifDailyStats}
            mapApiRows={mapKifDailyStats}
        />
    )
}
