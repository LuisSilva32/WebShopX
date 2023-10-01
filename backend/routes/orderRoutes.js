import express from "express";
import expressAsyncHandler from "express-async-handler";
import * as orderController from "../controllers/orderController.js";
import { isAuth, isAdmin } from "../utils.js";

const orderRoutes = express.Router();

orderRoutes.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(orderController.getAllOrders)
);

orderRoutes.post(
  "/",
  isAuth,
  expressAsyncHandler(orderController.createOrder)
);

orderRoutes.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(orderController.getOrderSummary)
);

orderRoutes.get(
  "/mine",
  isAuth,
  expressAsyncHandler(orderController.getUserOrders)
);

orderRoutes.get(
  "/:id",
  isAuth,
  expressAsyncHandler(orderController.getOrderById)
);

export default orderRoutes;

