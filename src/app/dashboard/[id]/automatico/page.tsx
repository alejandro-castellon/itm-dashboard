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

const initialData = [
  { time: "2018-12-22", value: 32.51 },
  { time: "2018-12-23", value: 31.11 },
  { time: "2018-12-24", value: 27.02 },
  { time: "2018-12-25", value: 27.32 },
  { time: "2018-12-26", value: 25.17 },
  { time: "2018-12-27", value: 28.89 },
  { time: "2018-12-28", value: 25.46 },
  { time: "2018-12-29", value: 23.92 },
  { time: "2018-12-30", value: 22.68 },
  { time: "2018-12-31", value: 22.67 },
];

export default function Page() {
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTotalTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleCancel = () => {
    setIsRunning(false);
    setTotalTime(0);
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
              <div className="text-5xl font-bold mt-2">5.00</div>
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
              <div className="text-5xl font-bold mt-2">35.00</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2">
        <div className="lg:col-span-1 flex lg:flex-col lg:items-start items-center justify-center gap-4 my-4">
          <Button
            className="bg-sky-500 px-6 py-3 text-xl w-3/4"
            onClick={handleStart}
          >
            Comenzar
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-500 px-6 py-3 text-xl w-3/4">
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
          <ChartComponent data={initialData} />
          <ChartComponent data={initialData} />
        </div>
      </div>
    </main>
  );
}
