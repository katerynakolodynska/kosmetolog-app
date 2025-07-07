import Joi from "joi";

export const reviewSchema = Joi.object({
  name: Joi.string().required(),
  comment: Joi.string().allow("", null),
  rating: Joi.number().min(1).max(5).required(),
  phone: Joi.string()
    .required()
    .pattern(/^\+?[0-9\s\-()]{6,20}$/)
    .message({
      "any.invalid": "Podaj poprawny numer telefonu",
      "any.required": "Numer telefonu jest wymagany",
    }),
});
