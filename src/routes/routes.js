import { Router } from "express";
import { produtoRouter } from "./produtos.routes.js";
import { categoriaRouter } from "./categoria.routes.js";
const router = Router();

router.use("/produtos", produtoRouter);
router.use("/categorias", categoriaRouter);

export { router };
