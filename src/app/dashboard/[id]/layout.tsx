import SideNav from "@/components/dashboard/sidenav";
import { ModeToggle } from "@/components/ui/theme";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="absolute top-0 right-0 p-8">
        <ModeToggle />
      </div>
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
