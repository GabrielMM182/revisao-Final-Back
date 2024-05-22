const bcrypt = require("bcrypt");
const knex = require("../database/conexao");
const jwt = require("jsonwebtoken");

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const EmailUsado = await knex("usuarios").where({ email }).first();

    if (EmailUsado) {
      return res.status(400).json({ mensagem: "O email informado já existe" });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const usuario = await knex("usuarios").insert({
      nome,
      email,
      senha: senhaCriptografada,
    });

    return res.status(200).json(usuario[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor" + error.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await knex("usuarios").where({ email }).first();

    if (!usuario) {
      return res.status(404).json("O usuario não foi encontrado");
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Email ou senha inválida" });
    }

    const dadosTokenUsuario = {
      id: usuario.id,
      email: usuario.email,
    };

    const token = jwt.sign(dadosTokenUsuario, process.env.JWT_PASS, {
      expiresIn: "8h",
    });

    const { senha: _, ...dadosUsuario } = usuario;

    return res.status(200).json({
      usuario: dadosUsuario,
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Erro interno do servidor" + error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
};
