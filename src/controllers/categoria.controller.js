import CategoriaModel from "../model/categoriaModel.js";

const categoriaController = {
  async createCategoria(req, res) {
    try {
      const { descricaoCategoria } = req.body;
      const categoria = { descricaoCategoria };
      await CategoriaModel.createCategoria(categoria);
      res.status(201).json({ message: "Categoria criada com sucesso" });
    } catch (error) {
      console.error(`Erro ao criar categoria: ${error}`);
      res.status(500).json({ error: "Erro ao criar categoria" });
    }
  },
  async getAllCategorias(req, res) {
    try {
      const categorias = await CategoriaModel.getAllCategorias();
      res.json(categorias);
    } catch (error) {
      console.error(`Erro ao buscar categorias: ${error}`);
      res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  },
};

export default categoriaController;
