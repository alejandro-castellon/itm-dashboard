"use client";

import { useState, useEffect } from "react";
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
import { ChartComponent } from "@/components/autoclaves/chart";

export default function Page() {
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );
  const cycles = [
    { id: 1, date: new Date().toLocaleString() },
    {
      id: 2,
      date: new Date(new Date().getTime() + 1000 * 60 * 60).toLocaleString(),
    }, // 1 hour later
    {
      id: 3,
      date: new Date(
        new Date().getTime() + 1000 * 60 * 60 * 2
      ).toLocaleString(),
    }, // 2 hours later
  ];

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

  return (
    <main className="flex flex-col">
      <div className="text-3xl font-bold mb-4">Reportes</div>
      {cycles.map((cycle) => (
        <Dialog key={cycle.id}>
          <DialogTrigger asChild>
            <Card className="flex-1 cursor-pointer mb-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex">Ciclo #{cycle.id}</div>
                  <div>{cycle.date}</div>
                </CardTitle>
              </CardHeader>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl h-screen lg:h-auto">
            <DialogHeader>
              <DialogTitle>Gráficas</DialogTitle>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <div className="space-y-4 lg:space-y-8 w-full pr-10">
                <DialogDescription>Presión</DialogDescription>
                {/* Gráfica de presión */}
                <ChartComponent data={chartPress} />
                <DialogDescription>Temperatura</DialogDescription>
                {/* Gráfica de temperatura */}
                <div className="pr-12">
                  <ChartComponent data={chartTemp} />
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </main>
  );
}
