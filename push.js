const ffmpeg = require("fluent-ffmpeg");
const { hls_port, inputPath, options, wait } = require("./config");
const { execSync } = require("child_process");
const outPath = "./public/output.m3u8";

var EventEmitter = require("events").EventEmitter;
var event = new EventEmitter();

class Puller {
  constructor() {
    this.flag = false;
    this.timer = undefined;
    this.commond = this.createCommond();
    console.log(this.commond);
  }

  run() {
    this.commond.run();
    if (!this.watcher) {
      this.watchDog();
    }
  }

  push() {
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
  }

  throttle() {
    this.flag = true;
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.flag = false;
    }, 5000);
  }

  createCommond() {
    if (inputPath.indexOf("rtsp") >= 0) {
      options.push("-rtsp_transport tcp");
    }
    return (
      new ffmpeg(inputPath)
        // .inputOptions('-re')
        .on("start", () => {
          // console.log("ffmpeg 命令: ", commandLine);
          console.log("FFmpeg start!");
        })
        .on("stderr", (e) => {
          console.log(e);
        })
        .on("error", function (e) {
          console.log(e);
        })
        .on("progress", (progress) => {
          this.throttle();
        })
        .on("error", function (e) {
          console.log("Ffmpeg has been killed\n");
          event.emit("run");
        })
        .addOptions(options)
        .noAudio()
        .output(outPath)
    ); // 使用 pipe 管道 ，output 和 run 不可用
  }

  watchDog() {
    this.watcher = true;
    event.on("run", () => {
      this.run();
    });

    setInterval(async () => {
      if (this.flag === false) {
        this.commond.kill("SIGKILL");
        console.log(
          execSync(
            "ps -ef |grep ffprobe|grep -v grep|cut -c 9-15 | xargs kill"
          ).toString()
        );
        this.flag = false;
      } else {
        this.flag = false;
      }
    }, wait * 1000);

    process.on("SIGINT", function () {
      console.log("Closing connection");
      this.commond.kill("SIGKILL");
      process.exit();
    });
  }
}

(() => {
  const puller = new Puller();
  puller.run();
  puller.push();
})();
