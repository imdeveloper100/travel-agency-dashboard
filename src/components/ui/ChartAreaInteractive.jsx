import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

const chartColors = {
  mobile: "hsl(var(--chart-2))",
  desktop: "hsl(var(--chart-1))",
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("3months")

  const filteredData = React.useMemo(() => {
    if (timeRange === "7days") {
      return chartData.slice(-1)
    }
    if (timeRange === "30days") {
      return chartData.slice(-2)
    }
    return chartData
  }, [timeRange])

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">Total Visitors</h3>
          <p className="text-sm text-muted-foreground">
            Total for the last {timeRange === "7days" ? "7 days" : timeRange === "30days" ? "30 days" : "3 months"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === "3months" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("3months")}
          >
            Last 3 months
          </Button>
          <Button
            variant={timeRange === "30days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30days")}
          >
            Last 30 days
          </Button>
          <Button
            variant={timeRange === "7days" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7days")}
          >
            Last 7 days
          </Button>
        </div>
      </div>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={filteredData}
          margin={{
            left: 0,
            right: 10,
            top: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill={chartColors.mobile}
            fillOpacity={0.6}
            stroke={chartColors.mobile}
            stackId="a"
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill={chartColors.desktop}
            fillOpacity={0.4}
            stroke={chartColors.desktop}
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
