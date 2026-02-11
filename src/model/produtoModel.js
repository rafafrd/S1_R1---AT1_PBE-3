import { pool } from "../config/db.js";

const ProdutoModel = {
  /**
   *
   * @param {*} produto
   */
  async createProduto(produto) {
    const connection = await pool.getConnection();
    const { idCategoria, nomeProduto, valorProduto, vinculoImagem } = produto;
    const query =
      "INSERT INTO Produtos (idCategoria, nomeProduto, valorProduto, vinculoImagem) VALUES (?, ?, ?, ?)";
    await connection.execute(query, [
      idCategoria,
      nomeProduto,
      valorProduto,
      vinculoImagem,
    ]);
  },
  /**
   * Roda a query para buscar todos os produtos no banco de dados
   * @returns {Promise<Array>} Uma promessa que resolve para um array de produtos
   * @example
   * ProdutoModel.getAllProdutos().then(produtos => {
   *   console.log(produtos);
   * });
   */
  async getAllProdutos() {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM Produtos";
    const [rows] = await connection.execute(query);
    return rows;
  },
  /**
   * Roda a query para buscar um produto pelo ID no banco de dados
   * @param {*} idProduto
   * @returns {Promise<Object>} Uma promessa que resolve para um objeto de produto
   * @example
   * ProdutoModel.getProdutoById(1).then(produto => {
   *   console.log(produto);
   * });
   */
  async getProdutoById(idProduto) {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM Produtos WHERE idProduto = ?";
    const [rows] = await connection.execute(query, [idProduto]);
    return rows[0];
  },
};

export default ProdutoModel;
