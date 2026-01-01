import Joi from 'joi';

export const credentialSchema = Joi.object({
  user_id: Joi.string().required(),
  credential: Joi.object().required(),
  issued_by: Joi.string().required(),
  status: Joi.string().valid('issued', 'revoked').required(),
});
