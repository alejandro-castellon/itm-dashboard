"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Thermometer, Circle, CircleCheckBig } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { connectMqttClient } from "@/app/api/mqtt";

export default function Page({ params }: { params: { id: string } }) {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [agua, setAgua] = useState(false);
  const [type, setType] = useState<number>();
  const [client, setClient] = useState<any>(null);
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );

  useEffect(() => {
    const mqttClient = connectMqttClient(); // Conectar cliente MQTT
    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end(); // Cerrar conexión al desmontar el componente
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
      });
    }
  }, [client]);

  const handleDoorOpenClick = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      client.publish("autoclaves/control", "start");
      setIsDoorOpen(true);
    }
  };
  const handleDoorCloseClick = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      client.publish("autoclaves/control", "stop");
      setIsDoorOpen(false);
    }
  };
  const handleAguaClick = () => {
    setAgua(!agua);
  };

  useEffect(() => {
    const fetchAutoclaveType = async () => {
      const { data, error } = await supabase
        .from("autoclaves")
        .select("type")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching autoclaves:", error);
      }
      if (data) {
        setType(data.type);
      }
    };

    fetchAutoclaveType();
  }, [params.id]);

  return (
    <main className="p-4">
      <div className="text-3xl font-bold mb-4">Control Manual</div>

      <div className="lg:grid lg:grid-cols-2">
        {/* Grid de botones */}
        <div className="lg:col-span-1 mt-10">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Button className="w-full text-lg py-3 bg-sky-500">
              Resistencia
            </Button>
            <Button className="w-full text-lg py-3 bg-sky-500">
              EV drenaje
            </Button>
            {(type === 2 || type === 4) && (
              <Button
                className="w-full text-lg py-3 bg-sky-500"
                onClick={handleAguaClick}
              >
                Bomba de agua
              </Button>
            )}
          </div>
          {(type === 3 || type === 4) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button
                className="w-full text-lg py-3 bg-sky-500"
                onClick={handleDoorOpenClick}
              >
                Apertura de puerta
              </Button>
              <Button
                className="w-full text-lg py-3 bg-sky-500"
                onClick={handleDoorCloseClick}
              >
                Cierre de puerta
              </Button>
            </div>
          )}
          {type === 4 && (
            <div className="grid grid-cols-2 gap-4">
              <Button className="w-full text-lg py-3 bg-sky-500">
                EV Despresurizacion
              </Button>
            </div>
          )}

          <div className="flex items-center mt-10">
            {agua ? (
              <CircleCheckBig className="mr-2 text-sky-500" />
            ) : (
              <Circle className="mr-2" />
            )}
            Puerta
          </div>
          {(type === 2 || type === 4) && (
            <div className="flex items-center mt-4">
              {agua ? (
                <CircleCheckBig className="mr-2 text-sky-500" />
              ) : (
                <Circle className="mr-2" />
              )}
              Nivel de agua
            </div>
          )}
          {(type === 3 || type === 4) && (
            <>
              <div className="flex items-center mt-4">
                {isDoorOpen ? (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                ) : (
                  <Circle className="mr-2" />
                )}
                Puerta abierta
              </div>
              <div className="flex items-center mt-4">
                {isDoorOpen ? (
                  <Circle className="mr-2" />
                ) : (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                )}
                Puerta cerrada
              </div>
            </>
          )}
        </div>

        {/* Sección de tarjetas */}
        <div className="flex flex-col space-y-4 lg:space-y-4 lg:w-3/4 lg:ml-auto mt-10">
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
          {(type === 2 || type === 4) && (
            <>
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex">
                      <Gauge size={24} className="mr-2" />
                      Flujometro
                    </div>
                    m3/h
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
                      Cantidad agua
                    </div>
                    L
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center bg-sky-100 m-4">
                  <div className="text-5xl font-bold mt-2">35.00</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
