import Joi from "joi";

const allowedCategories = ["cleaning", "massage", "injection"];

export const specialistSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  categories: Joi.array()
    .items(Joi.string().valid(...allowedCategories))
    .min(1)
    .required()
    .messages({
      "array.min": "Оберіть хоча б одну категорію",
      "any.only": "Категорія має бути однією з дозволених",
    }),

  phone: Joi.string()
    .pattern(/^\+48 \d{3}-\d{3}-\d{3}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Podaj poprawny numer telefonu w formacie +48 123-456-789",
    }),

  availability: Joi.array().items(Joi.string().min(1)).required().messages({
    "array.base": "Availability повинно бути масивом рядків",
  }),

  description: Joi.object({
    pl: Joi.string().allow("", null),
    uk: Joi.string().allow("", null),
    en: Joi.string().allow("", null),
  }).required(),

  photo: Joi.string().uri().allow("", null),

  vacation: Joi.object({
    isOnVacation: Joi.boolean(),
    from: Joi.date().iso().allow(null),
    to: Joi.date().iso().allow(null),
  }).optional(),

  sickLeave: Joi.object({
    isOnSickLeave: Joi.boolean(),
    from: Joi.date().iso().allow(null),
    to: Joi.date().iso().allow(null),
  }).optional(),

  isActive: Joi.boolean().optional(),
});

export const statusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});
