import { createApp } from "./app.js";
import { config } from "./config.js";
import { ensureDefaultAdmin } from "./services/authService.js";

const app = createApp();

ensureDefaultAdmin()
  .then(() => {
    const server = app.listen(config.port, () => {
      console.log(`Mashhoodwear API listening on port ${config.port}`);
    });
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${config.port} is already in use. Stop the other process first.`);
      } else {
        console.error("Server failed to start:", error.message);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Failed to seed default admin:", error.message);
    process.exit(1);
  });
