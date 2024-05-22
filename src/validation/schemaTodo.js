const joi = require("joi");

const schemaTodo = joi.object({
  tarefa: joi.string().required().min(3).id().max(100).messages({
    "any.required": "O campo tarefa é obrigatório",
    "string.empty": "O campo tarefa é obrigatório",
    "id.empty": "Necessario passar ID",
    "string.max": "O campo tarefa deve conter no minino 3 caracters",
    "string.min": "O campo tarefa deve conter no maximo 100 caracters",
  }),

  ativo: joi.boolean().required().messages({
    "any.required": "O campo ativo é obrigatório",
    "boolean.empty": "O campo ativo é obrigatório",
    "boolean.base": "O campo ativo precisa ser um booleano",
  }),

  cep: joi.string().required().regex(/^\d{8}$/).messages({
    "any.required": "O campo cep é obrigatório",
    "string.empty": "O campo cep é obrigatório",
    "string.pattern.base": "O campo cep deve conter exatamente 8 dígitos"
  }),
});

module.exports = schemaTodo;
