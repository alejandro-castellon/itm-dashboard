"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/utils/AuthContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, role, autoclaveId, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Espera a que se cargue el estado de autenticación

    if (!user) {
      router.push("/login"); // Redirige al login si no hay usuario autenticado
      return;
    }

    if (role !== "ADMIN") {
      router.push(`/dashboard/${autoclaveId}/manual`);
    }
  }, [user, role, autoclaveId, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // Consider using a spinner or other indicator
  }
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
