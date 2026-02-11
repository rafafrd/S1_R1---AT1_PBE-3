import produtoModel from "../model/produtoModel.js";
import express from "express";
import uploadImage from "../middleware/uploadimage.middleware.js";

const produtoController = {
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
        const { idCategoria, nomeProduto, valorProduto } = req.body; // id produto será a hash gerada por cripto no multer
        const produto = {
          idCategoria,
          nomeProduto,
          valorProduto,
        };
        await produtoModel.createProduto(produto);
        res.status(201).json({ message: "Produto criado com sucesso" });
      });
    } catch (error) {
      console.error(`Erro ao criar produto: ${error}`);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  },
};

export default { produtoController };
