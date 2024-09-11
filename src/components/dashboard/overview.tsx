import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabaseClient";

export default async function Overview() {
  const { count: autoclavesInCbba, error: totalError } = await supabase
    .from("autoclaves")
    .select("*", { count: "exact" })
    .eq("location", "Cochabamba"); // Solicita solo el recuento

  if (totalError) {
    console.error(
      "Error al obtener el total de autoclaves:",
      totalError.message
    );
    return;
  }

  const { count: autoclavesInOr, error: oruroError } = await supabase
    .from("autoclaves")
    .select("*", { count: "exact" })
    .eq("location", "Oruro"); // Filtra por 'location' igual a 'Oruro'

  if (oruroError) {
    console.error("Error al obtener autoclaves en Oruro:", oruroError.message);
    return;
  }

  return (
    <aside className="w-1/4 p-4 ml-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Total Equipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cochabamba</Label>
              <div className="text-2xl font-bold">{autoclavesInCbba}</div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Oruro</Label>
              <div className="text-2xl font-bold">{autoclavesInOr}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Fallas del ultimo mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cantidad</Label>
              <div className="text-2xl font-bold">5</div>
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Fallas totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cantidad</Label>
              <div className="text-2xl font-bold">5</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
