import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { spawn } from "child_process";
import path from "path";

const uri =
  "mongodb+srv://casfer:casfer@itm.bb3zl.mongodb.net/?retryWrites=true&w=majority&appName=ITM";
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("autoclaves");
    const collection = db.collection("ciclos3");

    // Obtener datos de ciclos finalizados
    const ciclos = await collection
      .find(
        {},
        { projection: { _id: 0, presion: 1, temperatura: 1, tiempo: 1 } }
      )
      .toArray();

    if (ciclos.length === 0) {
      return NextResponse.json(
        { error: "No hay datos para analizar" },
        { status: 400 }
      );
    }

    // Llamar al script de Python
    const scriptPath = path.join(process.cwd(), "public/scripts/predict.py");
    const pythonProcess = spawn("python3", [scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    // Enviar datos a stdin del proceso de Python
    pythonProcess.stdin.write(JSON.stringify(ciclos));
    pythonProcess.stdin.end();

    let resultado = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      resultado += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    return new Promise((resolve, reject) => {
      pythonProcess.on("close", (code) => {
        if (code === 0) {
          try {
            resolve(NextResponse.json(JSON.parse(resultado)));
          } catch (jsonError) {
            reject(
              NextResponse.json({
                error: "Error al parsear respuesta de Python",
                detalle:
                  jsonError instanceof Error
                    ? jsonError.message
                    : String(jsonError),
              })
            );
          }
        } else {
          reject(
            NextResponse.json({
              error: "Error en el procesamiento del modelo",
              detalle: errorOutput,
            })
          );
        }
      });
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error en la API",
        detalle: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
