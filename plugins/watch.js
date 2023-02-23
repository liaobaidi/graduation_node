const chokidar = require("chokidar");
const { spawn } = require("child_process");
let childProcess;
const debounceStartServer = debounce(startServer, 1000);
chokidar.watch(["../server.js"]).on("all", (event, path) => {
  childProcess && childProcess.kill();
  debounceStartServer();
});
function startServer() {
  console.log("[ starting ] >", "node ../server.js");
  childProcess = spawn("node", ["../server.js"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });
}
function debounce(fun, wait = 200) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(context, args);
    }, wait);
  };
}