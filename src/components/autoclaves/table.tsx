"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import AutoclaveStatus from "./status";
import { supabase } from "@/utils/supabaseClient";

export default function AutoclaveTable() {
  const [autoclaves, setAutoclaves] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAutoclaves = async () => {
      const { data, error } = await supabase.from("autoclaves").select("*");

      if (error) {
        console.error("Error fetching autoclaves:", error);
      } else {
        setAutoclaves(data || []);
      }
    };

    fetchAutoclaves();
  }, []);

  const handleView = (id: string) => {
    router.push(`/dashboard/${id}/manual`);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("autoclaves").delete().eq("id", id);

    if (error) {
      console.error("Error deleting autoclave:", error);
    } else {
      // Actualiza la lista de autoclaves sin el eliminado
      setAutoclaves((prevAutoclaves) =>
        prevAutoclaves.filter((autoclave) => autoclave.id !== id)
      );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {autoclaves.map((autoclave) => (
          <TableRow key={autoclave.id}>
            <TableCell className="font-medium">{autoclave.id}</TableCell>
            <TableCell>{autoclave.name}</TableCell>
            <TableCell>{autoclave.location}</TableCell>
            <TableCell>{autoclave.type}</TableCell>
            <TableCell>
              <AutoclaveStatus status={autoclave.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button
                  className="h-7 bg-sky-500 flex items-center justify-center"
                  onClick={() => handleView(autoclave.id)}
                >
                  Ver
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-7 flex items-center justify-center">
                      <Trash2 className="text-red-600" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Esta seguro que quiere eliminar la autoclave.
                      </DialogTitle>
                      <DialogDescription>
                        Se quitara todo el contenido de la autoclave.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleDelete(autoclave.id)}
                        >
                          Eliminar Autoclave
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
