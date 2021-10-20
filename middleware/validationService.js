const Joi = require("joi");
const roles = require("../config/roles");

const userSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  role: Joi.any().allow(...roles).optional(),
});

const validateUser = (req, res, next) => {
  const { value, error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = {
  validateUser,
};
