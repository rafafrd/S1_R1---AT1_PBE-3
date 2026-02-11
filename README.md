# 📦 API de Gerenciamento de Produtos e Categorias 

Um sistema de backend robusto e escalável construído com **Node.js**, focado no gerenciamento completo de produtos e suas respectivas categorias. O projeto foi desenvolvido seguindo os princípios da arquitetura **MVC (Model-View-Controller)** para garantir uma separação clara de responsabilidades e facilitar a manutenção.

## 🚀 Funcionalidades

* **Gestão de Categorias**: Cadastro, edição, listagem e exclusão (CRUD) de categorias.
* **Gestão de Produtos**: Controle total de produtos vinculados às categorias (Relacionamento 1:N - uma categoria para muitos produtos).
* **Upload de Imagens**: Suporte integrado para upload de imagens de produtos, armazenando o arquivo localmente e salvando o nome da imagem no banco de dados.

## 🏗️ Arquitetura do Projeto (MVC)

O projeto está organizado da seguinte forma, respeitando o padrão MVC:

* **Model (`/src/model`)**: Responsável pela comunicação com o banco de dados e regras de negócio.
* **Controller (`/src/controllers`)**: Intermediário que recebe as requisições das rotas, processa utilizando os models correspondentes e retorna as respostas adequadas.
* **Routes (`/src/routes`)**: Define os endpoints da API e direciona as requisições para os controllers.
* *Nota:* Como é uma API RESTful, a camada "View" é representada pelas respostas JSON enviadas ao cliente (front-end, postman, etc).

### Estrutura de Diretórios

```text
├── docs/                 # Documentação e modelagem do banco de dados (db.sql)
├── src/
│   ├── config/           # Configurações globais (Banco de Dados e Multer)
│   ├── controllers/      # Lógica de controle para Produtos e Categorias
│   ├── middleware/       # Interceptadores (Upload de imagens)
│   ├── model/            # Modelagem e interação com os dados
│   ├── routes/           # Definição dos Endpoints da API
│   └── server.js         # Ponto de entrada da aplicação
├── uploads/images/       # Armazenamento local das imagens dos produtos
├── .gitignore
└── package.json

```

## 💾 Modelagem de Dados

O banco de dados relacional foi estruturado com as seguintes propriedades:

### Tabela `Categoria`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `idCategoria` | PK | Identificador único da categoria. |
| `descricaoCategoria` | String | Nome ou descrição da categoria. |
| `dataCad` | Date | Data de cadastro no sistema. |

### Tabela `Produtos`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `idProduto` | PK | Identificador único do produto. |
| `idCategoria` | FK | Chave estrangeira referenciando `Categoria`. |
| `nomeProduto` | String | Nome do produto. |
| `valorProduto` | Decimal/Float | Valor de venda do produto. |
| `vínculoImagem` | String | Nome do arquivo da imagem gerado após o upload. |
| `dataCad` | Date | Data de cadastro no sistema. |

## 🛠️ Tecnologias Utilizadas

* **Node.js** - Ambiente de execução.
* **Express** - Framework web para estruturação das rotas. *(assumido)*
* **Multer** - Middleware para upload de arquivos (imagens).
* **Banco de Dados SQL** - Armazenamento persistente (verifique o arquivo `docs/db.sql`).


