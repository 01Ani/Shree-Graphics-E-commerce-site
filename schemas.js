const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required().min(0), //no negative minimum is only 0
    description: Joi.string().required(),
    image: Joi.string().required(),
    stock: Joi.number().required().min(0),
  }).required(),
});
