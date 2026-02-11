CREATE TABLE IF NOT EXISTS Categoria (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    descricaoCategoria VARCHAR(255) NOT NULL,
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Produtos (
    idProduto VARCHAR(255) PRIMARY KEY, -- sera usado hash para o id do produto
    idCategoria INT,
    nomeProduto VARCHAR(255) NOT NULL,
    valorProduto DECIMAL(10, 2) NOT NULL,
    vinculoImagem VARCHAR(255),
    dataCad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idCategoria) REFERENCES Categoria (idCategoria)
);