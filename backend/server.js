// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import config from "./DB/config.js"; // Archivo de configuración

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

dotenv.config();

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGODB_URI) //Utilizamos la variable de entorno "MONGODB_URI"
  .then(() => {
    console.log("¡Conexión exitosa a la base de datos!"); //Si la conección es exitosa mostramos el mensaje
  })
  .catch((err) => {
    console.log(err.message); //Si no es exitosa mandamos mensaje de error
  });

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

// Middleware de manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error("Error en la solicitud:", err.message);
  res.status(500).json({ message: "Error en el servidor." });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`El servidor está corriendo en http://localhost:${port}`);
});
