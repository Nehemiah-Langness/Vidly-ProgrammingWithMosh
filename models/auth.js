const Joi = require('joi');
const joiSchema = {
    email: Joi
        .string()
        .required()
        .min(3)
        .max(255)
        .email(),
    password: Joi
        .string()
        .required()
        .min(3)
        .max(255),
}

module.exports = {
    validationSchema: joiSchema,
    validate: (entity) => Joi.validate(entity, joiSchema).error
};