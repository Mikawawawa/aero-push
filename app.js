const NodeMediaServer = require("node-media-server");

var inputPath = "rtmp://58.200.131.2:1935/livetv/hunantv";

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8181,
    mediaroot: "./media/",
    allow_origin: "*",
  },
  relay: {
    ffmpeg: "/usr/bin/ffmpeg",
    tasks: [
      {
        app: "live",
        mode: "pull",
        edge: inputPath, //rtsp
        name: "test",
        // rtsp_transport: "tcp", //['udp', 'tcp', 'udp_multicast', 'http']
      },
    ],
  },
};

var nms = new NodeMediaServer(config);
nms.run();
