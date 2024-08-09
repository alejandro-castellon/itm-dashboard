"use client";

import NavLinks from "./nav-links";
import Image from "next/image";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-20 items-center justify-center rounded-md bg-sky-500 p-4 md:h-40">
        <Image src="/logo.png" width={150} height={100} alt="Company logo" />
      </div>
      <NavLinks />
    </div>
  );
}
