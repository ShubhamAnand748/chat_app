// -----------------------define all dependencies -----------------
let {
    //-------module------------------
    op,
    //---- base service functions--------
    constants,
    // ----------------Middleware------------------------
    authMiddleware,
    request,
    storage,
    //---------  Define models---------------
    userModel,
    bcrypt,
    multer,
    // ----------- Define functions --------
    commonFunctions,
    // -------- Define services ----------
    userService,
} = require('../../helperFunction/commonService');

let APIRef = 'User Authentication';
//------------------------ end of dependencies -------------------

//****************************************************************************************/
//                               User Register Controller                                //
//****************************************************************************************/
async function userRegisterController(req, res) {
    try {
        const {
            body
        } = req;

        let upload = multer({ storage: storage }).single('image');
        upload(req, res, async (err) => {     
            let image = req.file;
  
            console.log('req.body', req.body);
            console.log('image', image);

        let user_email = req.body.user_email;
        let user_password = req.body.user_password;
        let user_first_name = req.body.user_first_name;
        let user_last_name = req.body.user_last_name;
        let user_name = req.body.user_name;
        let user_profile_pic = image;
        let user_lat = req.body.user_lat;
        let user_long = req.body.user_long;
        let userData = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_email', user_email, 'user signup', )
            if (userData.length > 0) {
                let statusCode = new constants.response().VALUE_NOT_UNIQUE;
                return res.json(constants.response.sendFailure('EMAIL_ALREADY_EXISTS', req.params.lang, statusCode));
            } else {
                let userData = {
                    user_email,
                    user_password : bcrypt.hashSync(user_password),
                    user_first_name,
                    user_last_name,
                    user_name,
                    user_profile_pic,
                    user_lat,
                    user_long,
                };
                let insertRow = await commonFunctions.insertSingleRow(APIRef, 'tbl_user', userData, 'user signup', );
                const user_id = insertRow.insertId;
    
                let result = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_id', user_id, 'user signup', );

                // let token = authMiddleware.generateAccessToken(result.user_id);
                // delete insertRow['user_password'];
                // result.user_token = token;
                return res.json(constants.response.sendSuccess('USER_SIGNUP_SUCCESS', result, req.params.lang));
    
            }
        })

    } catch (e) {
        console.log(e)
        let statusCode = new constants.response().SERVER_ERROR;
        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    }
}

//**************************** End of User Register Controller ***************************/



//****************************************************************************************/
//                               User Login Controller                                   //
//****************************************************************************************/
async function userLoginController(req, res) {

try {
    const {
        body
    } = req;
    let user_email = req.body.user_email;
    let user_password = req.body.user_password;
            // Login with user_email and password

        let userData = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_email', user_email, 'user login', )
        
        if (userData.length > 0) {

            let correctPwd = bcrypt.compareSync(user_password, userData[0].user_password);
            
            if (correctPwd) {
                return res.json(constants.response.sendSuccess('USER_LOGIN_SUCCESS', userData, req.params.lang));
            } else {
                let statusCode = new constants.response().UNAUTHORIZED;
                return res.json(constants.response.sendFailure('INVAILD_USER_PASSWORD', req.params.lang, statusCode));
            }
        } else {
            let statusCode = new constants.response().UNAUTHORIZED;
            return res.json(constants.response.sendFailure('INVAILD_USER_PASSWORD', req.params.lang, statusCode));
        }
} catch (e) {
    console.log(e)
    let statusCode = new constants.response().SERVER_ERROR;
    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    }
}

//***************************** End of User Login Controller *****************************/



//****************************************************************************************/
//                               User Update Controller                                  //
//****************************************************************************************/
async function userUpdateController(req, res) {

    try {        
        let upload = multer({ storage: storage }).single('image');
        upload(req, res, async (err) => {              
        // --------------- Define Variable -----------------------------
        let user_id = req.body.user_id;        
        // ---------------End of define Variable-----------------------
        // -------------find user for specific id
        let userData = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_id', user_id, 'update user profile', )                                    
        console.log('userData', userData);
            
        let image = userData.user_profile_pic;
        if (req.file) {
            image = req.file;
        } else {
            console.log('err in req.file');
        }
        console.log('image', image);

        let insert = {
            user_first_name: req.body.user_first_name ? req.body.user_first_name : userData[0].user_first_name,
            user_last_name: req.body.user_last_name ? req.body.user_last_name : userData[0].user_last_name,
            user_lat: req.body.user_lat ? req.body.user_lat : userData[0].user_lat,
            user_long: req.body.user_long ? req.body.user_long : userData[0].user_long,
            user_name: req.body.user_name ? req.body.user_name : userData[0].user_name,
            user_profile_pic: image,
        }
        //--------------Update single row ----------------
        let updateRow = await commonFunctions.updateSingleRow(APIRef, 'tbl_user', insert, 'user_id', user_id, 'update user profile');
        let updatedUserData = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_id', user_id, 'update user profile', )                                    

            
        return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', updatedUserData, req.params.lang));
    })
    //--------------------if invalid id or bad req
    } catch (e) {
        console.log(e)
        let statusCode = new constants.response().SERVER_ERROR;
        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
        }
    }
    
//**************************** End of User Update Controller *****************************/



//****************************************************************************************/
//                             User Send Otp Controller                                  //
//****************************************************************************************/
async function userSendOtpController(req, res) {
    try {

        // --------------- define Variable -----------------------------
        const user_email = req.body.user_email ? req.body.user_email : "";

      //----- check mandatory params
      if (user_email.trim() == "") {
        let statusCode = new constants.response().PARAMETER_MISSING;
        return res.json(constants.response.sendFailure("MANDATORY_PARAMETER_MISSING", req.params.lang, statusCode));
      } else {
        // ------find user by email --------------
        let userData = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_email', user_email, 'send otp', )                                    
            //-----------if user exist -----
            if (userData.length > 0) {
              // ------------------Send otp -------------------------------
              let otp_val = Math.floor(1000 + Math.random() * 9000);

              if (user_email) {
                // ----- SEND GRID MAIL -----
                let mail_obj = {};
                mail_obj.mail_to = user_email;
                mail_obj.mail_from = "developer.emilence@gmail.com";
                mail_obj.subject = "Otp for password";
                mail_obj.text = "blank";
                mail_obj.html = "blank";
                mail_obj.templateId = "d-cd6ef814bfa14b59969c1e7379ecfb64";
                let dynamic_template_data = {
                    user_name: userData.user_first_name,
                    otp: otp_val
                };
                userService.sendgrid(mail_obj, dynamic_template_data);
                res.json(constants.response.sendSuccess("DEFAULT_SUCCESS_MESSAGE", otp_val, req.params.lang));
                    // ---- Insert new otp ----
                    insert = {
                    otp: otp_val, 
                    }                   
                    commonFunctions.updateSingleRow(APIRef, 'tbl_user', insert, 'user_email', user_email, 'send otp');
              } 
              else {
                let statusCode = new constants.response().PARAMETER_MISSING;
                return res.json(constants.response.sendFailure("MANDATORY_PARAMETER_MISSING", req.params.lang, statusCode));
              }
            } else {
              let statusCode = new constants.response().NOT_FOUND;
              return res.json(constants.response.sendFailure("NOT_EXIST_EMAIL_PHONE", req.params.lang, statusCode));
            }
      }
    } catch (e) {
      console.log(e);
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(
        constants.response.sendFailure("DEFAULT_FAILURE_MESSAGE", req.params.lang, statusCode));
    }
}

//**************************** End of User Send Otp Controller ***************************/



//****************************************************************************************/
//                         User Update Password Controller                               //
//****************************************************************************************/
async function userUpdatePasswordController(req, res) {
    try {
        // ---------------define Variable -----------------------------
        let user_email = req.body.user_email;
        let otp = req.body.otp;
        let user_password = req.body.user_password;
        // ---------------End of define Variable-----------------------
        //-----------check mandatory params--------------
        if (user_password.trim() == "" || otp.trim() == "" || !user_email) {            
          let statusCode = new constants.response().PARAMETER_MISSING;
          return res.json(constants.response.sendFailure("MANDATORY_PARAMETER_MISSING", req.params.lang, statusCode));
        } else {
          //----------find single object ------------------
          let otpdata = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'otp', otp, 'update user password', )
            console.log('otpdata', otpdata);
            
          if (otpdata.length > 0) {
                // -----Update Password ------------
                insertData = {
                    user_password:  bcrypt.hashSync(user_password),
                }
            let userData = await commonFunctions.updateSingleRow(APIRef, 'tbl_user', insertData, 'user_email', user_email, 'update user password');

                    // ---- if updated succesfully
                    let deleteOtp = '';
                    insert = {
                    otp: deleteOtp,
                    }
            let deleteotp = await commonFunctions.updateSingleRow(APIRef, 'tbl_user', insert, 'user_email', user_email, 'update user password');
            let data = await commonFunctions.getSingleRow(APIRef, 'tbl_user', 'user_email', user_email, 'update user password', )                                                        
                    return res.json(constants.response.sendSuccess("DEFAULT_SUCCESS_MESSAGE", data, req.params.lang));
              // ---- if passwords does not match
              } else {
                let statusCode = new constants.response().UNAUTHORIZED;
                return res.json(constants.response.sendFailure("INVALID_OTP", req.params.lang, statusCode));
              }
        }
        //---- if invalid id or bad req
      } catch (e) {
        let statusCode = new constants.response().SERVER_ERROR;
        return res.json(constants.response.sendFailure("DEFAULT_FAILURE_MESSAGE", req.params.lang, statusCode));
      }
}

//************************* End of User Update Password Controller ***********************/

module.exports = {
    userRegisterController,
    userLoginController,
    userUpdateController,
    userSendOtpController,
    userUpdatePasswordController,
};