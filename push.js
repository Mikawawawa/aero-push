var ffmpeg = require("fluent-ffmpeg");
// var inputPath = "rtmp://58.200.131.2:1935/livetv/hunantv";
var inputPath = "rtsp://39.96.113.7:8554/30954";
var outPath = "./public/output.m3u8";

ffmpeg(inputPath)
  // .inputOptions('-re')
  .on("start", function (commandLine) {
    console.log("ffmpeg 命令: ", commandLine);
  })
  .on("error", function (err, stdout, stderr) {
    console.log("error: " + err.message);
    console.log("stdout: " + stdout);
    console.log("stderr: " + stderr);
  })
  // .on("progress", function (progress) {
  //   console.log("progressing: ", progress.percent, " % done");
  // })
  .on("stderr", function (stderrLine) {
    console.log("output: " + stderrLine);
  })
  .on("end", function () {
    console.log("完成 ");
  })
  .addOptions([
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
  ])
  .noAudio()
  // .videoCodec('copy')
  // .format("flv")
  // .format("hls")
  // .format("h264")
  // .pipe(outPath, {end: true})
  .output(outPath) // 使用 pipe 管道 ，output 和 run 不可用
  .run();

var HLSServer = require("hls-server");

const http = require("http");
const port = 8181;

const server = http.createServer();

var hls = new HLSServer(server, {
  path: "/streams", // Base URI to output HLS streams
  dir: "./public/", // Directory that input files are stored
});

require("http-attach")(server, (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

server.listen(port);

// app.listen(8000);
