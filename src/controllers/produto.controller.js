import produtoModel from "../model/produtoModel.js";
import uploadImage from "../middleware/uploadimage.middleware.js";
import fs from "fs";
import path from "path";

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
   * Roda a função de upload de imagem e depois cria um produto no banco de dados usando os dados do corpo da requisição.
   * Implementa validação de campos obrigatórios, tratamento de erros de upload e transações ACID.
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
      // Executa o middleware de upload de imagem
      // O uploadImage processa o arquivo enviado e armazena em req.file
      await uploadImage(req, res, async (err) => {
        // Tratamento de erros específicos do upload de imagem
        if (err) {
          // Verifica se o erro é relacionado ao tipo de arquivo não permitido
          if (err.message.includes("Tipo de arquivo não permitido")) {
            return res.status(400).json({
              error:
                "Tipo de arquivo não permitido. Use apenas imagens JPEG, PNG ou JPG.",
            });
          }
          // Verifica se o erro é relacionado ao tamanho do arquivo excedido
          if (err.code === "LIMIT_FILE_SIZE") {
            //https://github.com/expressjs/multer/blob/main/doc/README-pt-br.md
            return res.status(400).json({
              error: "Arquivo muito grande. O tamanho máximo permitido é 10MB.",
            });
          }
          // Erro genérico de upload
          return res.status(400).json({
            error: `Erro no upload da imagem: ${err.message}`,
          });
        }

        // Valida se o arquivo foi enviado
        // req.file só existe se o upload foi bem-sucedido
        if (!req.file) {
          return res.status(400).json({
            error:
              "A imagem do produto é obrigatória. Envie um arquivo no campo 'vinculoImagem'.",
          });
        }

        // Extrai os dados do corpo da requisição
        const { idCategoria, valorProduto, nomeProduto } = req.body;

        // Validação de campos obrigatórios
        // Verifica se todos os campos necessários foram enviados
        if (!nomeProduto || !idCategoria || !valorProduto) {
          // Se algum campo estiver faltando, deleta a imagem que foi feita upload
          // para evitar acúmulo de arquivos órfãos no servidor
          const imagePath = path.resolve("uploads/images", req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
          return res.status(400).json({
            error:
              "Campos obrigatórios faltando. Envie: nomeProduto, idCategoria e valorProduto.",
          });
        }

        // Validação adicional: verifica se os valores são válidos
        // idCategoria deve ser um número positivo
        if (isNaN(parseInt(idCategoria)) || parseInt(idCategoria) <= 0) {
          const imagePath = path.resolve("uploads/images", req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
          return res.status(400).json({
            error: "idCategoria deve ser um número válido maior que zero.",
          });
        }

        // valorProduto deve ser um número positivo
        if (isNaN(parseFloat(valorProduto)) || parseFloat(valorProduto) <= 0) {
          path.resolve("/foo/bar", "./baz");
          // // Returns: '/foo/bar/baz'

          // path.resolve('/foo/bar', '/tmp/file/');
          // // Returns: '/tmp/file'

          // path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
          const imagePath = path.resolve("uploads/images", req.file.filename); //https://nodejs.org/api/path.html#pathresolvepaths
          if (fs.existsSync(imagePath)) {
            // if (existsSync('/etc/passwd'))
            //   console.log('The path exists.');
            fs.unlinkSync(imagePath); // https://nodejs.org/api/fs.html#fsunlinksyncpath
          }
          return res.status(400).json({
            error: "valorProduto deve ser um número válido maior que zero.",
          });
        }

        // Obtém o nome do arquivo da imagem que foi feita upload
        const vinculoImagem = req.file.filename;

        // Monta o objeto produto com os dados validados
        const produto = {
          idCategoria: parseInt(idCategoria),
          nomeProduto,
          valorProduto: parseFloat(valorProduto),
          vinculoImagem,
        };

        // Implementação de transação ACID (Atomicidade, Consistência, Isolamento, Durabilidade)
        // Garante que o INSERT no banco e o arquivo no diretório sejam tratados atomicamente
        // Se o INSERT falhar, a imagem será deletada para manter consistência
        try {
          // Tenta inserir o produto no banco de dados
          // O model retorna um objeto com informações da inserção
          await produtoModel.createProduto(produto);

          // Se chegou aqui, o INSERT foi bem-sucedido
          // A imagem já está salva no diretório (feita pelo multer)
          // Retorna sucesso para o cliente
          res.status(201).json({
            message: "Produto criado com sucesso",
            produto: {
              nomeProduto: produto.nomeProduto,
              valorProduto: produto.valorProduto,
              vinculoImagem: produto.vinculoImagem,
            },
          });
        } catch (dbError) {
          // Se o INSERT no banco falhar, deleta a imagem que foi feita upload
          // Isso garante que não teremos imagens órfãs no servidor
          // ACID: se o banco falhar, o arquivo também é removido (atomicidade)
          const imagePath = path.resolve("uploads/images", req.file.filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Imagem deletada após erro no banco: ${imagePath}`);
          }

          // Retorna erro específico do banco de dados
          console.error(`Erro ao inserir produto no banco: ${dbError}`);
          return res.status(500).json({
            error:
              "Erro ao salvar produto no banco de dados. A imagem foi removida.",
          });
        }
      });
    } catch (error) {
      // Captura erros não previstos no fluxo
      console.error(`Erro ao criar produto: ${error}`);
      res.status(500).json({ error: "Erro interno ao criar produto" });
    }
  },
  /**
   *
   * @param {*} req Express request object contendo o ID do produto a ser deletado nos parâmetros da URL
   *                e o nome do arquivo de imagem associado ao produto no banco de dados para garantir que a imagem correta seja deletada do diretório.
   * @param {*} res Express response object usado para enviar a resposta de sucesso ou erro para o cliente após a tentativa de deleção do produto e da imagem.
   *
   * Deleta um produto do banco de dados e também remove a imagem associada do diretório
   * Garante que a imagem seja deletada apenas se o produto for encontrado e deletado com sucesso no banco para evitar inconsistências
   * @example
   * // Exemplo de requisição para deletar um produto
   * fetch('/produtos/1', {
   *   method: 'DELETE'
   * }).then(response => response.json())
   * .then(data => console.log(data));
   *
   */
  async deleteProduto(req, res) {
    try {
      const { idProduto } = req.params;

      // Primeiro, busca o produto no banco para obter o nome da imagem
      // Precisamos saber qual arquivo deletar antes de remover o produto
      const produto = await produtoModel.getProdutoById(parseInt(idProduto));

      // Verifica se o produto existe
      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      // Deleta o produto do banco de dados primeiro
      // Se a deleção do banco falhar, a imagem não será removida
      await produtoModel.deleteProduto(parseInt(idProduto));

      // Após deletar do banco com sucesso, remove a imagem do diretório
      // Verifica se o produto tinha uma imagem associada
      if (produto.vinculoImagem) {
        // Monta o caminho completo da imagem no sistema de arquivos
        const imagePath = path.resolve("uploads/images", produto.vinculoImagem);

        // Verifica se o arquivo realmente existe antes de tentar deletar
        if (fs.existsSync(imagePath)) {
          // Remove o arquivo do sistema de arquivos
          // unlinkSync é usado para deletar arquivos de forma síncrona
          fs.unlinkSync(imagePath);
          console.log(`Imagem deletada: ${imagePath}`);
        } else {
          // Loga um aviso caso a imagem não exista (pode ter sido deletada manualmente)
          console.warn(`Imagem não encontrada para deletar: ${imagePath}`);
        }
      }

      // Retorna sucesso apenas se tanto o banco quanto a imagem foram processados
      res.status(200).json({
        message: "Produto e imagem deletados com sucesso",
      });
    } catch (error) {
      console.error(`Erro ao deletar produto: ${error}`);
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  },
  /**
   *
   * @param {*} req
   * @param {*} res
   * Atualiza um produto existente, incluindo a possibilidade de trocar a imagem.
   * Quando uma nova imagem é enviada, a imagem antiga é deletada do diretório.
   */
  async updateProduto(req, res) {
    try {
      // Executa o middleware de upload de imagem (opcional para update)
      await uploadImage(req, res, async (err) => {
        // Tratamento de erros de upload (mesma lógica do create)
        if (err) {
          if (err.message.includes("Tipo de arquivo não permitido")) {
            return res.status(400).json({
              error:
                "Tipo de arquivo não permitido. Use apenas imagens JPEG, PNG ou JPG.",
            });
          }
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              error: "Arquivo muito grande. O tamanho máximo permitido é 10MB.",
            });
          }
          return res.status(400).json({
            error: `Erro no upload da imagem: ${err.message}`,
          });
        }

        const { idProduto } = req.params;
        const { idCategoria, valorProduto, nomeProduto } = req.body;

        // Busca o produto existente no banco
        // Precisamos dos dados antigos para saber qual imagem deletar
        const produtoExistente = await produtoModel.getProdutoById(
          parseInt(idProduto),
        );

        // Verifica se o produto existe
        if (!produtoExistente) {
          // Se uma nova imagem foi enviada mas o produto não existe, deleta a imagem
          if (req.file) {
            const imagePath = path.resolve("uploads/images", req.file.filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Validação dos campos (se fornecidos, devem ser válidos)
        if (
          idCategoria &&
          (isNaN(parseInt(idCategoria)) || parseInt(idCategoria) <= 0)
        ) {
          if (req.file) {
            const imagePath = path.resolve("uploads/images", req.file.filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          return res.status(400).json({
            error: "idCategoria deve ser um número válido maior que zero.",
          });
        }

        if (
          valorProduto &&
          (isNaN(parseFloat(valorProduto)) || parseFloat(valorProduto) <= 0)
        ) {
          if (req.file) {
            const imagePath = path.resolve("uploads/images", req.file.filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          }
          return res.status(400).json({
            error: "valorProduto deve ser um número válido maior que zero.",
          });
        }

        // Monta o objeto com os dados a serem atualizados
        // Se um campo não foi enviado, mantém o valor antigo
        const produtoAtualizado = {
          idProduto: parseInt(idProduto),
          idCategoria: idCategoria
            ? parseInt(idCategoria)
            : produtoExistente.idCategoria,
          nomeProduto: nomeProduto || produtoExistente.nomeProduto,
          valorProduto: valorProduto
            ? parseFloat(valorProduto)
            : produtoExistente.valorProduto,
          vinculoImagem: req.file
            ? req.file.filename
            : produtoExistente.vinculoImagem,
        };

        try {
          // Atualiza o produto no banco de dados
          await produtoModel.updateProduto(produtoAtualizado);

          // Se uma nova imagem foi enviada e o update no banco foi bem-sucedido
          // Deleta a imagem antiga do diretório para evitar acúmulo de arquivos
          if (req.file && produtoExistente.vinculoImagem) {
            const imagemAntigaPath = path.resolve(
              "uploads/images",
              produtoExistente.vinculoImagem,
            );
            // Verifica se a imagem antiga existe antes de deletar
            if (fs.existsSync(imagemAntigaPath)) {
              fs.unlinkSync(imagemAntigaPath);
              console.log(`Imagem antiga deletada: ${imagemAntigaPath}`);
            }
          }

          res.status(200).json({
            message: "Produto atualizado com sucesso",
            produto: produtoAtualizado,
          });
        } catch (dbError) {
          // Se o update no banco falhar e uma nova imagem foi enviada
          // Deleta a nova imagem para manter consistência (ACID)
          if (req.file) {
            const imagePath = path.resolve("uploads/images", req.file.filename);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(
                `Nova imagem deletada após erro no banco: ${imagePath}`,
              );
            }
          }

          console.error(`Erro ao atualizar produto no banco: ${dbError}`);
          return res.status(500).json({
            error: "Erro ao atualizar produto no banco de dados.",
          });
        }
      });
    } catch (error) {
      console.error(`Erro ao atualizar produto: ${error}`);
      res.status(500).json({ error: "Erro interno ao atualizar produto" });
    }
  },
};

export default produtoController;
