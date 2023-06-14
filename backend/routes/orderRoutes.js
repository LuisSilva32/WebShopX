//Ruta de las ordenes
//Importamos los modulos necesarios
import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { isAuth, isAdmin } from "../utils.js"; //Lo utilizamos como middleware para proteger la ruta de creacion de ordenes

// Definimos el enrutador
const orderRouter = express.Router();

//Definimos la ruta con el metodo GET para mostrar todas las ordenes
orderRouter.get(
  "/",
  isAuth, //Lo utilizamos para verificar si el usuario esta autenticado
  isAdmin, //Lo utilizamos para verificar si el usuario es administrador
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate("user", "name"); //Buscamos todos los pedidos en la base de datos y utilizamos el método "populate" de Mongoose para cargar los detalles del usuario que realizó cada pedido
    res.send(orders); //Enviamos la espuesta HTTP en formato JSON
  })
);

//Definimos la ruta con el metodo POST para agregar una nueva ordene
orderRouter.post(
  //Le asociamos una una ruta POST que maneja la creación de nuevas ordenes
  "/",
  isAuth, //Lo protegemos con "isAuth" para que solo los usuarios autenticados puedan crear nuevas ordeners, isAudith esta definida en "utils.js"
  expressAsyncHandler(async (req, res) => {
    // Creamos una nueva instancia "Order"
    const newOrder = new Order({
      //Proporcionamos los datos en el cuerpo de la solicitud
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), //Mapiamos los elemento de la matriz "orderItmes" para agregarle unos ligeros cambios.
      //Utilizamos "...x" para copiar todas las propiedades del objeto original en el nuevo objeto, asegurándose de que no se pierda ninguna información.
      //La función "map" la utilizamos para recorrer cada objeto de la matriz, crear un nuevo objeto con la mismo estructura, pero con la propiedad product adicionalmente.
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id, // Agregamos el id de usuario autenticado
    });

    //Guardamos la nueva orden en la base de datos
    const order = await newOrder.save();
    res.status(201).send({ message: "¡Nueva orden creada!", order }); //Devolvemos la respuesta con el codigo de estado 201, junto con los detalles de la orden "Order"
  })
);
//Con esta ruta mostramos la información en el dashboard
orderRouter.get(
  "/summary",
  isAuth, //Lo utilizamos para verificar si el usuario esta autenticado
  isAdmin, //Lo utilizamos para verificar si el usuario es administrador
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    //MOstramos la información de las ordenes
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    //Mostramos la información de los usuarios
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    //Mostramos la información de las categorias
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories }); //Enviamos la espuesta HTTP en formato JSON
  })
);

//Utilizamo esta ruta para obtener todas la ordenes de un usuario especifico
orderRouter.get(
  "/mine",
  isAuth, //Verificamos si el usuario esta autenticado
  //utilizamos "expressAsyncHandler" para manejar errores asincronicos
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }); //Utilizamos el metodo find del modelos order para buscar todas las ordenes que pertenezcan a ese usuario "user: req.user._id"
    res.send(orders); //Almacenamos las ordenes en la constante "Orders" y se envian en formato JSON en respuesta HTTP
  })
);

//Esta ruta la utilizamos para obtener informacion detallada de una orden especifica
orderRouter.get(
  "/:id",
  isAuth, //Verificamos si el usuario esta autenticado
  //utilizamos "expressAsyncHandler" para manejar errores asincronicos
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id); //Utilizamos el método findById del modelo Order para buscar una orden específica por su id "req.params.id"
    if (order) {
      //Si la orden existe, se envía en formato JSON en la respuesta HTTP utilizando "res.send(order)"
      res.send(order);
    } else {
      res.status(404).send({ message: "¡Orden no encontrada!" }); //Si la orden no existe se envia el mensaje
    }
  })
);
//Exportamos
export default orderRouter;
