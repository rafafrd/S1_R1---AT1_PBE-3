## TODOs

- [ ] Fazer validação de campos obrigatórios no cadastro de produto para não subir null, e retornar mensagem de erro amigável para o usuário
- [ ] Tratar erros de upload de imagem (ex: tipo de arquivo não permitido, tamanho excedido e etc..., com aviso amigavel para o usuario)
- [ ] Fazer a lógica de exclusão de imagem antiga ao atualizar um produto com nova imagem para evitar acúmulo de arquivos antigos no diretório de uploads
- [ ] Fazer o INSERT do produto e editar imagem no diretório de forma atômica "ACID" (ex: usando transações ou garantindo que ambos aconteçam ou nenhum aconteça)

- [ ] Ao deletar produto do banco, a imagem associada deve ser deletada do diretório de uploads para evitar acúmulo de arquivos órfãos

- [ ] Adicionar paginação na listagem de produtos para melhorar performance em grandes volumes de dados

- [ ] Implementar testes unitários e de integração para garantir a estabilidade das operações de CRUD e upload de imagens

```JavaScript
  // teste do deleteProduto
  /**
   *
   * @param {*} req Express request object contendo o ID do produto a ser deletado nos parâmetros da URL
   *                e o nome do arquivo de imagem associado ao produto no banco de dados para garantir que a imagem correta seja deletada do diretório.
   * @param {*} res Express response object usado para enviar a resposta de sucesso ou erro para o cliente após a tentativa de deleção do produto e da imagem.
   *
   * Deleta um produto do banco de dados e também remove a imagem associada do diretório
   * Garante que a imagem seja deletada apenas se o produto for encontrado e deletado com sucesso no banco para evitar inconsistências
   */
  async deleteProduto(req, res) {
    const { idProduto } = req.params;
    const { vinculoImagem } = req.body; // Nome do arquivo de imagem associado ao produto
    try {
      const deleteResult = await produtoModel.deleteProduto(idProduto);
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      // Deleta a imagem do diretório apenas se o produto foi deletado com sucesso no banco
      const imagePath = path.resolve("uploads/images", vinculoImagem);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      return res.status(200).json({ message: "Produto e imagem deletados com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }

  },
```
