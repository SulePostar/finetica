"use client"

import * as React from "react"
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

const dummyData = [
    { date: "2025-08-01", count: 0 },
    { date: "2025-08-02", count: 2 },
    { date: "2025-08-03", count: 1 },
    { date: "2025-08-04", count: 4 },
    { date: "2025-08-05", count: 3 },
    { date: "2025-08-06", count: 0 },
    { date: "2025-08-07", count: 2 },
    { date: "2025-08-08", count: 2 },
    { date: "2025-08-09", count: 3 },
]

const chartConfig = {
    count: {
        label: "KUF documents",
        color: "var(--chart-1)",
    },
}

export default function KufDailyAreaChart() {
    const [range, setRange] = React.useState("7d")

    const referenceDate = React.useMemo(() => {
        const last = dummyData[dummyData.length - 1]?.date
        return last ? new Date(last + "T00:00:00") : new Date()
    }, [])

    const filteredData = React.useMemo(() => {
        let days = 7
        if (range === "30d") days = 30
        if (range === "90d") days = 90

        const start = new Date(referenceDate)
        start.setDate(start.getDate() - days)

        return dummyData.filter((item) => {
            const d = new Date(item.date + "T00:00:00")
            return d >= start
        })
    }, [range, referenceDate])

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
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 7 days" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-count)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-count)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const d = new Date(value + "T00:00:00")
                                return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })
                            }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    labelFormatter={(value) => {
                                        return new Date(value + "T00:00:00").toLocaleDateString("en-GB", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />

                        <Area
                            dataKey="count"
                            type="natural"
                            fill="url(#fillCount)"
                            stroke="var(--color-count)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
