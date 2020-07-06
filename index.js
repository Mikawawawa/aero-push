var ffmpeg = require("fluent-ffmpeg");

function callback() {
  // do something when stream ends and encoding finshes
}

ffmpeg("rtmp://58.200.131.2:1935/livetv/hunantv", { timeout: 432000 })
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
    "-hls_time 10",
    "-hls_list_size 6",
    "-hls_wrap 10",
    "-start_number 1",
  ])
  .output("public/videos/output.m3u8")
  .on("end", callback)
  .run();

var HLSServer = require("hls-server");
var http = require("http");

var server = http.createServer();
var hls = new HLSServer(server, {
  path: "/streams", // Base URI to output HLS streams
  dir: "public/videos", // Directory that input files are stored
});
server.listen(8000);
