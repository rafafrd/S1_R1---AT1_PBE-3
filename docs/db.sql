-- use loja_tech

CREATE TABLE IF NOT EXISTS Categoria (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    descricaoCategoria VARCHAR(255) NOT NULL,
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Produtos (
    idProduto INT PRIMARY KEY AUTO_INCREMENT,
    idCategoria INT,
    nomeProduto VARCHAR(255) NOT NULL,
    valorProduto DECIMAL(10, 2) NOT NULL,
    vinculoImagem VARCHAR(255), -- sera usado hash para o id do produto, gerada pelo multer
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idCategoria) REFERENCES Categoria (idCategoria)
);

-- DROP TABLE IF EXISTS Categoria;
-- DROP TABLE IF EXISTS Produtos;