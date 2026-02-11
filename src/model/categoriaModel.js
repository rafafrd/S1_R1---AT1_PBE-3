import { pool } from "../config/db.js";

const CategoriaModel = {
  async createCategoria(categoria) {
    const connection = await pool.getConnection();
    const sql = "INSERT INTO Categoria (descricaoCategoria) VALUES (?)";
    const result = await connection.query(sql, [categoria.descricaoCategoria]);
    return result;
  },
  async getAllCategorias() {
    const connection = await pool.getConnection();
    const sql = "SELECT * FROM Categoria";
    const [rows] = await connection.query(sql);
    return rows;
  },
};

export default CategoriaModel;
