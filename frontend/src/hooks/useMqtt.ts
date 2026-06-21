import { useEffect, useCallback, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

export interface SensorData {
  time: string;
  moisture: number;
}

export function useMqtt() {
  const clientRef = useRef<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>([]);
  const [currentMoisture, setCurrentMoisture] = useState<number>(0);
  const [waterDistance, setWaterDistance] = useState<number>(0);
  const [pumpStatusStr, setPumpStatusStr] =
    useState<string>("MENUNGGU DATA...");
  const [isPumpOn, setIsPumpOn] = useState<boolean>(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const mqttClient = mqtt.connect("ws://localhost:8888");

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);
      mqttClient.subscribe("kebunku/tanah");
      mqttClient.subscribe("kebunku/air");
      mqttClient.subscribe("kebunku/pompa");
    });

    mqttClient.on("disconnect", () => setIsConnected(false));
    mqttClient.on("offline", () => setIsConnected(false));
    mqttClient.on("error", () => setIsConnected(false));

    mqttClient.on("message", (topic, message) => {
      const payload = message.toString();

      if (topic === "kebunku/tanah") {
        const moisture = parseFloat(payload);
        if (!isNaN(moisture)) {
          setCurrentMoisture(moisture);

          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

          setSensorHistory((prev) => {
            const newData = [...prev, { time: timeString, moisture }];
            if (newData.length > 20) {
              return newData.slice(newData.length - 20);
            }
            return newData;
          });
        }
      } else if (topic === "kebunku/air") {
        const distance = parseFloat(payload);
        if (!isNaN(distance)) {
          setWaterDistance(distance);
        }
      } else if (topic === "kebunku/pompa") {
        setPumpStatusStr(payload);
        setIsPumpOn(payload.includes("MENYALA"));
      }
    });

    clientRef.current = mqttClient;

    return () => {
      isMounted.current = false;
      mqttClient.end();
    };
  }, []);

  const togglePump = useCallback(
    (status: boolean) => {
      if (clientRef.current && isConnected) {
        const payload = status ? "ON" : "OFF";
        clientRef.current.publish("kebunku/pompa/kontrol", payload);
        setIsPumpOn(status);
      }
    },
    [isConnected],
  );

  return {
    isConnected,
    sensorHistory,
    currentMoisture,
    waterDistance,
    pumpStatusStr,
    isPumpOn,
    togglePump,
  };
}
