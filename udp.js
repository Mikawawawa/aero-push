const target = "0 0.409 14 0.79 27.9774104 120.7446904 311 13.775 0.0 94 0.0";

// 例子：UDP服务端
const fs = require("fs");
const path = require("path");
const { udp_port, message_path } = require("./config");
// const HOST = "0.0.0.0";

const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.on("listening", function () {
  const address = server.address();
  console.log(
    "UDP Server listening on " + address.address + ":" + address.port
  );
});

server.on("message", function (message, remote) {
  console.log(remote.address + ":" + remote.port + " - " + message);
  fs.appendFileSync(
    path.resolve("./", message_path, "./message.txt"),
    "[" +
      new Date().toLocaleString() +
      "] " +
      remote.address +
      ":" +
      remote.port +
      " - " +
      message +
      "\n"
  );
});

server.bind(udp_port);
