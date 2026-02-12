import produtoController from "../controllers/produto.controller.js";
import { Router } from "express";

const produtoRouter = Router();

produtoRouter.post("/produtos", produtoController.createProduto);
produtoRouter.get("/produtos", produtoController.getAllProdutos);
produtoRouter.get("/produtos/:idProduto", produtoController.getProdutoById);
produtoRouter.put("/produtos/:idProduto", produtoController.updateProduto);
produtoRouter.delete("/produtos/:idProduto", produtoController.deleteProduto);

export default produtoRouter;
