const ffmpeg = require("fluent-ffmpeg");
const { hls_port, inputPath, options, wait } = require("./config");
const outPath = "./public/output.m3u8";
let flag = false;

var EventEmitter = require("events").EventEmitter;
var event = new EventEmitter();

if (inputPath.indexOf("rtsp") >= 0) {
  options.push("-rtsp_transport tcp");
}

let commond = ffmpeg(inputPath)
  // .inputOptions('-re')
  .on("start", function (commandLine) {
    // console.log("ffmpeg 命令: ", commandLine);
    console.log("FFmpeg start!");
  })
  .on("stderr", (e) => {
    if (e.indexOf("Connection timed out")) {
      flag = false;
    }
    console.log(e);
  })
  .on("progress", function (progress) {
    // console.log("[FFMEPG]", stderrLine);
    console.log("[FFMEPG]", progress.timemark);
    flag = true;
  })
  .on("error", function (e) {
    console.log("Ffmpeg has been killed\n");
    event.emit("run");
  })
  .addOptions(options)

  .noAudio()
  .output(outPath); // 使用 pipe 管道 ，output 和 run 不可用
commond.run();

const HLSServer = require("hls-server");
const http = require("http");
const url = require("url");
const server = http.createServer();

new HLSServer(server, {
  path: "/streams", // Base URI to output HLS streams
  dir: "./public/", // Directory that input files are stored
});
require("http-attach")(server, (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

server.listen(hls_port);

event.on("run", function () {
  commond.run();
});

setInterval(async () => {
  if (flag === false) {
    startAble = false;
    commond.kill("SIGKILL");
    flag = false;
  } else {
    flag = false;
  }
}, wait * 1000);

process.on("SIGINT", function () {
  console.log("Closing connection");
  commond.kill("SIGSTOP");
  commond.kill("SIGKILL");
  process.exit();
});

// app.listen(8000);
