import Image from "next/image";
import AvatarProfile from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AutoclaveTable from "@/components/autoclaves/table";
import Overview from "@/components/dashboard/overview";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="right-0 left-0 top-0 py-4 px-4 flex items-center justify-between bg-sky-500">
        <aside className="flex items-center gap-[2px]">
          <Image src="/logo.png" width={150} height={100} alt="Company logo" />
        </aside>
        <AvatarProfile />
      </header>
      <div className="flex flex-1 mt-10 space-x-3">
        <Overview />
        <Separator orientation="vertical" />
        <section className="flex-1 p-4">
          <div className="text-2xl font-bold mb-4">Autoclaves</div>
          <AutoclaveTable />
        </section>
      </div>
    </main>
  );
}
