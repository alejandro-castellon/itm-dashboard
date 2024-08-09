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
                <button className="h-7 flex items-center justify-center">
                  <Trash2 className="text-red-600" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
