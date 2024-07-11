"use client";

import { LogOut } from "lucide-react";
import NavLinks from "./nav-links";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SideNav() {
  const router = useRouter();

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing session, etc.)

    // Redirect to /dashboard after logout
    router.push("/dashboard");
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-sky-500 p-4 md:h-40">
        <Image src="/logo.png" width={150} height={100} alt="Company logo" />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <button
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-sky-600 md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={handleLogout}
        >
          <LogOut className="w-6" />
          <div className="hidden md:block">Exit</div>
        </button>
      </div>
    </div>
  );
}
