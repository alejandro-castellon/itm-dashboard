"use server";
import mqtt from "mqtt";

const mqttUrl = "wss://fe6ef6f5.ala.us-east-1.emqxsl.com:8084/mqtt";
const options = {
  username: "casfer",
  password: "casfer",
  reconnectPeriod: 1000, // Reintenta reconectar cada segundo
  connectTimeout: 30 * 1000,
};

const client = mqtt.connect(mqttUrl, options);
if (typeof window === "undefined") {
  client.on("connect", () => {
    console.log("MQTT conectado en el backend");
    client.subscribe("autoclaves/datos", (err) => {
      if (err) {
        console.error("Error al suscribirse:", err);
      } else {
        console.log("Suscrito al tema autoclaves/datos");
      }
    });
  });

  client.on("message", async (topic, message) => {
    const data = JSON.parse(message.toString());
    // Aquí puedes procesar y almacenar los mensajes recibidos
    console.log(`Mensaje recibido: ${message.toString()}`);
    // Llamada a la API para guardar datos en MongoDB
    await fetch("/api/saveData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  });
}

export default client;
