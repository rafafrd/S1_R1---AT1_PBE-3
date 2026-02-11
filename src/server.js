const express = require("express");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const { router } = require("./routes/produtos.routes");

//middleware
app.use(express.json());
app.use("/", router); // pega as rotas do routes.js

app.listen(PORT, () => {
  console.log(`Servidor respondendo em http://localhost:${PORT}`);
});
