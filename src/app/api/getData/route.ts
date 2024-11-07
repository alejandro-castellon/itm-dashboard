// src/app/api/getData/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/utils/mongoDb";

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) {
      throw new Error("Failed to connect to MongoDB");
    }
    const db = client.db("autoclaves");
    const collection = db.collection("ciclos2");

    // Asegúrate de ordenar por el campo 'timestamp' de manera ascendente
    const data = await collection
      .find({})
      .sort({ timestamp: 1 }) // Ordenar ascendente por el campo 'timestamp'
      .toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener datos de MongoDB:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener datos" },
      { status: 500 }
    );
  }
}
