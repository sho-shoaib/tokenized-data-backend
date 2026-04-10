import "dotenv/config";
import { sequelize } from "./src/config/database.js";
import "./src/models/index.js"; // register all models + associations
import app from "./src/app.js";
import { env } from "./src/config/env.js";

async function main() {
  await sequelize.authenticate();
  console.log("Database connected.");

  // sync tables (alter: true updates columns without dropping data)
  await sequelize.sync({ alter: true });
  console.log("Tables synced.");

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
