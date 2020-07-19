let http = require("http");
let options = {
  host: "localhost",
  port: 8182,
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
};
// 请求并没有 发出 req 是个可写流
let req = http.request(options);

req.on("response", (res) => {
  console.log(res.headers);
  let buf = [];
  res.on("data", (data) => {
    buf.push(data);
  });
  res.on("end", () => {
    console.log(Buffer.concat(buf).toString());
  });
});
// write 向请求体写数据
req.write("name=luoxiaobu&title=http");
// 实际的请求头将会与第一个数据块一起发送，或者当调用 request.end() 时发送。
req.end();
