import Joi from "joi";

export const bookingSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^\+48 \d{3}-\d{3}-\d{3}$/)
    .required(),
  service: Joi.string().length(24).hex().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  comment: Joi.string().allow(""),
  specialistId: Joi.string().length(24).hex().allow(null, ""),
  occupiedSlots: Joi.number().required(),
});
