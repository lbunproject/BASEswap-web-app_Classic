import { useRef, useEffect, useState } from "react"
import { path } from "ramda"
import { debounce, merge as mergeDeep } from "lodash"
import ChartJS, {
  ChartOptions,
  ChartXAxe,
  ChartYAxe,
  ChartTooltipOptions,
} from "chart.js"
import { formatMoney } from "libs/parse"

type ChartType = "doughnut" | "line" | "pie"
export type Props = {
  type?: ChartType
  pieBackgroundColors?: string[]
  lineStyle?: ChartJS.ChartDataSets
  labels?: string[]
  data?: number[] | ChartJS.ChartPoint[]
  options?: ChartJS.ChartOptions
  width?: number
  height?: number
}

const ChartComponent = (props: Props) => {
  const { type = "line", labels, data, height, options } = props
  const { pieBackgroundColors, lineStyle } = props

  /* DOM Size */
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(props.width || 0)
  useEffect(() => {
    const getWidth = (container: HTMLDivElement) => {
      const { width } = container.getBoundingClientRect()
      setWidth(width)
    }

    const container = containerRef.current
    !width && container && getWidth(container)
    // eslint-disable-next-line
  }, [])

  /* Init chart */
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<ChartJS>()
  useEffect(() => {
    const initChart = (ctx: CanvasRenderingContext2D) => {
      ctx.canvas.width = width
      height && (ctx.canvas.height = height)
      const chart = new ChartJS(
        ctx,
        getOptions(type, { pieBackgroundColors, lineStyle })
      )
      setChart(chart)
    }

    const canvas = canvasRef.current
    const ctx = canvas && canvas.getContext("2d")
    width && ctx && initChart(ctx)
    // eslint-disable-next-line
  }, [width])

  /* Update chart */
  useEffect(() => {
    const updateChart = (chart: ChartJS) => {
      const merge = (options: ChartJS.ChartOptions) => {
        const getAxe = (axis: string) =>
          path<object>(["scales", `${axis}Axes`, 0])

        const xAxe: ChartXAxe = mergeDeep(
          getAxe("x")(chart.options) || {},
          getAxe("x")(options) || {}
        )

        const yAxe: ChartYAxe = mergeDeep(
          getAxe("y")(chart.options) || {},
          getAxe("y")(options) || {}
        )

        const scales: ChartOptions["scales"] = { xAxes: [xAxe], yAxes: [yAxe] }

        chart.options = mergeDeep(
          chart.options,
          Object.assign({}, options, options.scales && { scales })
        )
      }

      const { datasets } = chart.data
      labels && (chart.data.labels = labels)
      datasets && (datasets[0].data = data)
      options && merge(options)
      lineStyle && datasets && (datasets[0] = { ...datasets[0], ...lineStyle })

      chart.update()
    }

    chart && updateChart(chart)
  }, [chart, labels, data, options, lineStyle])

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}

const Chart = (props: Props) => {
  const [key, setKey] = useState<number>(0)
  useEffect(() => {
    const refresh = debounce(() => setKey((k) => k + 1), 300)
    window.addEventListener("resize", refresh)
    return () => window.removeEventListener("resize", refresh)
  }, [])

  return <ChartComponent {...props} key={key} />
}

export default Chart

/* Chart.js */
const BLUE = "#0222ba"
const getOptions = (
  type: ChartType,
  config: {
    pieBackgroundColors?: string[]
    lineStyle?: ChartJS.ChartDataSets
  }
): ChartJS.ChartConfiguration => {
  /* Dataset Properties */
  const defaultProps = {
    borderWidth: 1,
  }

  const props = {
    doughnut: {
      backgroundColor: [
        "#4D63CE",
        "#6679D4",
        "#8090DC",
        "#99A6E3",
        "#B2BCEA",
        "#CCD2F1",
      ],
    },
    pie: {
      backgroundColor: config.pieBackgroundColors || [
        "#4D63CE",
        "#6679D4",
        "#8090DC",
        "#99A6E3",
        "#B2BCEA",
        "#CCD2F1",
      ],
      borderWidth: 0,
    },
    line: {
      borderColor: "#0d0d2b",
      pointBackgroundColor: "#f9aa4b",
      pointRadius: 0,
      pointHoverRadius: 0,
      backgroundColor: "#f9aa4b",
      ...config.lineStyle,
    },
  }[type]

  /* Options */
  const defaultOptions = {
    responsive: true,
    animation: { duration: 0 },
    legend: { display: false },
  }

  const tooltips: ChartTooltipOptions = {
    backgroundColor: "#FFFFFF",
    titleFontColor: "#0d0d2b",
    bodyFontColor: "#0d0d2b",
    borderColor: "#0d0d2b",
    borderWidth: 1,
    titleFontFamily: "Gotham",
    titleFontSize: 13,
    titleFontStyle: "700",
    titleMarginBottom: 4,
    bodyFontFamily: "Gotham",
    bodyFontSize: 13,
    bodyFontStyle: "normal",
    xPadding: 15,
    yPadding: 10,
    caretSize: 6,
    displayColors: false,
    callbacks: {
      title: (
        [{ index }]: ChartJS.ChartTooltipItem[],
        { labels }: ChartJS.ChartData
      ) => String(labels && typeof index === "number" && labels[index]),
      label: getLabel,
    },
  }

  const options: ChartOptions = {
    doughnut: {
      aspectRatio: 1,
      cutoutPercentage: 85,
      tooltips,
    },
    pie: {
      aspectRatio: 1,
      cutoutPercentage: 0,
      tooltips,
    },
    line: {
      tooltips: {
        ...tooltips,
        intersect: false,
        mode: "index" as const,
        titleFontFamily: "Gotham",
        titleFontSize: 16,
        titleFontStyle: "500",
        titleMarginBottom: 2,
        bodyFontFamily: "Gotham",
        bodyFontSize: 11,
        bodyFontStyle: "normal",
        xPadding: 15,
        yPadding: 10,
        caretSize: 6,
        displayColors: false,
        callbacks: {
          title: ([{ value }]: ChartJS.ChartTooltipItem[]) =>
            `$${formatMoney(Number(value), 2, true)}`,
          label: getLabel,
        },
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              displayFormats: {
                hour: "MMM DD", //"hA"
              },
            },
            ticks: {
              source: "data" as const,
              // autoSkip: true,
              fontColor: "#0d0d2b",
              fontSize: 11,
              minRotation: 0,
              maxRotation: 0,
              callback: (
                tickValue: string | number,
                index: number,
                ticks: any[]
              ) =>
                index === ticks.length - 1 ||
                index === 0 ||
                index === Math.floor(ticks.length / 2)
                  ? tickValue
                  : undefined,
            },
            gridLines: { color: "#C3C3C399" },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: "#0d0d2b",
              fontSize: 11,
              callback(value: any) {
                return `$${formatMoney(Number(value), 2, true)}`
              },
            },
            gridLines: { color: "#C3C3C399" },
          },
        ],
      },
    },
  }[type]

  return {
    type,
    data: { datasets: [{ ...defaultProps, ...props }] },
    options: Object.assign({}, defaultOptions, options),
  }
}

/* callbacks */
const getLabel = (
  { index }: ChartJS.ChartTooltipItem,
  { datasets }: ChartJS.ChartData
) => {
  type Point = ChartJS.ChartPoint | number
  const point: Point =
    (typeof index === "number" && path([0, "data", index], datasets)) || 0
  const t = point && typeof point !== "number" ? point.t : point
  return t instanceof Date
    ? t.toLocaleTimeString([], {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) //year: 'numeric',
    : typeof t === "number"
    ? `$${formatMoney(t / 1e6)}`
    : ""
}
