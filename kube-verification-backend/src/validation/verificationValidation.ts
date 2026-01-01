import Joi from 'joi';

export const verificationSchema = Joi.object({
  credential_id: Joi.number().integer().required(),
  verified_by: Joi.string().required(),
  is_valid: Joi.boolean().required(),
  details: Joi.object().optional(),
});
