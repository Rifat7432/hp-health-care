import app from "./app";

import { Server } from "http";
import config from "./app/config";

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Server PH Health Care is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      console.log("unahandledRejection is detected , shutting down ...`, err");
      process.exit(1);
    });
  }
});
process.on("uncaughtException", () => {
  console.log("uncaughtException");
  process.exit(1);
});
