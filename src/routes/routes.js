import { Router } from "express";
import produtoRouter from "./produtos.routes.js";
import categoriaRouter from "./categoria.routes.js";
const router = Router();

router.use("/", produtoRouter);
router.use("/", categoriaRouter);

export default router;
