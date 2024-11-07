"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Gauge, Thermometer, Timer } from "lucide-react";
import { ChartComponent } from "@/components/autoclaves/chart";
import { connectMqttClient } from "@/utils/mqtt";

export default function Page() {
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );
  const [client] = useState(connectMqttClient());
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Obtener todos los datos al cargar la página
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch("/api/getData");
        if (!response.ok) {
          throw new Error("Error al obtener todos los datos");
        }
        const data = await response.json();

        // Procesar datos para las gráficas
        const newPressData = data.map((item: any) => ({
          time: item.timestamp,
          value: item.presion,
        }));
        const newTempData = data.map((item: any) => ({
          time: item.timestamp,
          value: item.temperatura,
        }));
        setChartPress(newPressData);
        setChartTemp(newTempData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleStart = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      client.publish("autoclaves/puerta", "1");
      setIsRunning(true);

      const interval = setInterval(async () => {
        try {
          const response = await fetch("/api/getLatestData");
          if (!response.ok) {
            throw new Error("Error al obtener el último valor");
          }
          const data = await response.json();
          const lastPressData = {
            time: data.timestamp, // Usar el timestamp tal cual
            value: data.presion,
          };
          const lastTempData = {
            time: data.timestamp, // Usar el timestamp tal cual
            value: data.temperatura,
          };

          setChartPress((prevData) => [...prevData, lastPressData]);
          setChartTemp((prevData) => [...prevData, lastTempData]);
        } catch (error) {
          console.error("Error al obtener el último valor:", error);
        }
      }, 1000);

      setIntervalId(interval);
    }
  };

  const handleCancel = () => {
    if (client) {
      // Publicar un mensaje al ESP para que detenga el envío de datos
      client.publish("autoclaves/puerta", "0");
    }
    setIsRunning(false);
    setTotalTime(0);

    // Limpia el intervalo
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <main className="p-4 space-y-4">
      <div className="text-3xl font-bold mb-12">Control Automático</div>

      <div className="lg:grid lg:grid-cols-2">
        {/* Card de Tiempo Total */}
        <Card className="w-full lg:w-3/4 mb-4 mx-auto lg:mx-0">
          <CardContent className="flex items-center justify-center bg-sky-100 dark:bg-gray-800 m-4">
            <div className="text-5xl font-bold mt-3">
              {formatTime(totalTime)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex text-2xl font-bold items-center">
              <Timer size={24} className="mr-2" />
              Tiempo Total
            </div>
          </CardFooter>
        </Card>

        {/* Contenedor horizontal para alinear los Cards de presión y temperatura */}
        <div className="flex flex-col lg:flex-row lg:col-span-1 space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
          <Card className="flex-1">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex">
                  <Gauge size={24} className="mr-2" />
                  Presión
                </div>
                Bar
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center bg-sky-100 dark:bg-gray-800 m-4">
              <div className="text-5xl font-bold mt-2">
                {chartPress.length > 0
                  ? chartPress[chartPress.length - 1].value.toFixed(2)
                  : "0.00"}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex">
                  <Thermometer size={24} className="mr-1" />
                  Temperatura
                </div>
                °C
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center bg-sky-100 dark:bg-gray-800 m-4">
              <div className="text-5xl font-bold mt-2">
                {chartTemp.length > 0
                  ? chartTemp[chartTemp.length - 1].value.toFixed(2)
                  : "0.00"}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2">
        <div className="lg:col-span-1 flex lg:flex-col lg:items-start items-center justify-center gap-4 my-4 pb-10">
          <Button
            className="bg-sky-500 px-6 py-3 text-xl w-full lg:w-3/4"
            onClick={handleStart}
            disabled={isRunning}
          >
            Comenzar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-sky-500 px-6 py-3 text-xl w-full lg:w-3/4"
                disabled={!isRunning}
              >
                Cancelar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cancelar</DialogTitle>
                <DialogDescription>
                  ¿Está seguro que desea parar el ciclo?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleCancel}
                  >
                    Parar el ciclo
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8 lg:space-y-12 lg:col-span-1">
          {/* Gráfica de presión */}
          <ChartComponent data={chartPress} />
          {/* Gráfica de temperatura */}
          <ChartComponent data={chartTemp} />
        </div>
      </div>
    </main>
  );
}
