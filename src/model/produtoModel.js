import pool from "../config/db.js";

const ProdutoModel = {
  /**
   *
   * @param {*} produto
   */
  /**
   * Cria um novo produto no banco de dados.
   * @async
   * @param {Object} produto - Objeto com os dados do produto a inserir.
   * @param {number|string} [produto.idProduto] - (Opcional) ID do produto gerado externamente (hash). Se não informado, a coluna `idProduto` pode ser definida pela query/DB.
   * @param {number} produto.idCategoria - ID da categoria à qual o produto pertence.
   * @param {string} produto.nomeProduto - Nome do produto.
   * @param {number} produto.valorProduto - Valor do produto (número). Envie um número (ex: 19.9) ou string que possa ser convertida.
   * @param {string} [produto.vinculoImagem] - Nome/ caminho do arquivo de imagem armazenado (vínculo com upload).
   * @returns {Promise<void>} - Resolve quando a operação de insert for concluída.
   * @example
   * const novo = {
   *   idProduto: 'a1b2c3d4',
   *   idCategoria: 1,
   *   nomeProduto: 'Teclado Mecânico',
   *   valorProduto: 249.9,
   *   vinculoImagem: 'a1b2c3d4-teclado.png'
   * };
   * await ProdutoModel.createProduto(novo);
   */
  async createProduto(produto) {
    const connection = await pool.getConnection();
    console.log(produto);

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
  /**
   * Busca todos os produtos cadastrados no banco.
   * @async
   * @returns {Promise<Array<Object>>} - Array de objetos representando os produtos.
   * @example
   * const produtos = await ProdutoModel.getAllProdutos();
   * console.log(produtos[0].nomeProduto);
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
  /**
   * Busca um produto pelo seu ID.
   * @async
   * @param {string|number} idProduto - ID do produto (pode ser hash string ou número conforme esquema).
   * @returns {Promise<Object|null>} - Retorna o objeto do produto ou `undefined`/`null` se não encontrado.
   * @example
   * const produto = await ProdutoModel.getProdutoById('a1b2c3d4');
   * if (produto) console.log(produto.nomeProduto);
   */
  async getProdutoById(idProduto) {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM Produtos WHERE idProduto = ?";
    const [rows] = await connection.execute(query, [idProduto]);
    return rows[0];
  },
  /**
   *
   * @param {*} idProduto
   */
  /**
   * Remove um produto do banco pelo seu ID.
   * @async
   * @param {string|number} idProduto - ID do produto a ser removido.
   * @returns {Promise<void>} - Resolve quando a deleção for concluída.
   * @example
   * await ProdutoModel.deleteProduto('a1b2c3d4');
   */
  async deleteProduto(idProduto) {
    const connection = await pool.getConnection();
    const query = "DELETE FROM Produtos WHERE idProduto = ?";
    await connection.execute(query, [idProduto]);
  },
};

export default ProdutoModel;
