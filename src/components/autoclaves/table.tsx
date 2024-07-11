import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Cochabamba",
    paymentMethod: "1",
  },
  {
    invoice: "INV002",
    paymentStatus: "Cochabamba",
    paymentMethod: "2",
  },
  {
    invoice: "INV003",
    paymentStatus: "Oruro",
    paymentMethod: "2",
  },
  {
    invoice: "INV004",
    paymentStatus: "Cochabamba",
    paymentMethod: "3",
  },
];

export default function AutoclaveTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">
              <Button className="h-7 bg-sky-500">View</Button>
              <button>
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
