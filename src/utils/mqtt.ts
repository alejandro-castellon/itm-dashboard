import mqtt, { MqttClient } from "mqtt";

let mqttClient: MqttClient | null = null; // Cliente MQTT singleton

export const connectMqttClient = (): MqttClient => {
  if (mqttClient) return mqttClient; // Retorna el cliente existente

  const mqttUrl = "wss://fe6ef6f5.ala.us-east-1.emqxsl.com:8084/mqtt";
  const options = {
    username: "casfer",
    password: "casfer",
    reconnectPeriod: 1000, // Reintenta reconectar cada segundo
    connectTimeout: 30 * 1000,
  };

  mqttClient = mqtt.connect(mqttUrl, options);

  mqttClient.on("connect", () => {
    console.log("Conectado al broker MQTT");
    subscribeToTopics(); // Suscribirse después de la conexión
  });

  mqttClient.on("error", (err) => {
    console.error("Error de conexión:", err);
    mqttClient!.end();
  });

  return mqttClient;
};

// Función para manejar la suscripción a temas
const subscribeToTopics = () => {
  if (!mqttClient) return;

  mqttClient.subscribe("autoclaves/datos", (err) => {
    if (err) {
      console.error("Error al suscribirse:", err);
    } else {
      console.log("Suscrito al tema autoclaves/datos");
    }
  });
};

export const disconnectMqttClient = () => {
  if (mqttClient) {
    mqttClient.end();
    mqttClient = null;
    console.log("Cliente MQTT desconectado");
  }
};
