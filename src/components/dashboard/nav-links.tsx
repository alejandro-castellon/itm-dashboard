"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
import { File, Info, LogOut, RotateCw, Sliders, Wifi } from "lucide-react";
import { disconnectMqttClient } from "@/app/api/mqtt";

export default function NavLinks() {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Extraer autoclaveId de la URL actual
  const match = pathname.match(/\/dashboard\/([^\/]+)\//);
  const autoclaveId = match ? match[1] : null;

  const links = [
    ...(role === "ADMIN"
      ? [
          {
            name: "Control Manual",
            href: `/dashboard/${autoclaveId}/manual`,
            icon: Sliders,
          },
        ]
      : []),
    {
      name: "Control Automático",
      href: `/dashboard/${autoclaveId}/automatico`,
      icon: RotateCw,
    },
    {
      name: "Reportes",
      href: `/dashboard/${autoclaveId}/reportes`,
      icon: File,
    },
    {
      name: "Conexiones",
      href: `/dashboard/${autoclaveId}/conexiones`,
      icon: Wifi,
    },
    {
      name: "Información",
      href: `/dashboard/${autoclaveId}/informacion`,
      icon: Info,
    },
  ];

  const handleLogout = () => {
    if (loading) return; // Espera a que se cargue el estado de autenticación

    if (!user) {
      router.push("/login"); // Redirige al login si no hay usuario autenticado
      return;
    }
    disconnectMqttClient(); // Desconectar el cliente MQTT
    if (role !== "ADMIN") {
      logout();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 hover:text-sky-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-sky-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
      <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-800 md:block"></div>
      <button
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-800 p-3 text-sm font-medium hover:bg-sky-100 hover:text-sky-600 md:flex-none md:justify-start md:p-2 md:px-3"
        onClick={handleLogout}
      >
        <LogOut className="w-6" />
        <div className="hidden md:block">Exit</div>
      </button>
    </div>
  );
}
