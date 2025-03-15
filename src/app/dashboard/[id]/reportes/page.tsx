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
import { ReportData } from "@/types";

export default function Reportes({ params }: { params: { id: string } }) {
  const [resultado, setResultado] = useState<ReportData | null>(null);
  const [chartData, setChartData] = useState<{ time: any; value: number }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );
  const cycles = [];
  if (params.id === "001") {
    cycles.push(
      { id: 1, date: new Date(2025, 0o0, 0o4, 8, 10, 8, 11) },
      {
        id: 2,
        date: new Date(2025, 0o0, 0o17, 9, 35, 30, 11),
      },
      {
        id: 3,
        date: new Date(2025, 0o0, 0o27, 10, 24, 46, 11),
      }
    );
  } else {
    cycles.push(
      { id: 1, date: new Date(2025, 0o0, 0o17, 8, 30, 8, 11) },
      {
        id: 2,
        date: new Date(2025, 0o0, 0o27, 11, 39, 30, 11),
      }
    );
  }

  useEffect(() => {
    const fetchPrediccion = async () => {
      try {
        let res: Response;
        if (params.id === "001") {
          res = await fetch("/api/predict");
        } else {
          res = await fetch("/api/predict2");
        }
        if (!res.ok) throw new Error("Error al obtener la predicción");

        const data = await res.json();
        setResultado(data);

        // Convertir los estados en datos numéricos para la gráfica
        interface FormattedData {
          time: number;
          value: number;
        }

        const formattedData: FormattedData[] = data.estado.map(
          (estado: string, index: number) => ({
            time: new Date(Date.now() + index * 1000), // Usando un objeto Date
            value: estado === "Anómalo" ? 1 : 0, // 1 para Anómalo, 0 para Normal
          })
        );

        setChartData(formattedData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setResultado(null);
      }
    };

    fetchPrediccion();
  }, []);

  const fetchDataOnDialogOpen = async (id: number) => {
    setLoading(true); // Activar el estado de carga
    var url = "/api/getData";
    if (params.id === "001") {
      if (id === 1) url = "/api/getData2";
      if (id === 2) url = "/api/getData4";
    } else {
      if (id === 1) url = "/api/getData5";
      if (id === 2) url = "/api/getData1";
    }
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
        <h1 className="text-xl font-bold">
          Reporte de estado del último ciclo
        </h1>
        {resultado ? (
          <div className="mt-4">
            <ChartComponent data={chartData} />
            <div className="mt-2">
              <p className="text-green-500">0 = Normal</p>
              <p className="text-red-500">1 = Anómalo</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500 mt-4">Cargando datos...</p>
        )}
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reporte de Estado
        </h1>

        {resultado ? (
          <div className="bg-white shadow-lg p-6 rounded-lg">
            {/* Resumen del Reporte */}
            <h2 className="text-lg font-semibold mt-6">Resumen del Reporte</h2>
            <div className="mt-2">
              <p>
                <strong>Total de Registros:</strong>{" "}
                {resultado.reporte.total_ciclos}
              </p>
              <p>
                <strong>Registros Normales:</strong>{" "}
                {resultado.reporte.ciclos_normales}
              </p>
              <p>
                <strong>Registros Anómalos:</strong>{" "}
                {resultado.reporte.ciclos_anomalos}
              </p>
              <p>
                <strong>Porcentaje de Anomalías:</strong>{" "}
                {resultado.reporte.porcentaje_anomalias}%
              </p>
            </div>

            {/* Datos de Presión */}
            <h2 className="text-lg font-semibold mt-6">Presión (Bar)</h2>
            <div className="mt-2">
              <p>
                <strong>Máxima:</strong> {resultado.reporte.presion_max} bar
              </p>
              <p>
                <strong>Mínima:</strong> {resultado.reporte.presion_min} bar
              </p>
              <p>
                <strong>Promedio:</strong> {resultado.reporte.presion_promedio}{" "}
                bar
              </p>
            </div>

            {/* Datos de Temperatura */}
            <h2 className="text-lg font-semibold mt-6">Temperatura (°C)</h2>
            <div className="mt-2">
              <p>
                <strong>Máxima:</strong> {resultado.reporte.temperatura_max}°C
              </p>
              <p>
                <strong>Mínima:</strong> {resultado.reporte.temperatura_min}°C
              </p>
              <p>
                <strong>Promedio:</strong>{" "}
                {resultado.reporte.temperatura_promedio}°C
              </p>
            </div>

            {/* Recomendación */}
            <h2 className="text-lg font-semibold mt-6">Recomendación</h2>
            <p
              className={`p-2 rounded-md mt-2 ${
                resultado.reporte.recomendacion ===
                "Se recomienda mantenimiento"
                  ? "bg-red-200 text-red-700"
                  : "bg-green-200 text-green-700"
              }`}
            >
              {resultado.reporte.recomendacion}
            </p>
          </div>
        ) : (
          <p className="text-gray-600 mt-4 text-center">Cargando datos...</p>
        )}
      </div>
    </main>
  );
}
