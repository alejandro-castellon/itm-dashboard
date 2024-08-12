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

export default function Page() {
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>([
    { time: -1, value: 30.0 },
  ]);
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>([
    { time: -1, value: 5.0 },
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTotalTime((prevTime) => prevTime + 1);

        // Generar valores aleatorios para presión y temperatura
        const newPressure = 5 + Math.random() * 2;
        const newTemperature = 30 + Math.random() * 10;

        // Agregar nuevos datos a la gráfica
        setChartPress((prevData) => [
          ...prevData,
          { time: totalTime, value: newPressure }, // Usar `totalTime` para el tiempo en segundos
        ]);
        setChartTemp((prevData) => [
          ...prevData,
          { time: totalTime, value: newTemperature }, // Usar `totalTime` para el tiempo en segundos
        ]);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, totalTime]);

  const handleStart = () => setIsRunning(true);
  const handleCancel = () => {
    setIsRunning(false);
    setTotalTime(0);
    setChartPress([{ time: -1, value: 30.0 }]);
    setChartTemp([{ time: -1, value: 5.0 }]);
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
        <Card className="lg:col-span-1 lg:w-3/4 mb-4">
          <CardContent className="flex items-center justify-center bg-sky-100 m-4">
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
        <div className="lg:col-span-1 flex space-x-4 mb-4">
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
            <CardContent className="flex items-center justify-center bg-sky-100 m-4">
              <div className="text-5xl font-bold mt-2">
                {chartPress[totalTime].value.toFixed(2)}
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
            <CardContent className="flex items-center justify-center bg-sky-100 m-4">
              <div className="text-5xl font-bold mt-2">
                {chartTemp[totalTime].value.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2">
        <div className="lg:col-span-1 flex lg:flex-col lg:items-start items-center justify-center gap-4 my-4">
          <Button
            className="bg-sky-500 px-6 py-3 text-xl w-3/4"
            onClick={handleStart}
            disabled={isRunning}
          >
            Comenzar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-sky-500 px-6 py-3 text-xl w-3/4"
                disabled={!isRunning}
              >
                Cancelar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cancelar</DialogTitle>
                <DialogDescription>
                  Esta seguro que quiere parar el ciclo.
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

        <div className="lg:col-span-1 space-y-28">
          <ChartComponent data={chartPress} />
          <ChartComponent data={chartTemp} />
        </div>
      </div>
    </main>
  );
}
