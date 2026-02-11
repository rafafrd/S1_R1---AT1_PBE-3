## TODOs

- [ ] Fazer validação de campos obrigatórios no cadastro de produto para não subir null
- [ ] Tratar erros de upload de imagem (ex: tipo de arquivo não permitido, tamanho excedido)
- [ ] Fazer a lógica de exclusão de imagem antiga ao atualizar um produto com nova imagem
- [ ] Fazer o INSERT do produto e editar imagem no diretório de forma atômica (ex: usando transações ou garantindo que ambos aconteçam ou nenhum aconteça)

- [ ] Ao deletar produto do banco, a imagem associada deve ser deletada do diretório de uploads para evitar acúmulo de arquivos órfãos
