const path = require("path");
module.exports = {
  // inputPath: "rtmp://58.200.131.2:1935/livetv/hunantv",
  inputPath: "rtsp://39.96.113.7:8554/30954",
  hls_port: 8181,
  udp_port: 8182,
  wait: 30,
  log_path: "./",
  message_path:
    "../../django_test/django_test/django_test/app1/static/message/",
  options: [
    "-c:v libx264",
    "-c:a aac",
    "-ac 1",
    "-strict -2",
    "-crf 18",
    "-profile:v baseline",
    "-maxrate 400k",
    "-bufsize 1835k",
    "-pix_fmt yuv420p",
    "-hls_time 2",
    // "-hls_list_size 6",
    "-hls_wrap 20",
    "-start_number 1",
  ],
  cors: {
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
    origin: [
      // "http://192.168.0.103:3000",
      "localhost:8080",
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:3000/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:5000/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:5001/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:4000/,
      /\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:8080/,
    ],
  },
};
