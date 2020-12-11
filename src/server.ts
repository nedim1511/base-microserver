
import * as dotenv from "dotenv";

dotenv.config();

import app from "./app";
import http from "http";
import logger from "./logger";
import 'source-map-support/register';

class Server {
  normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  };

  onError(error) {
    // console.log("Error create server");
     if (error.syscall !== "listen") {
       throw error;
     }
     // const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
     // switch (error.code) {
     //   case "EACCES":
     //     console.error(bind + " requires elevated privileges");
     //     process.exit(1);
     //     break;
     //   case "EADDRINUSE":
     //     console.error(bind + " is already in use");
     //     process.exit(1);
     //     break;
     //   default:
     //     throw error;
     // }
   };

   onListening() {
    // const addr = server.address();
    // const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    // debug("Listening on " + bind);
  };

  start() {
    const port = this.normalizePort(process.env.PORT || "3000");
    app.set("port", port);

    const server = http.createServer(app);
    server.on("error", this.onError);
    server.on("listening", this.onListening);
    server.listen(port);

    logger.info("Listening on port " + port);
  }
}

new Server().start();
