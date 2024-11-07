import { NextResponse } from "next/server";
import clientPromise from "@/utils/mongoDb"; // Asegúrate de que la ruta sea correcta

// Usar un objeto en memoria para almacenar el contador de milisegundos por cada segundo
let lastTimestamp: number = 0;
let secondCounter: number = 0;

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Obtén los datos enviados en el cuerpo de la solicitud
    const { temperatura, presion, tiempo } = data;

    // Crear el timestamp actual y restar 4 horas
    const timestamp = new Date(Date.now());
    timestamp.setHours(timestamp.getHours() - 4); // Resta 4 horas

    // Crear el documento para insertar en la base de datos con el timestamp ajustado
    const document = { temperatura, presion, tiempo, timestamp };

    console.log("Datos recibidos con timestamp único:", timestamp);

    // Conectar a la base de datos
    const client = await clientPromise;
    if (!client) {
      throw new Error("Failed to connect to the database");
    }
    const db = client.db("autoclaves"); // Asegúrate de que el nombre de la base de datos sea correcto
    const collection = db.collection("ciclos2"); // Asegúrate de que el nombre de la colección sea correcto

    // Inserta el documento en la colección
    const result = await collection.insertOne(document);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error al guardar datos en MongoDB:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar datos" },
      { status: 500 }
    );
  }
}
