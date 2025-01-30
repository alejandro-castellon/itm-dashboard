import sys
import json
import pickle
import numpy as np

try:
    # Cargar modelo entrenado
    model_path = "public/scripts/isolation_forest.pkl"
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    # Leer datos de stdin
    input_data = sys.stdin.read().strip()
    if not input_data:
        raise ValueError("No se recibieron datos de entrada")

    ciclos = json.loads(input_data)

    # Convertir datos a un array numpy
    X_test = np.array([[d["presion"], d["temperatura"], d["tiempo"]] for d in ciclos])

    # Predecir si hay anomalías
    predicciones = model.predict(X_test)
    estado = ["Anómalo" if p == -1 else "Normal" for p in predicciones]

    # Calcular métricas para el reporte
    total = len(estado)
    anomalos = estado.count("Anómalo")
    normales = estado.count("Normal")
    porcentaje_anomalias = (anomalos / total) * 100 if total > 0 else 0

    # Obtener estadísticas generales
    presiones = [d["presion"] for d in ciclos]
    temperaturas = [d["temperatura"] for d in ciclos]

    reporte = {
        "estado": estado,
        "reporte": {
            "total_ciclos": total,
            "ciclos_normales": normales,
            "ciclos_anomalos": anomalos,
            "porcentaje_anomalias": round(porcentaje_anomalias, 2),
            "presion_max": max(presiones) if presiones else None,
            "presion_min": min(presiones) if presiones else None,
            "presion_promedio": round(sum(presiones) / total, 2) if total > 0 else None,
            "temperatura_max": max(temperaturas) if temperaturas else None,
            "temperatura_min": min(temperaturas) if temperaturas else None,
            "temperatura_promedio": round(sum(temperaturas) / total, 2) if total > 0 else None,
            "recomendacion": "Se recomienda mantenimiento" if porcentaje_anomalias > 20 else "Operación normal",
        },
    }

    # Devolver el reporte en JSON
    print(json.dumps(reporte))

except Exception as e:
    print(json.dumps({"error": f"Error en procesamiento: {str(e)}"}), file=sys.stderr)
    sys.exit(1)
