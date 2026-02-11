import produtoController from "../controllers/produto.controller.js";

const router = express.Router();

router.post("/produtos", produtoController.createProduto);

export { router };
