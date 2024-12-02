import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import * as ss from "simple-statistics";

const client = new MongoClient(process.env.MONGODB_URI!);

// Define umbrales críticos
const TEMPERATURA_CRITICA = 120;
const PRESION_CRITICA = 2;

export async function GET() {
  try {
    await client.connect();
    const db = client.db("autoclaves");
    const collection = db.collection("ciclos3");

    const data = await collection.find({}).sort({ tiempo: -1 }).toArray();

    const temperaturas = data.map((d) => d.temperatura);
    const presiones = data.map((d) => d.presion);
    const tiempos = data.map((_, i) => i);

    const tendenciaTemp = ss.linearRegression(
      tiempos.map((_, i) => [tiempos[i], temperaturas[i]])
    );
    const tendenciaPres = ss.linearRegression(
      tiempos.map((_, i) => [tiempos[i], presiones[i]])
    );

    const proximaTemp = ss.linearRegressionLine(tendenciaTemp)(tiempos.length);
    const proximaPres = ss.linearRegressionLine(tendenciaPres)(tiempos.length);

    // Determinar el estado predictivo
    const estado = {
      temperatura:
        proximaTemp > TEMPERATURA_CRITICA
          ? "Crítico"
          : proximaTemp > TEMPERATURA_CRITICA * 0.8
          ? "Advertencia"
          : "Normal",
      presion:
        proximaPres > PRESION_CRITICA
          ? "Crítico"
          : proximaPres > PRESION_CRITICA * 0.8
          ? "Advertencia"
          : "Normal",
    };

    return NextResponse.json({
      predicciones: {
        temperatura: proximaTemp,
        presion: proximaPres,
      },
      estado,
    });
  } catch (error) {
    console.error("Error en el análisis predictivo:", error);
    return NextResponse.json(
      { error: "Error en el análisis predictivo" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
