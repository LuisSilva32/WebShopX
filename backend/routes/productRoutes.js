import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import * as productController from "../controllers/productController.js";
import { isAuth, isAdmin } from "../utils.js";

const productRoutes = express.Router();

productRoutes.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRoutes.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(productController.createProduct)
);

productRoutes.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(productController.updateProduct)
);

productRoutes.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(productController.deleteProduct)
);

productRoutes.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(productController.createProductReview)
);

productRoutes.get("/categories", expressAsyncHandler(productController.getCategories));

productRoutes.get("/slug/:slug", expressAsyncHandler(productController.getProductBySlug));

productRoutes.get("/:id", expressAsyncHandler(productController.getProductById));

productRoutes.get("/category", expressAsyncHandler(productController.getProductsByCategory));

export default productRoutes;

