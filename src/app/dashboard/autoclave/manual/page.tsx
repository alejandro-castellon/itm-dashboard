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
    <main>
      <div className="text-2xl font-bold mb-4">Control Manual</div>
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
      <Button className="m-4 bg-sky-500" onClick={handleDoorOpenClick}>
        Apertura de puerta
      </Button>
      <Button className="m-4 bg-sky-500" onClick={handleDoorCloseClick}>
        Cierre de puerta
      </Button>
      <Button className="m-4 bg-sky-500">EV drenaje</Button>
      <Button className="m-4 bg-sky-500">EV agua</Button>
      <Button className="m-4 bg-sky-500" onClick={handleAguaClick}>
        Bomba de agua
      </Button>

      <div className="flex items-center mt-4">
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
    </main>
  );
}
