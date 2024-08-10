"use client";

import { useState, useEffect } from "react";
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
import { supabase } from "@/utils/supabaseClient";
import { useAuth } from "@/utils/AuthContext";

export default function Page({ params }: { params: { id: string } }) {
  const { role } = useAuth();
  const [originalData, setOriginalData] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
  });
  const [isDirty, setIsDirty] = useState(false);
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
          name: data.name,
          location: data.location,
          type: data.type,
        });
      }
    };

    fetchAutoclave();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    // Validar que todos los campos no estén vacíos
    if (!formData.name || !formData.location || !formData.type) {
      setErrorMessage("Todos los campos son obligatorios.");
      setSuccessMessage(null);
      return;
    }

    const { error } = await supabase
      .from("autoclaves")
      .update(formData)
      .eq("id", params.id);

    if (error) {
      console.error("Error updating autoclave:", error);
      setErrorMessage("Error al guardar los datos. Inténtalo de nuevo.");
      setSuccessMessage(null);
    } else {
      setOriginalData(formData);
      setIsDirty(false);
      setSuccessMessage("Los datos se han guardado correctamente.");
      setErrorMessage(null);
      setTimeout(() => setSuccessMessage(null), 3000); // Ocultar el mensaje después de 3 segundos
    }
  };

  const handleCancel = () => {
    setFormData({
      name: originalData.name,
      location: originalData.location,
      type: originalData.type,
    });
    setIsDirty(false);
    setErrorMessage(null); // Limpiar mensaje de error al cancelar
  };

  return (
    <main className="flex flex-col">
      <div className="text-3xl font-bold mb-4">Información</div>
      <Card className="lg:w-1/2 mt-4">
        <CardHeader>
          <CardTitle>Editar información</CardTitle>
          <CardDescription>Actualiza los datos del autoclave.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre del autoclave"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ubicación del autoclave"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="type">Tipo</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Tipo del autoclave"
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
        {role === "ADMIN" && (
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              disabled={!isDirty}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button disabled={!isDirty} onClick={handleSave}>
              Guardar
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
