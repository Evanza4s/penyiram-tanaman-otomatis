const aedes = require("aedes")();
const net = require("net");
const http = require("http");
const ws = require("ws");

const MQTT_PORT = 1883;
const WS_PORT = 8888;

const mqttServer = net.createServer(aedes.handle);

mqttServer.listen(MQTT_PORT, () => {
  console.log(`MQTT Broker running on port ${MQTT_PORT}`);
});

const httpServer = http.createServer();

const wss = new ws.Server({
  server: httpServer,
});

wss.on("connection", (socket) => {
  console.log("WebSocket Client Connected");

  const stream = ws.createWebSocketStream(socket);

  aedes.handle(stream);
});

httpServer.listen(WS_PORT, () => {
  console.log(`MQTT WebSocket running on port ${WS_PORT}`);
});

aedes.on("clientReady", (client) => {
  console.log(`
==================================
CLIENT CONNECTED
ID      : ${client.id}
==================================
`);
});
aedes.on("clientDisconnect", (client) => {
  console.log(`
==================================
CLIENT DISCONNECTED
ID      : ${client.id}
==================================
`);
});

aedes.on("publish", (packet, client) => {
  console.log(`
==================================
MESSAGE RECEIVED
From    : ${client ? client.id : "Broker"}
Topic   : ${packet.topic}
Message : ${packet.payload.toString()}
==================================
`);
});

aedes.on("subscribe", (subscriptions, client) => {
  if (!client) return;

  subscriptions.forEach((sub) => {
    console.log(`
SUBSCRIBE
Client : ${client.id}
Topic  : ${sub.topic}
QoS    : ${sub.qos}
`);
  });
});
