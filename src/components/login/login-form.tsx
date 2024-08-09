"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient"; // Asegúrate de tener configurado supabaseClient
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
  username: z
    .string()
    .min(5, {
      message: "Username must be at least 5 characters.",
    })
    .max(50, {
      message: "Username must be at most 50 characters.",
    }),
  password: z.string().min(5),
});

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.username, // Supabase utiliza 'email' por defecto en su autenticación
      password: values.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Si la autenticación fue exitosa, puedes redirigir al usuario según su rol.
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (userError) {
        setError("Error fetching user role");
        setLoading(false);
        return;
      }

      // Redirige según el rol
      if (userData?.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard/autoclave/manual");
      }
    }

    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-sm"
      >
        {error && <p className="text-red-500">{error}</p>}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
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
      </form>
    </Form>
  );
}
