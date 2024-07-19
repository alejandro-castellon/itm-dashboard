import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Gauge, Thermometer, Timer } from "lucide-react";

export default function Page() {
  return (
    <main>
      <div className="text-2xl font-bold mb-4">Control Automático</div>
      <Card>
        <CardContent className="flex items-center justify-center bg-sky-100 m-4">
          <div className="text-5xl font-bold mt-3">00.00</div>
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
          <div className="text-5xl font-bold mt-2">5.00 </div>
        </CardContent>
      </Card>
      <Button className="mt-4 bg-sky-500">Comenzar</Button>
      <Button className="mt-4 bg-sky-500">Cancelar</Button>
      <img src="/charts.svg" width={300} height={500} />
    </main>
  );
}
