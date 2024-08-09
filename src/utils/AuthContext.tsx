"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string | null;
  autoclaveId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [autoclaveId, setAutoclaveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        setUser(user);

        if (user) {
          const { data: roleData, error: roleError } = await supabase
            .from("users")
            .select("role, autoclave_id")
            .eq("id", user.id)
            .single();

          if (roleError) throw roleError;

          setRole(roleData?.role ?? null);
          setAutoclaveId(roleData?.autoclave_id ?? null);
        }
      } catch (error: any) {
        setError("Failed to fetch user or role. Please try again.");
        console.error("Error fetching user or role:", error.message);
        setUser(null);
        setRole(null);
        setAutoclaveId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null); // Resetea cualquier error anterior

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !user) {
        throw new Error("Invalid login credentials");
      }

      setUser(user);

      if (user) {
        const { data: roleData, error: roleError } = await supabase
          .from("users")
          .select("role, autoclave_id")
          .eq("id", user.id)
          .single();

        if (roleError) throw roleError;

        setRole(roleData?.role ?? null);
        setAutoclaveId(roleData?.autoclave_id ?? null);
      }
    } catch (error: any) {
      setError(
        error.message === "Invalid login credentials"
          ? "The email or password you entered is incorrect."
          : "An unexpected error occurred. Please try again."
      );
      console.error("Login error:", error.message);
      setUser(null);
      setRole(null);
      setAutoclaveId(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
      setAutoclaveId(null);
      router.push("/login");
    } catch (error: any) {
      setError("Failed to log out. Please try again.");
      console.error("Logout error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, role, autoclaveId, loading, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
