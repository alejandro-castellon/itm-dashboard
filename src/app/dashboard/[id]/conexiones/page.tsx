"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { connectMqttClient } from "@/app/api/mqtt";

export default function Page({ params }: { params: { id: string } }) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [client] = useState(connectMqttClient()); // Usar el cliente MQTT del layout

  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "",
    pass: "",
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutoclave = async () => {
      const { data, error } = await supabase
        .from("autoclaves")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching autoclave data:", error);
        return;
      }

      if (data) {
        setOriginalData(data);
        setFormData({
          name: data.wifi_name,
          pass: data.wifi_pass,
        });
      }
    };

    fetchAutoclave();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });

    // Actualizar ssid y password según el campo que cambie
    if (id === "name") {
      setSsid(value);
    } else if (id === "pass") {
      setPassword(value);
    }

    setIsDirty(true); // Habilitar el botón de "Guardar"
  };

  const handleSave = () => {
    if (client) {
      if (ssid === "" || password === "") {
        setErrorMessage("Todos los campos son obligatorios.");
        setSuccessMessage(null);
        return;
      }
      const message = JSON.stringify({ ssid, password });
      client.publish("esp32/wifi", message);
      setSuccessMessage("Los datos se han guardado correctamente.");
      setErrorMessage(null);
      setIsDirty(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: originalData.wifi_name,
      pass: originalData.pass_name,
    });
    setIsDirty(false);
    setErrorMessage(null);
  };

  return (
    <main className=" flex flex-col">
      <div className="text-3xl font-bold mb-4">Conexiones</div>
      <Card className="lg:w-1/3 mt-4">
        <CardHeader>
          <CardTitle>Editar conexiones</CardTitle>
          <CardDescription>Realiza cambios a tu conexion.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ssid">Nombre de la red</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la red"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="pass"
                  type="password"
                  placeholder="Contraseña de la red"
                  value={formData.pass}
                  onChange={handleChange}
                />
              </div>
            </div>
            {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled={!isDirty} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button disabled={!isDirty} onClick={handleSave}>
            Guardar
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
