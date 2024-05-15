import app from "./app";

const port = 5000;
import { Server } from "http";

let server: Server;

async function main() {
  try {
    server = app.listen(port, () => {
      console.log(`Server PH Health Care is listening on port ${port}`);
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
