const express = require("express");
const verificaLogin = require("../middleware/verificaLogin");
const validarCorpoRequisicao = require('../middleware/validarRequisicao')
const { cadastrarUsuario, login } = require("../controller/usuarios");
const { cadastrarTarefa, atualizarTarefa, listarTarefas, detalharTarefas, deletarTarefa } = require("../controller/todos")
const router = express.Router();
const schemaTodo = require('../validation/schemaTodo')
const schemaUser = require('../validation/schemaUser')
// const {salvarArquivo} = require ('../controller/imagens')
const multer = require("../utils/multer");

// router.post("/upload", multer.single("arquivo"), salvarArquivo)

router.post("/cadastro", validarCorpoRequisicao(schemaUser), cadastrarUsuario);
router.post("/login", login);

router.use(verificaLogin);

router.post("/cadastrarTarefa",  multer.single("arquivo"), validarCorpoRequisicao(schemaTodo), cadastrarTarefa),
router.put("/atualizarTarefa/:id", validarCorpoRequisicao(schemaTodo),  atualizarTarefa)
router.get("/listarTarefa", listarTarefas)
router.get("/detalharTarefa/:id", detalharTarefas)
router.delete("/deletarTarefa/:id", deletarTarefa)

module.exports = router;
