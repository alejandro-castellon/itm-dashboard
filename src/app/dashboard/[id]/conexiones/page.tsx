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
export default function Page() {
  return (
    <main className=" flex flex-col">
      <div className="text-3xl font-bold mb-4">Conexiones</div>
      <Card className="w-[350px] mt-4">
        <CardHeader>
          <CardTitle>Editar conexiones</CardTitle>
          <CardDescription>Realiza cambios a tu conexion.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nomre</Label>
                <Input id="name" placeholder="Nombre de la conexion" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Red</Label>
                <Input id="name" placeholder="Red de la conexion" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button>Guardar</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
