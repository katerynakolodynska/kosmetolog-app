import Joi from "joi";

export const bookingSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .required()
    .pattern(/^\+48 \d{3}-\d{3}-\d{3}$/)
    .messages({
      "string.pattern.base":
        "Podaj poprawny numer telefonu w formacie +48 123-456-789",
      "any.required": "Numer telefonu jest wymagany",
    }),
  service: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  comment: Joi.string().allow("", null),
});
