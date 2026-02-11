import pool from "../config/db.js";

const CategoriaModel = {
  /**
   * Insere uma nova categoria no banco.
   * @async
   * @param {Object} categoria - Objeto contendo a descrição da categoria.
   * @param {string} categoria.descricaoCategoria - Texto descritivo da categoria.
   * @returns {Promise<import('mysql2').OkPacket>} - Resultado da query de inserção.
   * @example
   * const cat = { descricaoCategoria: 'Periféricos' };
   * await CategoriaModel.createCategoria(cat);
   */
  async createCategoria(categoria) {
    const connection = await pool.getConnection();
    const sql = "INSERT INTO Categoria (descricaoCategoria) VALUES (?)";
    const result = await connection.query(sql, [categoria.descricaoCategoria]);
    return result;
  },
  /**
   * Retorna todas as categorias cadastradas.
   * @async
   * @returns {Promise<Array<Object>>} - Array de objetos de categoria.
   * @example
   * const categorias = await CategoriaModel.getAllCategorias();
   * console.log(categorias);
   */
  async getAllCategorias() {
    const connection = await pool.getConnection();
    const sql = "SELECT * FROM Categoria";
    const [rows] = await connection.query(sql);
    return rows;
  },
};

export default CategoriaModel;
