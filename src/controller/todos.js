require("dotenv").config();
const knex = require("../database/conexao");
const addressHandler = require("../utils/addressHandlerApi");
const {uploadFile} = require("./storage")

const cadastrarTarefa = async (req, res) => {
  const { tarefa, ativo, cep } = req.body;
  const {file} = req

  const arquivo = await uploadFile(`imagens/${file.originalname}`, file.buffer, file.mimetype);

  const enderecoData = await addressHandler.getEndereco(cep);

  const enderecoFormatado = addressHandler.formatarEndereco(enderecoData);

  try {
    const [tarefaInserida] = await knex("todos")
      .insert({
        usuario_id: req.usuario.id,
        tarefa: tarefa,
        ativo: ativo,
        data: new Date(),
        endereco: enderecoFormatado,
        arquivo: arquivo.url
      })
      .returning("*");

    return res.status(200).json(tarefaInserida);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
};

const atualizarTarefa = async (req, res) => {
  const { tarefa, ativo, cep } = req.body;
  const { id } = req.params;

  const enderecoData = await addressHandler.getEndereco(cep);

  const enderecoFormatado = addressHandler.formatarEndereco(enderecoData);

  try {
    const tarefaExistente = await knex("todos")
      .where({ id: id, usuario_id: req.usuario.id })
      .first();

    if (!tarefaExistente) {
      return res.status(404).json({ mensagem: "Tarefa não existe" });
    }

    await knex("todos").where({ id: id }).update({
      tarefa: tarefa,
      ativo: ativo,
      endereco: enderecoFormatado,
    });

    return res.status(204).json();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
};

const listarTarefas = async (req, res) => {
  try {
    const todos = await knex("todos")
    .select("*")
    .where({ usuario_id: req.usuario.id });

    return res.json(todos);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
};

const detalharTarefas = async (req, res) => {
  const { id } = req.params;

  try {
    const tarefa = await knex("todos")
    .select("*")
    .where({ id: id, usuario_id: req.usuario.id })
      .first();

    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não existe" });
    }

    return res.json(tarefa);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
};

const deletarTarefa = async (req, res) => {
  const { id } = req.params;

  try {
    const [tarefa] = await knex("todos")
      .select("id", "tarefa", "ativo", "data", "endereco")
      .where({ id: id, usuario_id: req.usuario.id });

    if (!tarefa) {
      return res.status(404).json({ mensagem: "Tarefa não existe" });
    }

    await knex("todos").where({ id: id }).del();

    return res.status(204).json(tarefa);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor", detalhes: error.message });
  }
};

module.exports = {
  cadastrarTarefa,
  atualizarTarefa,
  listarTarefas,
  detalharTarefas,
  deletarTarefa,
};
