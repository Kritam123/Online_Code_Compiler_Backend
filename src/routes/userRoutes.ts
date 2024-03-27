import express from "express";
import {
  login,
  logout,
  signup,
  userDetails,
} from "../controllers/userControllers";
import { authToken } from "../middlewares/verfiyAuthToken";
import { getMyCodes } from "../controllers/compilerControllers";
export const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/user-details", authToken, userDetails);
userRouter.get("/my-codes", authToken, getMyCodes);