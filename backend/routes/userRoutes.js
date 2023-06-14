//Este código define un enrutador de Express que maneja las solicitudes HTTP relacionadas con los usuarios
//Importamos lo necesario
import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { isAuth, generateToken, isAdmin } from "../utils.js";

//Definimos el enrutador de usuarios "userRouter"
const userRouter = express.Router();

//Ruta "/" la utilizamos para mostrar a todos los usuarios registrados
userRouter.get(
  "/",
  isAuth, //Lo utilizamos pra verificar si el usuario esta autenticado
  isAdmin, //Lo utilizamos para verificar si el usuario es administrador
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({}); //Utilizamos "find" para buscar a todos los usuarios en la base de datos
    res.send(users); //Enviamos la espuesta HTTP en formato JSON
  })
);

//En esta ruta mostramos un usuario en especifico
userRouter.get(
  "/:id",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea administrdor
  //Utilizamos "expressAsyncHandler" para manejar errores asincronos
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); //utilizamos findById del modelo User para buscar el producto en la base de datos
    //Si el usuario existe
    if (user) {
      res.send(user); ////Enviamos la espuesta HTTP en formato JSON
      //Si no existe
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" }); //Enviamos el mensaje
    }
  })
);

//En esta ruta el administrador actuliza a un usuario en especifico
userRouter.put(
  "/:id",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea administrdor
  //Utilizamos "expressAsyncHandler" para manejar errores asincronos
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); //utilizamos findById del modelo User para buscar el usuario en la base de datos
    //Si el producto existe se actualizan sus campos
    if (user) {
      //Utilizamos los valores proporcionados en la solicitud HTTP "req.body"
      user.name = req.body.name || user.name; //Nuevo nombre
      user.email = req.body.email || user.email; //Nuevo email
      user.isAdmin = Boolean(req.body.isAdmin); //Verificamos si se le otorgo los permisos de adminstrador
      const updatedUser = await user.save(); //Utilizamos el metodo "save()" para guardarlo en la base de datos
      //Enviamos la respuesta HTTP en formato JSON con el siguiente mensaje
      res.send({
        message: "¡Usuario actualizado con exito!",
        user: updatedUser,
      });
      //Si el usuario no existe
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" }); //Enviamos el mensaje
    }
  })
);

//En esta ruta el administrador elimina un usuario en especifico
userRouter.delete(
  "/:id",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea administrdor
  //Utilizamos "expressAsyncHandler" para manejar errores asincronos
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); //utilizamos findById del modelo User para buscar el usuario en la base de datos
    //Utilizamo una condición para que no se pueda eliminar al usuario administrador
    if (user) {
      //Si el email es igual al de la condición
      if (user.email === "admin@webshopx.com") {
        //Enviamos un error con el siguite mensaje
        res
          .status(400)
          .send({ message: "¡No se puede eliminar al usuario administrador!" });
        return;
      }
      //Si el usuario existe lo eliminamos
      await user.deleteOne();
      res.send({ message: "¡Usuario eliminado con exito!" }); //Enviamos el mensaje
      //Si no existe enviamos el error con el siguiente mensaje
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" });
    }
  })
);

//Ruta "signin" la utilizamos para manerjar las solicitudes de inicio de sesión de los usuarios
userRouter.post(
  "/signin",
  //"expressAsyncHandler" función middleware nos permite manejar errores asincrónicos utilizando try/catch para enviar una respuesta HTTP con un estado 500 (Error interno del servidor)
  expressAsyncHandler(async (req, res) => {
    //Buscamos al usuario en la base de datos por medio del email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //Comparamos sus contraseñas las cuales estan enciptadas con "bcrypt"
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //Si se encuentra un usuario devolvemos una respuesta HTTP con los detalles
        res.send({
          _id: user._id, //id
          name: user.name, //Nombre
          email: user.email, //Email
          isAdmin: user.isAdmin, //Estado de administrador
          token: generateToken(user), //Un token generado por la función "generateToken"
        });
        return;
      }
    }
    //Si las contraseñas no coinciden o si no se encuentra ningún usuario con el correo electrónico proporcionado, se devuelve una respuesta HTTP con un estado 401
    res.status(401).send({ message: "¡Email o contraseña incorrecta!" }); //Mostramos el mensaje
  })
);

//Ruta "signup" la utilizamos para manejar las solicitudes de registro de los nuevos usuarios
userRouter.post(
  "/signup",
  //función middleware nos permite manejar errores asincrónicos
  expressAsyncHandler(async (req, res) => {
    //Creamos un nuevo usuario
    const newUser = new User({
      name: req.body.name, //Nombre
      email: req.body.email, //Email
      password: bcrypt.hashSync(req.body.password), //Contraseña
    });
    //Lo guardamos en la base de datos
    const user = await newUser.save();
    //Se devuelve una respuesta HTTP con los detalles del usuario
    res.send({
      _id: user._id, //id
      name: user.name, //Nombre
      email: user.email, //Email
      isAdmin: user.isAdmin, //Rol
      token: generateToken(user), //Y su token
    });
  })
);

//Ruta "profile" la utilizamos para manejar las solicitudes de actualización de perfil de los usuarios
userRouter.put(
  "/profile",
  isAuth, //Verificamos que el usuario este autenticado con la función "isAuth"
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); //Buscamos al usuario por medio del id
    if (user) {
      //Si se encuentra al usuario, actualizamos
      user.name = req.body.name || user.name; //Nombre
      user.email = req.body.email || user.email; //Email
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8); //Contraseña
      }

      //Guardamos al usuario actualizado en la base de datos
      const updatedUser = await user.save();
      res.send({
        //Enviamos la información actualizada
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "¡Usuario no encontrado!" }); //Si el usuario no se encuentra registrado eniamos el mensaje
    }
  })
);
//Exportamos la ruta de usuarios
export default userRouter;
