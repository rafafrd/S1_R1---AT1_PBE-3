import createMulter from "../config/produto.multer.js";

const uploadImage = createMulter({
  folder: "images",
  allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
  fileSize: 10 * 1024 * 1024, // 10 MB
}).single("vinculoImagem", 10); // Permite até 10 arquivos com o campo 'images'

export default uploadImage;
