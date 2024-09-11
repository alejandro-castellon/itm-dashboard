import mqtt from "mqtt";
import { supabase } from "@/utils/supabaseClient";

export default function handler(req, res) {
  if (!global.mqttClient) {
    const mqttClient = mqtt.connect("mqtt://TU_BROKER_MQTT_IP");

    mqttClient.on("connect", () => {
      console.log("Conectado al broker MQTT");
      mqttClient.subscribe("autoclaves/datos", (err) => {
        if (!err) {
          console.log("Suscrito al tema autoclaves/datos");
        }
      });
    });

    mqttClient.on("message", async (topic, message) => {
      console.log("Mensaje recibido:", message.toString());

      // Parsear el mensaje recibido
      const datos = JSON.parse(message.toString());

      // Insertar los datos en Supabase
      const { data, error } = await supabase.from("autoclaves").insert([datos]);

      if (error) {
        console.error("Error insertando en Supabase:", error);
      } else {
        console.log("Datos insertados en Supabase:", data);
      }
    });

    global.mqttClient = mqttClient;
  }

  res.status(200).json({ message: "Servidor MQTT funcionando" });
}
