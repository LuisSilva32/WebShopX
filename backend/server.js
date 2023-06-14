//Creamos el servidor web utilizando "Express"
//Hacemos las importaciones necesarias
import express from "express"; //Es un framework para Node.js
import mongoose from "mongoose"; //Es una herramienta de modelado de objetos para MongoDB
import dotenv from "dotenv"; //La utilizamos para cargar variables de entorno desde el archivo ".env"
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";

//Lamamos a la función "dotenv.config()"
dotenv.config();

//Nos conectamos a la base de datos
mongoose
  .connect(process.env.MONGODB_URI) //Utilizamos la variable de entorno "MONGODB_URI"
  .then(() => {
    console.log("¡Conexión exitosa a la base de datos!"); //Si la conección es exitosa mostramos el mensaje
  })
  .catch((err) => {
    console.log(err.message); //Si no es exitosa mandamos mensaje de error
  });

//Creamos una instancia de Express
const app = express();

app.use(express.json()); //Es un middleware utilizado para analizar solicitudes HTTP con formato JSON
app.use(express.urlencoded({ extended: true })); //Es un middleware que se utiliza para analizar las solicitudes HTTP con formato x-www-form-urlencoded

//Definimos las rutas utilizando los enrutadores
app.use("/api/upload", uploadRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

//Definimos un middleware de manejo de errores que captura cualquier error que ocurra durante el procesamiento de una solicitud y envía una respuesta de error al cliente.
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//Definimos el puerto en donde se va a inicializar el servidor
const port = process.env.PORT || 5000; //Tenemos 2 opciones el de la vairable de entorno PORT o el 5000
app.listen(port, () => {
  console.log(`El servidor esta corriendo en http://localhost:${port}`); //Imprimimos el mensaje como link
});
