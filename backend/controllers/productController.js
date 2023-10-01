import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import * as productService from "../services/productServices.js";
import { isAuth, isAdmin } from "../utils.js";

export const getAllProducts = expressAsyncHandler(async (req, res) => {
  await productService.getAllProducts(req, res);
});

export const createProduct = expressAsyncHandler(async (req, res) => {
  await productService.createProduct(req, res);
});

export const updateProduct = expressAsyncHandler(async (req, res) => {
  await productService.updateProduct(req, res);
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
  await productService.deleteProduct(req, res);
});

export const createProductReview = expressAsyncHandler(async (req, res) => {
  await productService.createProductReview(req, res);
});

export const getProductsByCategory = expressAsyncHandler(async (req, res) => {
  await productService.getProductsByCategory(req, res);
});

export const getProductBySlug = expressAsyncHandler(async (req, res) => {
  await productService.getProductBySlug(req, res);
});

export const getProductById = expressAsyncHandler(async (req, res) => {
  await productService.getProductById(req, res);
});

export const getCategories = expressAsyncHandler(async (req, res) => {
  await productService.getCategories(req, res);
});
