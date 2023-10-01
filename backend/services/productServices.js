import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener productos." });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: "Nombre del producto" + Date.now(),
      slug: "nombre-del-producto-como-link" + Date.now(),
      image: "/images/p1.jpg",
      price: 0,
      category: "Ej: Autos, zapatos, ropa, tecnología, etc.",
      brand: "Marca del producto",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "¡Describe tu producto aquí!",
    });
    const product = await newProduct.save();
    res.send({ message: "Producto agregado correctamente", product });
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el producto." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: "¡Producto actualizado con éxito!" });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al actualizar el producto." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.send({ message: "¡Producto eliminado con éxito!" });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el producto." });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res.status(400).send({ message: "¡Ya hiciste un comentario!" });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: "¡Comentario agregado con éxito!",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el comentario." });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find({ category });
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener productos por categoría." });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el producto por slug." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "¡Producto no encontrado!" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el producto por ID." });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener las categorías de productos." });
  }
};
