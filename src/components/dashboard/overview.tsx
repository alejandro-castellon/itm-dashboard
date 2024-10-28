"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabaseClient";
import React, { useState, useEffect } from "react";

export default function Overview() {
  const [countCbba, setCountCbba] = useState<number>(0);
  const [countOr, setCountOr] = useState<number>(0);

  useEffect(() => {
    const fetchCountCbba = async () => {
      const { count, error } = await supabase
        .from("autoclaves")
        .select("*", { count: "exact" })
        .eq("location", "Cochabamba");

      if (error) {
        console.error("Error fetching autoclaves:", error);
      } else {
        setCountCbba(count || 0);
      }
    };

    fetchCountCbba();
  }, []);

  useEffect(() => {
    const fetchCountOr = async () => {
      const { count, error } = await supabase
        .from("autoclaves")
        .select("*", { count: "exact" })
        .eq("location", "Oruro");

      if (error) {
        console.error("Error fetching autoclaves in Oruro:", error);
      } else {
        setCountOr(count || 0);
      }
    };

    fetchCountOr();
  }, []);

  return (
    <main className="flex flex-col md:flex-row p-4 w-full gap-4">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Total Equipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cochabamba</Label>
              <div className="text-2xl font-bold">{countCbba}</div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Oruro</Label>
              <div className="text-2xl font-bold">{countOr}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Fallas del ultimo mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cantidad</Label>
              <div className="text-2xl font-bold">5</div>
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Fallas totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Cantidad</Label>
              <div className="text-2xl font-bold">5</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
