var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var express = require("express");
const cors = require("cors");
const { execSync } = require("child_process");
const logger = require("morgan");
const app = express();
const fs = require("fs");
const path = require("path");
const config = require("./config");

app.use(logger("dev"));
app.use(cors(require("./config").cors));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.post("/name", (req, res) => {
  console.log("req body", JSON.stringify(req.body, null, 2));
  res.end();
});

app.post("/sync", (req, res) => {
  console.log("req body", JSON.stringify(req.body, null, 2));
  const defaultValue = {
    height: 0,
    speed: 0,
    flight_time: 0,
    GPS_star: 0,
    battery: 0,
    lat: 0,
    lon: 0,
    hdop: 0,
    hdg: 0,
    distance: Date.now().toLocaleString(),
  };
  const body = {
    height: "0.12",
    speed: "3.56",
    flight_time: "12345678",
    GPS_star: "5",
    battery: "78",
    lat: "786",
    lon: "23413",
  };

  const {
    flight_time,
    GPS_star: star,
    hdop,
    lon,
    lat,
    hdg,
    height,
    speed,
    battery,
    distance,
  } = { ...defaultValue, ...req.body };

  const toWrite = [
    1,
    flight_time,
    star,
    hdop,
    lon,
    lat,
    hdg,
    height,
    speed,
    battery,
    distance,
    new Date().getTime(),
  ].join(" ");

  fs.writeFileSync(
    path.resolve("./", config.message_path, "./message.txt"),
    toWrite
  );

  fs.appendFileSync(
    path.resolve("./", config.log_path, "./log.txt"),
    `[${new Date().toLocaleString()}]:` +
      JSON.stringify({
        ...defaultValue,
        ...(req.body || {}),
      }) +
      "\n"
  );

  res.end();
});

app.get("/reboot", (req, res) => {
  req.json({
    data: execSync("pm2 restart aero-push").toString(),
  });
});

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json(err);
});

app.listen(8182);
