import { Router } from "express";
import categoriaController from "../controllers/categoria.controller.js";

const categoriaRouter = Router();

categoriaRouter.post("/categorias", categoriaController.createCategoria);
categoriaRouter.get("/categorias", categoriaController.getAllCategorias);

export default categoriaRouter;
