"use client";

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

const autoclaves = [
  {
    id: "INV001",
    location: "Cochabamba",
    type: "1",
    status: "Correcto",
  },
  {
    id: "INV002",
    location: "Cochabamba",
    type: "2",
    status: "Correcto",
  },
  {
    id: "INV003",
    location: "Oruro",
    type: "2",
    status: "Falla",
  },
  {
    id: "INV004",
    location: "Cochabamba",
    type: "3",
    status: "Correcto",
  },
];

export default function AutoclaveTable() {
  const router = useRouter();

  const handleView = () => {
    router.push("/dashboard/autoclave/manual");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {autoclaves.map((autoclave) => (
          <TableRow key={autoclave.id}>
            <TableCell className="font-medium">{autoclave.id}</TableCell>
            <TableCell>{autoclave.location}</TableCell>
            <TableCell>{autoclave.type}</TableCell>
            <TableCell>
              <AutoclaveStatus status={autoclave.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end space-x-2">
                <Button
                  className="h-7 bg-sky-500 flex items-center justify-center"
                  onClick={handleView}
                >
                  View
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
