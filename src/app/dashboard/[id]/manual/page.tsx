"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Thermometer, Circle, CircleCheckBig } from "lucide-react";
import { supabase } from "@/utils/supabaseClient";
import { connectMqttClient } from "@/utils/mqtt";
import { Button } from "@/components/ui/button";
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
import { set } from "react-hook-form";

export default function Page({ params }: { params: { id: string } }) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isDoorClose, setIsDoorClose] = useState(false);
  const [isResisAlta, setIsResisAlta] = useState(false);
  const [isResisBaja, setIsResisBaja] = useState(false);
  const [isEVDrenaje, setIsEVDrenaje] = useState(false);
  const [type, setType] = useState<number>();
  const [client] = useState(connectMqttClient()); // Usar el cliente MQTT del layout
  const [chartPress, setChartPress] = useState<{ value: number }[]>([]);
  const [chartTemp, setChartTemp] = useState<{ value: number }[]>([]);
  const [digitalInputs, setDigitalInputs] = useState<{
    [key: string]: boolean;
  }>({
    open: false,
    close: false,
    door: false,
  });

  useEffect(() => {
    if (client) {
      client.on("message", (topic: string, message: Buffer) => {
        const payload = JSON.parse(message.toString());

        setChartPress((prevData) => [...prevData, { value: payload.presion }]);
        setChartTemp((prevData) => [
          ...prevData,
          { value: payload.temperatura },
        ]);
        if (payload.digital === 4) {
          setDigitalInputs({
            open: true,
            close: false,
            door: true,
          });
        }
        if (payload.digital === 1) {
          setDigitalInputs({
            open: false,
            close: false,
            door: false,
          });
        }
        if (payload.digital === 2) {
          setDigitalInputs({
            open: true,
            close: true,
            door: true,
          });
        }
      });
    }
  }, [client]);

  const toggleSwitch = (
    toggleState: boolean,
    setToggleState: React.Dispatch<React.SetStateAction<boolean>>,
    topic: string
  ) => {
    if (client) {
      const message = toggleState ? "0" : "1";
      client.publish(topic, message);
      setToggleState(!toggleState);
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
  const handleStart = () => {
    if (client) {
      // Publicar un mensaje al ESP para que comience a enviar datos
      client.publish("autoclaves/puerta", "1");
      setIsRunning(true);
    }
  };

  const handleCancel = () => {
    if (client) {
      // Publicar un mensaje al ESP para que detenga el envío de datos
      client.publish("autoclaves/puerta", "0");
    }
    setIsRunning(false);
    setChartPress([]);
    setChartTemp([]);
  };

  return (
    <main className="p-4">
      <div className="text-3xl font-bold mb-4">Control Manual</div>

      <div className="lg:grid lg:grid-cols-2">
        {/* Grid de botones */}
        <div className="lg:col-span-1 mt-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="resis-alta"
                onCheckedChange={() =>
                  toggleSwitch(
                    isResisAlta,
                    setIsResisAlta,
                    "autoclaves/resis/alta"
                  )
                }
                disabled={!isRunning}
              />
              <Label htmlFor="resis-alta">Resistencia Alta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="resis-baja"
                onCheckedChange={() =>
                  toggleSwitch(
                    isResisBaja,
                    setIsResisBaja,
                    "autoclaves/resis/baja"
                  )
                }
                disabled={!isRunning}
              />
              <Label htmlFor="resis-baja">Resistencia Baja</Label>
            </div>
            {(type === 2 || type === 4) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="ev-drenaje"
                  onCheckedChange={() =>
                    toggleSwitch(isEVDrenaje, setIsEVDrenaje, "autoclaves/ev")
                  }
                  disabled={!isRunning}
                />
                <Label htmlFor="ev--drenje">EV Drenaje</Label>
              </div>
            )}

            {(type === 3 || type === 4) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="puerta-open"
                  onCheckedChange={() =>
                    toggleSwitch(isDoorOpen, setIsDoorOpen, "autoclaves/abrir")
                  }
                  disabled={!isRunning}
                />
                <Label htmlFor="puerta">Apertura Puerta</Label>
              </div>
            )}
            {(type === 3 || type === 4) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="puerta-close"
                  onCheckedChange={() =>
                    toggleSwitch(
                      isDoorClose,
                      setIsDoorClose,
                      "autoclaves/cerrar"
                    )
                  }
                  disabled={!isRunning}
                />
                <Label htmlFor="puerta">Cierre Puerta</Label>
              </div>
            )}
          </div>
          <div className="flex items-center mt-10">
            {digitalInputs.door ? (
              <CircleCheckBig className="mr-2 text-sky-500" />
            ) : (
              <Circle className="mr-2" />
            )}
            Puerta
          </div>
          {(type === 3 || type === 4) && (
            <>
              <div className="flex items-center mt-4">
                {digitalInputs.close ? (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                ) : (
                  <Circle className="mr-2" />
                )}
                F. Carrera Cerrado
              </div>
              <div className="flex items-center mt-4">
                {digitalInputs.open ? (
                  <CircleCheckBig className="mr-2 text-sky-500" />
                ) : (
                  <Circle className="mr-2" />
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
        </div>
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
      </div>
    </main>
  );
}
