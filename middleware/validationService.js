const Joi = require('joi');
const roles = require('../config/roles');

const userSchema = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']},
      })
      .required(),
  role: Joi.any()
      .allow(...roles)
      .optional(),
});

const loadSchema = Joi.object({
  name: Joi.string(),
  payload: Joi.number(),
  pickup_address: Joi.string(),
  delivery_address: Joi.string(),
  dimensions: {
    width: Joi.number(),
    length: Joi.number(),
    height: Joi.number(),
  },
});

const truckSchema = Joi.object({
  type: Joi.string(),
});

const validateUser = (req, res, next) => {
  const {error} = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.message});
  }
  next();
};

const validateLoad = (req, res, next) => {
  const {error} = loadSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.message});
  }
  next();
};

const validateTruck = (req, res, next) => {
  const {error} = truckSchema.validate(req.body);
  if (error) {
    return res.status(400).json({message: error.message});
  }
  next();
};

module.exports = {
  validateUser,
  validateLoad,
  validateTruck,
};
