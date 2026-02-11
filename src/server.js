const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const { router } = require("./routes/routes.js");

//middleware
app.use(express.json());
app.use("/images", express.static(path.resolve("uploads/images"))); // Servir arquivos estáticos da pasta de uploads
app.use("/", router); // pega as rotas do routes.js

app.listen(PORT, () => {
  console.log(`Servidor respondendo em http://localhost:${PORT}`);
});
