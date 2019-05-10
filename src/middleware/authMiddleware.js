const jwt = require('jsonwebtoken');
// ---- Define models 
const userService = require('../modules/users/usersServices');
const constants = require('../utils/constants')
const config = require('../config');
const TOKEN_TIME = parseInt(config.ACCESS_TOKEN_EXPIRY); // Token Expiry 30 Days => 60*60*24*30
const verifyToken = (req, res, next) => {
    const token = req.headers['auth-token'];
    if (token) {
      //----------verify JWT to authenticate the user---------------------------
      jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
        if (err) {
          let statusCode = new constants.response().FORBIDDEN;
          return res.json(constants.response.sendFailure('INVALID_TOKEN', req.params.lang, statusCode));
        } else {
          req.decoded = decoded;
          let sql = 'SELECT user_token FROM tbl_user WHERE user_id = ?';
            userService.findUser({
              user_id: req.decoded.id,
          }).then(result => {
            if (err) {
              let statusCode = new constants.response().NOT_FOUND;            
              return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
            } else if (result) {
              if (result.user_token == token) {
                req.user = result;
                next();
              } else {
                let statusCode = new constants.response().FORBIDDEN;
                return res.json(constants.response.sendFailure('TOKEN_MISMATCH', req.params.lang, statusCode));
              }
            } else {
              let statusCode = new constants.response().NOT_FOUND;
              return res.json(constants.response.sendFailure('NO_USER_FOR_THIS_TOKEN', req.params.lang, statusCode));
            }
          })
        }
      });
    } else {
      let statusCode = new constants.response().FORBIDDEN;
      return res.json(constants.response.sendFailure('PLEASE_PROVIDE_TOKEN', req.params.lang, statusCode));
    }
   };
   
   
//--------------------------- middleware for token generation--------------------------------------------------
   
   
  let generateAccessToken = (token_id, reqToken) => {
    let token;
    let timediff
    if (reqToken) {
      jwt.verify(reqToken, config.SECRET_KEY, function (err, decoded) {
        if (err) {
          console.log("token expired");
        } else {
          let date = Date.now();
          timediff = date - decoded.timestamp;
        }
      })
      console.log('timediff', timediff);
      if (timediff > 200 && timediff < 60000) {
        return reqToken;
      } else {
        // generate new token ---------
        token = jwt.sign({
          id: token_id,
          timestamp : Date.now()
        }, config.SECRET_KEY, {
          expiresIn: TOKEN_TIME
        });
        return token;
      }
    } else {
      token = jwt.sign({
        id: token_id,
        timestamp : Date.now()
      }, config.SECRET_KEY, {
        expiresIn: TOKEN_TIME
      });
      return token;
    }
  }

module.exports = {
  verifyToken,
  generateAccessToken,
};