import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const baseUploadDir = path.resolve(process.cwd(), "uploads"); //'uploads' na raiz do projeto, é onde os arquivos serão armazenados (storage)

const verificaDir = (dir) => {
  // Verifica se o diretório existe, se não, cria (raiz dos uploads)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createMulter = ({ folder, allowedTypes, fileSize }) => {
  // Cria o diretório de upload se não existir (/uploads/{folder})
  const uploadDir = path.join(baseUploadDir, folder);
  // verifica se o diretório existe
  verificaDir(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, fileSize, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      // Gera um nome de arquivo único usando crypto
      const hash = crypto.randomBytes(12).toString("hex");
      cb(null, `${hash}-${file.originalname}`);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Tipo de arquivo não permitido")); // false para rejeitar o arquivo
    }
    cb(null, true); // true para aceitar o arquivo
  };

  return multer({
    storage,
    limits: { fileSize },
    fileFilter,
  });
};

export default createMulter;
