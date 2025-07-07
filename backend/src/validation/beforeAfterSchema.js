import Joi from "joi";

export const beforeAfterSchema = Joi.object({
  serviceKey: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Поле обовʼязкове",
    "any.required": "Поле обовʼязкове",
    "string.min": "Занадто коротка назва",
    "string.max": "Занадто довга назва",
  }),
});
