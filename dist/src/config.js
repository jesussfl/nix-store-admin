"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;
const defaultEnvFile = ".env";
// Intentar cargar el archivo .env específico del entorno
let envPath = path_1.default.resolve(process.cwd(), envFile);
if (fs_1.default.existsSync(envPath)) {
    console.log(`Loading env from ${envFile}`);
    (0, dotenv_1.config)({ path: envPath });
}
else {
    // Cargar el archivo .env por defecto si el específico no existe
    envPath = path_1.default.resolve(process.cwd(), defaultEnvFile);
    if (fs_1.default.existsSync(envPath)) {
        console.log(`Loading env from ${defaultEnvFile}`);
        (0, dotenv_1.config)({ path: envPath });
    }
    else {
        console.warn("No .env file found!");
    }
}
exports.default = {
    env,
    isDev: env === "development",
    isProd: env === "production",
};
