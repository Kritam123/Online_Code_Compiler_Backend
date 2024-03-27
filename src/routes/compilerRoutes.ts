import express from "express";
import { createCode, deleteCode, getCode, saveCode } from "../controllers/compilerControllers";
import { authToken } from "../middlewares/verfiyAuthToken";
export const compilerRoute = express.Router();

compilerRoute.post("/save",authToken ,saveCode);
compilerRoute.post("/load", authToken,getCode);
compilerRoute.post("/create", authToken,createCode);
compilerRoute.delete("/delete/:id",authToken,deleteCode);
