import Joi from "joi";

export const contactSchema = Joi.object({
  address: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\+48\s?\d{3}-\d{3}-\d{3}$/)
    .required()
    .messages({
      "string.pattern.base": "Номер має бути у форматі +48 123-456-789",
    }),
  email: Joi.string().email().required(),
  mapsLink: Joi.string()
    .uri()
    .pattern(/^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=.+/)
    .required()
    .messages({
      "string.pattern.base": "Невірний формат посилання на Google Maps",
    }),
  socialLinks: Joi.object({
    telegram: Joi.string().uri().allow(""),
    whatsapp: Joi.string().uri().allow(""),
    viber: Joi.string().uri().allow(""),
    instagram: Joi.string().uri().allow(""),
    facebook: Joi.string().uri().allow(""),
  }),
  workHour: Joi.array()
    .length(7)
    .items(
      Joi.object({
        date: Joi.string()
          .valid(
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          )
          .required(),
        open: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .allow("")
          .messages({
            "string.pattern.base": "Час має бути у форматі HH:mm",
          }),
        close: Joi.string()
          .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
          .allow("")
          .messages({
            "string.pattern.base": "Час має бути у форматі HH:mm",
          }),
        comment: Joi.string().allow(""),
      })
    ),
});
