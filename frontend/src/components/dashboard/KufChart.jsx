import { useState, useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useKufDailyStats } from "@/queries/Kuf"
import {
    getRangeDates,
    fillMissingDays,
    mapKufDailyStats,
} from "@/helpers/chartHelpers"

const chartConfig = {
    count: {
        label: "KUF documents",
        color: "var(--chart-1)",
    },
}

export default function KufDailyAreaChart() {
    const [range, setRange] = useState("7d")

    const toDate = useMemo(
        () => new Date("2025-08-13T00:00:00"),
        []
    )

    const { from, to } = useMemo(
        () => getRangeDates(range, toDate),
        [range, toDate]
    )

    const { data, isLoading, isError } = useKufDailyStats({ from, to })

    const chartData = useMemo(() => {
        const rows = data?.data ?? []
        const mapped = mapKufDailyStats(rows)
        return fillMissingDays(mapped, from, to)
    }, [data, from, to])

    return (
        <Card className="pt-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>KUF – Daily documents</CardTitle>
                    <CardDescription>Number of KUF invoices per day</CardDescription>
                </div>

                <Select value={range} onValueChange={setRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select range"
                    >
                        <SelectValue placeholder="Last 7 days" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d">Last 3 months</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {isLoading && (
                    <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        Loading chart...
                    </div>
                )}

                {isError && (
                    <div className="h-[250px] flex items-center justify-center text-destructive">
                        Failed to load chart data
                    </div>
                )}

                {!isLoading && !isError && (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) =>
                                    new Date(value + "T00:00:00").toLocaleDateString("en-GB", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }
                            />

                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="dot"
                                        labelFormatter={(value) =>
                                            new Date(value + "T00:00:00").toLocaleDateString("en-GB", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }
                                    />
                                }
                            />

                            <Area
                                dataKey="count"
                                type="monotone"
                                fill="url(#fillCount)"
                                stroke="var(--color-count)"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
