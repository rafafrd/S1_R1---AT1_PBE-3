## TODOs

- [ ] Fazer validação de campos obrigatórios no cadastro de produto para não subir null, e retornar mensagem de erro amigável para o usuário
- [ ] Tratar erros de upload de imagem (ex: tipo de arquivo não permitido, tamanho excedido e etc..., com aviso amigavel para o usuario)
- [ ] Fazer a lógica de exclusão de imagem antiga ao atualizar um produto com nova imagem para evitar acúmulo de arquivos antigos no diretório de uploads
- [ ] Fazer o INSERT do produto e editar imagem no diretório de forma atômica "ACID" (ex: usando transações ou garantindo que ambos aconteçam ou nenhum aconteça)

- [ ] Ao deletar produto do banco, a imagem associada deve ser deletada do diretório de uploads para evitar acúmulo de arquivos órfãos
