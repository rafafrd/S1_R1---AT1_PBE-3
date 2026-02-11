import { pool } from "../config/db.js";

const ProdutoModel = {
  /**
   *
   * @param {*} produto
   */
  async createProduto(produto) {
    const connection = await pool.getConnection();
    try {
      const { idProduto, idCategoria, nomeProduto, valorProduto } = produto;
      const query =
        "INSERT INTO Produtos (idProduto, idCategoria, nomeProduto, valorProduto) VALUES (?, ?, ?, ?)";
      await connection.execute(query, [
        idProduto,
        idCategoria,
        nomeProduto,
        valorProduto,
      ]);
    } catch (error) {
      console.error(`Erro ao criar produto: ${error}`);
      throw error;
    }
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
    try {
      const query = "SELECT * FROM Produtos";
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      console.error(`Erro ao buscar produtos: ${error}`);
      throw error;
    }
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
    try {
      const query = "SELECT * FROM Produtos WHERE idProduto = ?";
      const [rows] = await connection.execute(query, [idProduto]);
      return rows[0];
    } catch (error) {
      console.error(`Erro ao buscar produto por ID: ${error}`);
      throw error;
    }
  },
};

export default { ProdutoModel };
