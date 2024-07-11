import Image from "next/image";
import AvatarProfile from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AutoclaveTable from "@/components/autoclaves/table";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="fixed right-0 left-0 top-0 py-4 px-4 flex items-center justify-between bg-sky-500">
        <aside className="flex items-center gap-[2px]">
          <Image src="/logo.png" width={150} height={100} alt="Company logo" />
        </aside>
        <AvatarProfile />
      </header>
      <div className="flex flex-1 mt-20">
        <aside className="w-1/4 p-4">
          <div className="mb-4 border p-4">
            <p>Total Equipos</p>
          </div>
          <div className="mb-4 border p-4">
            <p>Fallas del ultimo mes</p>
          </div>
          <div className="border p-4">
            <p>Fallas totales</p>
          </div>
        </aside>
        <Separator orientation="vertical" />
        <section className="flex-1 p-4">
          <AutoclaveTable />
        </section>
      </div>
    </main>
  );
}
