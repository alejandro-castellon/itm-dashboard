// src/lib/mqttClient.ts
import mqtt, { MqttClient } from "mqtt";

export const connectMqttClient = (): MqttClient => {
  const mqttUrl = "wss://fe6ef6f5.ala.us-east-1.emqxsl.com:8084/mqtt";
  const options = {
    username: "casfer",
    password: "casfer",
    reconnectPeriod: 1000, // Reintenta reconectar cada segundo
    connectTimeout: 30 * 1000,
  };

  const client = mqtt.connect(mqttUrl, options);

  client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe("autoclaves/datos", (err) => {
      if (err) {
        console.error("Error al suscribirse:", err);
      } else {
        console.log("Suscrito al tema autoclaves/datos");
      }
    });
  });

  client.on("error", (err) => {
    console.error("Error de conexión:", err);
    client.end();
  });

  return client;
};
