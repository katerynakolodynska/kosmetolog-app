import Joi from "joi";

export const reviewSchema = Joi.object({
  name: Joi.string().required(),
  comment: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  emailOrPhone: Joi.string().optional(),
});
