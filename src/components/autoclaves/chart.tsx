import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  Time,
} from "lightweight-charts";

type ChartComponentProps = {
  data: { time: Time; value: number }[];
  colors?: {
    lightMode?: {
      backgroundColor?: string;
      lineColor?: string;
      textColor?: string;
      areaTopColor?: string;
      areaBottomColor?: string;
    };
    darkMode?: {
      backgroundColor?: string;
      lineColor?: string;
      textColor?: string;
      areaTopColor?: string;
      areaBottomColor?: string;
    };
  };
};

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  colors = {
    lightMode: {
      backgroundColor: "white",
      lineColor: "#0ea5e9",
      textColor: "black",
      areaTopColor: "#0ea5e9",
      areaBottomColor: "rgba(0, 150, 255, 0.2)",
    },
    darkMode: {
      backgroundColor: "#020817",
      lineColor: "#3b82f6",
      textColor: "#f3f4f6",
      areaTopColor: "#3b82f6",
      areaBottomColor: "rgba(59, 130, 246, 0.2)",
    },
  },
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const { theme } = useTheme();

  // Convertir los timestamps ISO a la hora local del usuario
  const convertedData = data.map((item) => ({
    ...item,
    time: (new Date(item.time as string).getTime() / 1000) as Time, // Convierte a segundos
  }));

  useEffect(() => {
    if (chartContainerRef.current) {
      const isDarkMode = theme === "dark";
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: {
            type: ColorType.Solid,
            color: isDarkMode
              ? colors.darkMode!.backgroundColor!
              : colors.lightMode!.backgroundColor!,
          },
          textColor: isDarkMode
            ? colors.darkMode!.textColor!
            : colors.lightMode!.textColor!,
        },
        width: chartContainerRef.current.clientWidth + 50,
        height: 300,
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
        },
      });

      chartRef.current = chart;
      chart.timeScale().fitContent();

      const newSeries = chart.addAreaSeries({
        lineColor: isDarkMode
          ? colors.darkMode!.lineColor!
          : colors.lightMode!.lineColor!,
        topColor: isDarkMode
          ? colors.darkMode!.areaTopColor!
          : colors.lightMode!.areaTopColor!,
        bottomColor: isDarkMode
          ? colors.darkMode!.areaBottomColor!
          : colors.lightMode!.areaBottomColor!,
      });

      seriesRef.current = newSeries;
      newSeries.setData(convertedData);

      const handleResize = () => {
        if (chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current?.clientWidth || 0,
          });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [convertedData, theme, colors]);

  useEffect(() => {
    if (seriesRef.current) {
      seriesRef.current.setData(convertedData);
    }
  }, [convertedData]);

  return <div ref={chartContainerRef} className="w-full" />;
};
