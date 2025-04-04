import { config } from "dotenv";
import path from "path";
import fs from "fs";

const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;
const defaultEnvFile = ".env";

// Intentar cargar el archivo .env específico del entorno
let envPath = path.resolve(process.cwd(), envFile);
if (fs.existsSync(envPath)) {
  console.log(`Loading env from ${envFile}`);
  config({ path: envPath });
} else {
  // Cargar el archivo .env por defecto si el específico no existe
  envPath = path.resolve(process.cwd(), defaultEnvFile);
  if (fs.existsSync(envPath)) {
    console.log(`Loading env from ${defaultEnvFile}`);
    config({ path: envPath });
  } else {
    console.warn("No .env file found!");
  }
}

export default {
  env,
  isDev: env === "development",
  isProd: env === "production",
};
