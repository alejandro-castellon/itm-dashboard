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
      <div className="text-3xl font-bold mb-4">Información</div>
      <Card className="w-[350px] mt-4">
        <CardHeader>
          <CardTitle>Editar información</CardTitle>
          <CardDescription>Actualiza los datos del autoclave.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nomre</Label>
                <Input id="name" placeholder="Nombre del autoclave" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Tipo</Label>
                <Input id="name" placeholder="Tipo de autoclave" />
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
