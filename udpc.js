const { udp_port } = require("./config");
const HOST = "127.0.0.1";

const dgram = require("dgram");
const message = Buffer.from("My KungFu is Good!");

const client = dgram.createSocket("udp4");

client.send(message, udp_port, HOST, function (err, bytes) {
  if (err) throw err;
  console.log("UDP message sent to " + HOST + ":" + udp_port);
  client.close();
});
