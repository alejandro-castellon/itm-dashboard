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
import { url } from "inspector";

type Estado = "Normal" | "Advertencia" | "Crítico";

interface PrediccionData {
  predicciones: {
    temperatura: number;
    presion: number;
  };
  estado: {
    temperatura: Estado;
    presion: Estado;
  };
}

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );
  const cycles = [
    { id: 1, date: new Date(2024, 0o12, 0o35, 8, 10, 8, 11) },
    {
      id: 2,
      date: new Date(2024, 0o12, 0o35, 9, 35, 30, 11),
    },
    {
      id: 3,
      date: new Date(2024, 0o12, 0o35, 10, 24, 46, 11),
    },
  ];

  const [data, setData] = useState<PrediccionData | null>(null);

  useEffect(() => {
    fetch("/api/predict")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <p>Cargando datos...</p>;

  const { predicciones, estado } = data;

  const fetchDataOnDialogOpen = async (id: number) => {
    setLoading(true); // Activar el estado de carga
    var url = "/api/getData";
    if (id === 1) url = "/api/getData2";
    if (id === 2) url = "/api/getData1";
    try {
      const response = await fetch(url);
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
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <main className="flex flex-col">
      <div className="text-3xl font-bold mb-4">Reportes</div>
      {cycles.map((cycle) => (
        <Dialog
          key={cycle.id}
          onOpenChange={() => fetchDataOnDialogOpen(cycle.id)}
        >
          <DialogTrigger asChild>
            <Card className="flex-1 cursor-pointer mb-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex">Ciclo #{cycle.id}</div>
                  <div>{cycle.date.toString()}</div>
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
                {loading ? (
                  <p>Cargando gráfica de presión...</p>
                ) : (
                  <ChartComponent data={chartPress} />
                )}
                <DialogDescription>Temperatura</DialogDescription>
                {/* Gráfica de temperatura */}
                <div className="pr-12">
                  {loading ? (
                    <p>Cargando gráfica de temperatura...</p>
                  ) : (
                    <ChartComponent data={chartTemp} />
                  )}
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
      <div className="p-4">
        <h1 className="text-xl font-bold">Mantenimiento Predictivo</h1>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Estado del Equipo</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p>
                Temperatura próxima: {predicciones.temperatura.toFixed(2)}°C
              </p>
              <p>
                Estado:{" "}
                <span
                  className={
                    estado.temperatura === "Crítico"
                      ? "text-red-600"
                      : estado.temperatura === "Advertencia"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {estado.temperatura}
                </span>
              </p>
            </div>
            <div>
              <p>Presión próxima: {predicciones.presion.toFixed(2)} bar</p>
              <p>
                Estado:{" "}
                <span
                  className={
                    estado.presion === "Crítico"
                      ? "text-red-600"
                      : estado.presion === "Advertencia"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }
                >
                  {estado.presion}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Recomendaciones</h2>
          {estado.temperatura === "Crítico" || estado.presion === "Crítico" ? (
            <p className="text-red-600">
              Atención inmediata requerida. Programar mantenimiento.
            </p>
          ) : estado.temperatura === "Advertencia" ||
            estado.presion === "Advertencia" ? (
            <p className="text-yellow-600">
              Monitorear el equipo frecuentemente.
            </p>
          ) : (
            <p className="text-green-600">
              El equipo opera dentro de parámetros normales.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
