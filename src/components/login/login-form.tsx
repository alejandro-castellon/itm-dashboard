"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/utils/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters." })
    .max(50, { message: "Email must be at most 50 characters." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." }),
});

export default function LoginForm() {
  const { login, role, autoclaveId, loading, error, user } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Efecto para manejar la redirección
  useEffect(() => {
    if (user && role && !error) {
      // Redirige basado en el rol
      if (role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push(`/dashboard/${autoclaveId}/manual`);
      }
    }
  }, [user, role, error, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLocalError(null); // Resetea el error local antes de intentar el login
    try {
      await login(values.email, values.password);
    } catch (authError: unknown) {
      // Maneja errores de autenticación de forma robusta
      if (authError instanceof Error) {
        setLocalError(
          authError.message.includes("Invalid login credentials")
            ? "The email or password you entered is incorrect."
            : authError.message
        );
      } else {
        setLocalError("An unknown error occurred. Please try again later.");
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-sm mx-auto"
      >
        {(error || localError) && (
          <p className="text-red-500">{error || localError}</p>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4 bg-sky-500"
          disabled={loading}
        >
          {loading ? "Loading..." : "Log in"}
        </Button>
        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/")}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
}
