"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Thermometer, Circle, CircleCheckBig } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { connectMqttClient } from "@/utils/mqtt";

export default function Page({ params }: { params: { id: string } }) {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isResisAlta, setIsResisAlta] = useState(false);
  const [isResisBaja, setIsResisBaja] = useState(false);
  const [isEVDrenaje, setIsEVDrenaje] = useState(false);
  const [type, setType] = useState<number>();
  const [client] = useState(connectMqttClient()); // Usar el cliente MQTT del layout
  const [chartPress, setChartPress] = useState<{ time: any; value: number }[]>(
    []
  );
  const [chartTemp, setChartTemp] = useState<{ time: any; value: number }[]>(
    []
  );

  useEffect(() => {
    if (client) {
      client.on("message", (topic: string, message: Buffer) => {
        const payload = JSON.parse(message.toString());

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
      const message = isDoorOpen ? "0" : "1";
      client.publish("autoclaves/puerta", message);
      setIsDoorOpen(!isDoorOpen);
    }
  };
  const handleResisAltaClick = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      const message = isResisAlta ? "0" : "1";
      client.publish("autoclaves/resis/alta", message);
      setIsResisAlta(!isResisAlta);
    }
  };
  const handleResisBajaClick = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      const message = isResisBaja ? "0" : "1";
      client.publish("autoclaves/resis/baja", message);
      setIsResisBaja(!isResisBaja);
    }
  };
  const handleEVDrenajeClick = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      const message = isEVDrenaje ? "0" : "1";
      client.publish("autoclaves/ev", message);
      setIsEVDrenaje(!isEVDrenaje);
    }
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="resis-alta" onCheckedChange={handleResisAltaClick} />
              <Label htmlFor="resis-alta">Resistencia Alta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="resis-baja" onCheckedChange={handleResisBajaClick} />
              <Label htmlFor="resis-baja">Resistencia Baja</Label>
            </div>
            {(type === 2 || type === 4) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="ev-drenaje"
                  onCheckedChange={handleEVDrenajeClick}
                />
                <Label htmlFor="ev--drenje">EV Drenaje</Label>
              </div>
            )}

            {(type === 3 || type === 4) && (
              <div className="flex items-center space-x-2">
                <Switch id="puerta" onCheckedChange={handleDoorOpenClick} />
                <Label htmlFor="puerta">Puerta</Label>
              </div>
            )}
          </div>
          <div className="flex items-center mt-10">
            {isDoorOpen ? (
              <CircleCheckBig className="mr-2 text-sky-500" />
            ) : (
              <Circle className="mr-2" />
            )}
            Puerta
          </div>
          {(type === 3 || type === 4) && (
            <>
              <div className="flex items-center mt-4">
                {isDoorOpen ? (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                ) : (
                  <Circle className="mr-2" />
                )}
                F. Carrera Cerrado
              </div>
              <div className="flex items-center mt-4">
                {isDoorOpen ? (
                  <Circle className="mr-2" />
                ) : (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                )}
                F. Carrera Abierto
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
                <CardContent className="flex items-center justify-center bg-sky-100 dark:bg-gray-800 m-4">
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
                <CardContent className="flex items-center justify-center bg-sky-100 dark:bg-gray-800 m-4">
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
