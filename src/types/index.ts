export interface User {
  id: string;
  username: string;
  role: string;
  created_at: Date;
}

export interface ReportData {
  estado: string[];
  reporte: {
    total_ciclos: number;
    ciclos_normales: number;
    ciclos_anomalos: number;
    porcentaje_anomalias: number;
    presion_max: number | null;
    presion_min: number | null;
    presion_promedio: number | null;
    temperatura_max: number | null;
    temperatura_min: number | null;
    temperatura_promedio: number | null;
    recomendacion: string;
  };
}
