import Joi from "joi";

const langTextSchema = Joi.object({
  uk: Joi.string().trim().required().messages({
    "any.required": "Поле українською обовʼязкове",
  }),
  en: Joi.string().trim().required().messages({
    "any.required": "Поле англійською обовʼязкове",
  }),
  pl: Joi.string().trim().required().messages({
    "any.required": "Поле польською обовʼязкове",
  }),
});

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  public_id: Joi.string().required(),
});

export const heroSchema = Joi.object({
  introText: langTextSchema.required(),
  aboutText: langTextSchema.required(),
  specialistIntro: langTextSchema.required(),
  images: Joi.array().items(imageSchema).length(4).required().messages({
    "array.length": "Має бути рівно 4 зображення",
  }),
});
