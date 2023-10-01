// config.js
import dotenv from "dotenv";

dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/webshopx",
  PORT: process.env.PORT || 5000,
  // Agrega otras variables de configuración aquí si es necesario
};
