"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Thermometer, Circle, CircleCheckBig } from "lucide-react";

export default function Page() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [agua, setAgua] = useState(false);

  const handleDoorOpenClick = () => {
    setIsDoorOpen(true);
  };
  const handleDoorCloseClick = () => {
    setIsDoorOpen(false);
  };
  const handleAguaClick = () => {
    setAgua(!agua);
  };

  return (
    <main className="p-4">
      <div className="text-3xl font-bold mb-4">Control Manual</div>

      <div className="lg:grid lg:grid-cols-2">
        {/* Grid de botones */}
        <div className="lg:col-span-1 mt-10">
          <div className="grid grid-cols-3 gap-4 mb-4">
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
            <Button className="w-full text-lg py-3 bg-sky-500">
              EV drenaje
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button className="w-full text-lg py-3 bg-sky-500">EV agua</Button>
            <Button
              className="w-full text-lg py-3 bg-sky-500"
              onClick={handleAguaClick}
            >
              Bomba de agua
            </Button>
          </div>

          <div className="flex items-center mt-10">
            {agua ? (
              <CircleCheckBig className="mr-2 text-sky-500" />
            ) : (
              <Circle className="mr-2" />
            )}
            Nivel de agua
          </div>
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
        </div>

        {/* Sección de tarjetas */}
        <div className="flex flex-col space-y-4 lg:space-y-4 lg:w-3/4 lg:ml-auto mt-10">
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
              <div className="text-5xl font-bold mt-2">35.00</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
