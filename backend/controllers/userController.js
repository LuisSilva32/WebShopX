import expressAsyncHandler from "express-async-handler";
import * as userService from "../services/userServices.js";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  userService.getAllUsers(req, res);
});

export const getUserById = expressAsyncHandler(async (req, res) => {
  userService.getUserById(req, res);
});

export const updateUser = expressAsyncHandler(async (req, res) => {
  userService.updateUser(req, res);
});

export const deleteUser = expressAsyncHandler(async (req, res) => {
  userService.deleteUser(req, res);
});

export const signin = expressAsyncHandler(async (req, res) => {
  userService.signin(req, res);
});

export const signup = expressAsyncHandler(async (req, res) => {
  userService.signup(req, res);
});

export const updateUserProfile = expressAsyncHandler(async (req, res) => {
  userService.updateUserProfile(req, res);
});

export const checkEmail = expressAsyncHandler(async (req, res) => {
  userService.checkEmail(req, res);
});
