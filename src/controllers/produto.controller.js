import produtoModel from "../model/produtoModel.js";
import uploadImage from "../middleware/uploadimage.middleware.js";

const produtoController = {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async getAllProdutos(req, res) {
    try {
      const produtos = await produtoModel.getAllProdutos();
      res.json(produtos);
    } catch (error) {
      console.error(`Erro ao buscar produtos: ${error}`);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },
  async getProdutoById(req, res) {
    try {
      const { idProduto } = req.params;
      const produto = await produtoModel.getProdutoById(idProduto);
      if (produto) {
        res.json(produto);
      } else {
        res.status(404).json({ error: "Produto não encontrado" });
      }
    } catch (error) {
      console.error(`Erro ao buscar produto por ID: ${error}`);
      res.status(500).json({ error: "Erro ao buscar produto por ID" });
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * Roda a função de upload de imagem e depois cria um produto no banco de dados usando os dados do corpo da requisição
   * @example
   * // Exemplo de requisição para criar um produto com imagem
   * fetch('/produtos', {
   *   method: 'POST',
   *   body: formData // formData deve conter os campos do produto e os arquivos de imagem
   * }).then(response => response.json())
   * .then(data => console.log(data));
   *
   */
  async createProduto(req, res) {
    try {
      await uploadImage(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        const { idCategoria, valorProduto, nomeProduto } = req.body;
        const vinculoImagem = req.file.filename;
        const produto = {
          idCategoria: parseInt(idCategoria),
          nomeProduto,
          valorProduto: parseFloat(valorProduto),
          vinculoImagem,
        };
        await produtoModel.createProduto(produto);
        res.status(201).json({ message: "Produto criado com sucesso" });
      });
    } catch (error) {
      console.error(`Erro ao criar produto: ${error}`);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  async deleteProduto(req, res) {
    // TODO: Deletar a imagem do produto junto com o produto no banco de dados
    try {
      const { idProduto } = req.params;
      await produtoModel.deleteProduto(parseInt(idProduto));
      res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      console.error(`Erro ao deletar produto: ${error}`);
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },
};

export default produtoController;
