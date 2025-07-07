import Joi from "joi";

const translationSchema = Joi.object({
  pl: Joi.string().required(),
  uk: Joi.string().required(),
  en: Joi.string().required(),
});

export const serviceSchema = Joi.object({
  title: translationSchema.required(),
  description: translationSchema.required(),
  duration: Joi.number().min(1).required(),
  price: Joi.number().min(0).required(),
  specialists: Joi.array()
    .items(Joi.string().length(24).hex())
    .min(1)
    .required(),
  category: Joi.string().valid("cleaning", "massage", "injection").required(),
});
