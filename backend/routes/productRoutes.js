//Ruta de los productos
//Hacemos las importaciones necesarias
import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils.js";

//Definimos el enrutador de los productos "productRoutes"
const productRoutes = express.Router();

//Con esta ruta obtenemos a todods los productos
productRoutes.get("/", async (req, res) => {
  //Utilizamos a "find" para buscar a todos los prodcutos en la base de datos
  const products = await Product.find(); //Almacenamos los productos en la constante "products"
  res.send(products); //Enviamos la espuesta HTTP en formato JSON
});

//En esta ruta agregamos un nuevo producto pero solo si el usuario tiene los permisos
productRoutes.post(
  "/",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea andministrador
  //Utilizamos "expressAsyncHandler" para manejar errores asincronos
  expressAsyncHandler(async (req, res) => {
    //Creamos un nuevo producto utilizando el modelo de "Product"
    const newProduct = new Product({
      name: "Nombre del producto" + Date.now(), //Nombre
      slug: "nombre-del-producto-como-link" + Date.now(), //Link
      image: "/images/p1.jpg", //Imagen
      price: 0, //Precio
      category: "Ej: Autos, zapatos, ropa, tecnologia, etc.", //Catetgoria
      brand: "Marca del producto", // Marca
      countInStock: 0, //Stock
      rating: 0, //Calificación
      numReviews: 0, //Numero de reseñs
      description: "¡Describe tu producto aqui!", //Descripción
    });
    const product = await newProduct.save(); //Guardamos el producto nuevo en la base de datos
    //Enviamos la respuesta HTTP en formato JSON con el siguiente mensaje
    res.send({ message: "Producto agregado correctamente", product });
  })
);

//En esta ruta actualizamos un prodcuto existente
productRoutes.put(
  "/:id",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea administrdor
  //Utilizamos "expressAsyncHandler" para manejar errores asincronos
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id; //Obtenemos el id del producto que deseamos actualizar
    const product = await Product.findById(productId); //utilizamos findById del modelo Product para buscar el producto en la base de datos
    //Si el producto existe se actualizan sus campos
    if (product) {
      //Utilizamos los valores proporcionados en la solicitud HTTP "req.body"
      product.name = req.body.name; //Nuevo nombre
      product.slug = req.body.slug; //Nuevo link
      product.price = req.body.price; //Nuevo precio
      product.image = req.body.image; //Nueva imagen
      product.category = req.body.category; //Nueva categoria
      product.brand = req.body.brand; //Nueva marca
      product.countInStock = req.body.countInStock; //Nuevo stock
      product.description = req.body.description; //Nueva descripción
      await product.save(); //Utilizamos el metodo "save()" para guardarlo en la base de datos
      res.send({ message: "¡Producto acatualizado con exito!" });
      //Enviamos la respuesta HTTP en formato JSON con el siguiente mensaje
    } else {
      //Si el producto no existe enviamos el mensaje
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  })
);

//En esta ruta eliminamos un producto existente
productRoutes.delete(
  "/:id",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamo que sea administrador
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id); //utilizamos findById del modelo Product para buscar el producto en la base de datos
    //Si el producto existe lo eliminamos
    if (product) {
      await product.deleteOne();
      res.send({ message: "¡Producto eliminado con extito!" }); //Enviamos el mensaje
    } else {
      //Si no existe enviamos el error con el siguiente mensaje
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  })
);

//En esta ruta el ususario deja su calificación del producto
productRoutes.post(
  "/:id/reviews",
  isAuth, //Verificamos que este autenticado
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id; //Obtenemos el id del producto al que se le ava a hacer el comentario
    const product = await Product.findById(productId); //Buscamos el producto en la base de datos
    if (product) {
      //Si el usuario ya ha comentado antes ya no lo puede hacer
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res.status(400).send({ message: "¡Ya hiciste un comentario!" }); //Mostramos el mensaje por pantalla
      }
      //Creamos el objeto "review" que contiene los datos del usuario que esta haciendo el comenterio
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review); //Utilizamos el metodo "push" para agregar las reseñas al campo "reviews"
      product.numReviews = product.reviews.length; //Actualizamos el campo "numReviews"
      //Calculamos el promedio de todas las calificaciones
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save(); //Guardamos el producto con su actualizacion en la base de datos utilizando el metod "save"
      //Si la operación se guarda con exito, se envía una respuesta HTTP en formato JSON
      res.status(201).send({
        message: "¡Comentario agregado con exito!", //Mostramos el menaje en pantalla
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews, //Actualizamos el campo "numReviews"
        rating: product.rating, //Actualizamos el campo "rating"
      });
      //Si el producto no existe mostramos mensaje
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  })
);

const PAGE_SIZE = 6;
//En esta ruta obtenemos la lista de todos los productos que se encuentran en la base de datos
productRoutes.get(
  "/admin",
  isAuth, //Verificamos que este autenticado
  isAdmin, //Verificamos que sea administrador
  //Manejamos los errores asincronos
  expressAsyncHandler(async (req, res) => {
    const { query } = req; //Obtenemos los parametros de busqueda de la solicitud HTTP con "req.query"
    const page = query.page || 1; //Definimos el parametro para la pagina actual
    const pageSize = query.pageSize || PAGE_SIZE; //Definimos el tamaño de la pagina
    //Realizamos la consulta en la base de datos
    const products = await Product.find()
      .skip(pageSize * (page - 1)) //Utilizamos "Skip" para saltar los productos que ya hemos mostrado en paginas anteriores, es decir para que no se repitan
      .limit(pageSize); //Utilizamos "limit" para limitar el número de productos que se devuelven en cada página

    const countProducts = await Product.countDocuments(); //Contamos el número total de productos en la base de datos utilizando el método "countDocuments" del modelo "Product"
    //Enviamos la respuesta HTTP en formato JSON que contiene todo lo anterior
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//Definimos la ruta "search"
productRoutes.get(
  "/search",
  //Manejamos los errores asincronicos
  expressAsyncHandler(async (req, res) => {
    //Obtenemos los parametros de busqueda de la solicitud HTTP utilizando "req.query"
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE; //Definimos el tamaño de la pagina
    const page = query.page || 1; //Pagina actual
    const category = query.category || ""; //Categoria
    const price = query.price || ""; //Precio
    const rating = query.rating || ""; //Clificacion
    const order = query.order || ""; //Orden
    const searchQuery = query.query || "";
    //Definimos los filtros de busqueda
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            name: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};
    //Buscamos por categoria
    const categoryFilter = category && category !== "all" ? { category } : {};
    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    //Buscamos por precio
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    //Definimos el orden en que se devolveran los productos
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };
    //Realizamos la consulta en la base de datos con los filtros aplicados anteriormente
    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      //Se aplican los filtros definidos anteriormente y se ordenan los resultados según el orden definido en "sortOrder"
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    //Contamos los productos que coincides con los filtros utilizando el metodo "countDocuments" del modelo "Product"
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    //Se envia la respuesta HTTP en formato JSON con los productos encontrados que cuentan con todos los filtros
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

//Definimos la ruta categorias
productRoutes.get(
  "/categories",
  //Manejamos los errores asincronicos
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category"); //Usamos "distinct" de Mongoose para obtener una lista de categorias unica de todos los productos
    //Enviamos la respuesta HTTP en formato JSON el cual contiene la lista de categorias
    res.send(categories);
  })
);

//Con esta ruta obtenemos informacion de u producto por medio de su slug  (link)
productRoutes.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }); //se realiza una consulta a la base de datos utilizando el método "findOne" del modelo "Product"
  if (product) {
    //Si se encuentra un producto, se envía una respuesta HTTP en formato JSON que contiene la información del producto
    res.send(product);
  } else {
    //Si no se encuentra un producto, se envía una respuesta HTTP con el estado 404 y un mensaje de error
    res.status(404).send({ message: "¡Producto no encontrado!" });
  }
});

//Con esta ruta obtenemos informacion de u producto por medio de su id
productRoutes.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id); ////se realiza una consulta a la base de datos utilizando el método "findOne" del modelo "Product"
  if (product) {
    //Si se encuentra un producto, se envía una respuesta HTTP en formato JSON que contiene la información del producto
    res.send(product);
  } else {
    //Si no se encuentra un producto, se envía una respuesta HTTP con el estado 404 y un mensaje de error
    res.status(404).send({ message: "¡Producto no encontrado!" });
  }
});

//Exportamos
export default productRoutes;
