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

export default function Page() {
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTotalTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

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
    <main>
      <div className="text-3xl font-bold mb-4">Control Automático</div>
      <Card>
        <CardContent className="flex items-center justify-center bg-sky-100 m-4">
          <div className="text-5xl font-bold mt-3">{formatTime(totalTime)}</div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex text-2xl font-bold items-center">
            <Timer size={24} className="mr-2" />
            Tiempo Total
          </div>
        </CardFooter>
      </Card>

      <Card>
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
      <Card>
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
          <div className="text-5xl font-bold mt-2">35.00 </div>
        </CardContent>
      </Card>
      <Button className="m-4 bg-sky-500" onClick={handleStart}>
        Comenzar
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="m-4 bg-sky-500">Cancelar</Button>
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
      <img src="/charts.svg" width={300} height={500} />
    </main>
  );
}
