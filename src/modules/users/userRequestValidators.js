const Joi = require('joi');
const constants = require('../../utils/constants');

let userValidations = {
    // Signup Fields validation
    validateUserRegister: (req, res, next) => {
      let schema = Joi.object().keys({
          user_email: Joi.string().trim().email().required(),
          user_password: Joi.string().required(),
          user_first_name: Joi.string().required(),
          user_last_name: Joi.string(),
          user_name: Joi.string(),
          user_profile_pic: Joi.string(),
          user_lat: Joi.number(),
          user_long: Joi.number(),
      })    
        
      let validateBody = Joi.validate(req.body, schema);
      if (validateBody.error[0]) {
          let errorMessage = validateBody.error.details[0].message;
          let statusCode = new constants.response().BAD_REQUEST;
          return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode, errorMessage));
      }
      req.body = validateBody.value;
      next();
  },
  
    // Login fields validation
    validateUserSignin: (req, res, next) => {
    let schema = Joi.object().keys({
        user_email: Joi.string().email(),
        user_password: Joi.string(),
        // user_social_sign_type: Joi.string(),
        // user_social_sign_id: Joi.string(),
    })
    let validateBody = Joi.validate(req.body, schema);
    if (validateBody.error) {
        let errorMessage = validateBody.error.details[0].message;
        let statusCode = new constants.response().BAD_REQUEST;
        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode, errorMessage));
    }
    req.body = validateBody.value;
    next();
  },
  
  // Update user validation
  validateUserUpdate: (req, res, next) => {
    let schema = Joi.object().keys({
      user_first_name: Joi.string(),
      user_last_name: Joi.string(),
      user_name: Joi.string(),
      user_profile_pic: Joi.string(),
      user_lat: Joi.number(),
      user_long: Joi.number(),
      user_id: Joi.number(),
    })
    let validateBody = Joi.validate(req.body, schema);
    if (validateBody.error) {
        let errorMessage = validateBody.error.details[0].message;
        let statusCode = new constants.response().BAD_REQUEST;
        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode, errorMessage));
    }
    req.body = validateBody.value;
    next();
  },

  }

  module.exports.userValidations = userValidations;