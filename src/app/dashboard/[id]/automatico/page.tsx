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
import mqtt from "mqtt"; // Importamos la librería mqtt

export default function Page() {
  const [totalTime, setTotalTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // Configurar el cliente MQTT
    const mqttUrl = "wss://fe6ef6f5.ala.us-east-1.emqxsl.com:8084/mqtt"; // URL del broker MQTT sobre WebSocket seguro
    const options = {
      username: "casfer", // Si requiere autenticación
      password: "casfer",
      reconnectPeriod: 1000, // Intentar reconectar cada segundo
      connectTimeout: 30 * 1000,
      // Si el broker tiene certificados autofirmados, puedes usar esta opción
      // rejectUnauthorized: false,
    };

    const mqttClient = mqtt.connect(mqttUrl, options);

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      mqttClient.subscribe("autoclaves/datos", (err) => {
        if (!err) {
          console.log("Suscrito al tema autoclaves/datos");
        } else {
          console.error("Error al suscribirse:", err);
        }
      });
    });

    mqttClient.on("error", (err) => {
      console.error("Error de conexión:", err);
      mqttClient.end();
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.on("message", (topic: string, message: Buffer) => {
        const payload = JSON.parse(message.toString());
        console.log("Mensaje recibido:", payload);

        const currentTime = new Date().getTime();

        setChartPress((prevData) => [
          ...prevData,
          { time: currentTime, value: payload.presion },
        ]);
        setChartTemp((prevData) => [
          ...prevData,
          { time: currentTime, value: payload.temperatura },
        ]);

        setTotalTime((prevTime) => prevTime + 1);
      });
    }
  }, [client]);

  const handleStart = () => setIsRunning(true);

  const handleCancel = () => {
    setIsRunning(false);
    setTotalTime(0);
    setChartPress([]);
    setChartTemp([]);
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
            <CardContent className="flex items-center justify-center bg-sky-100 m-4">
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

        <div className="lg:col-span-1 space-y-28">
          {/* Gráfica de presión */}
          <ChartComponent data={chartPress} />
          {/* Gráfica de temperatura */}
          <ChartComponent data={chartTemp} />
        </div>
      </div>
    </main>
  );
}
