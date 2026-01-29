import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = React.useId()
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

    return (
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line-line]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { ...child.props })
            }
            return child
          })}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, className, indicator = "dot", ...props }, ref) => {
    const tooltip = payload?.[0]

    if (!active || !tooltip) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-md",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 px-1">
          {indicator === "dot" && tooltip.color && (
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: tooltip.color }}
            />
          )}
          {indicator === "line" && tooltip.color && (
            <div
              className="h-px w-4 shrink-0"
              style={{ backgroundColor: tooltip.color }}
            />
          )}
          <div className="grid gap-1.5">
            {tooltip.name && (
              <div className="text-muted-foreground">{tooltip.name}</div>
            )}
            {tooltip.value && (
              <div className="font-medium text-foreground">
                {typeof tooltip.value === "number"
                  ? tooltip.value.toLocaleString()
                  : tooltip.value}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { payload } = props

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          className
        )}
        {...props}
      >
        {payload.map((item) => (
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            )}
          >
            {item.color && (
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}
            {item.value}
          </div>
        ))}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config || {}).filter(
    ([, value]) => value?.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(config || {})
          .filter(([, value]) => value?.color)
          .map(([key, value]) => {
            const match = key.match(/^data-(\d+)$/)
            if (match) {
              const [, index] = match
              return `[data-chart=${id}] .recharts-line .recharts-line-dots:nth-of-type(${index}) { stroke: ${value.color}; }`
            }
            return `[data-chart=${id}] .color-${key} { color: ${value.color}; }`
          })
          .join("\n"),
      }}
    />
  )
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
