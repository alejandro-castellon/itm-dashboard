// src/app/api/getLatestData/route.ts
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

    // Encuentra el documento más reciente (ordenado por timestamp)
    const latestData = await collection
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    return NextResponse.json(latestData[0]); // Retorna solo el último valor
  } catch (error) {
    console.error("Error al obtener el último dato de MongoDB:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el último dato" },
      { status: 500 }
    );
  }
}