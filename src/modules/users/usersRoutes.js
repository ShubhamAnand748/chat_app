const express = require('express');
module.exports = function users() {
    
    let app = express.Router();
    // -----------------------define all dependencies -----------------
    let {
        // ----------------Middleware------------------------
        authMiddleware,
        upload,
        commonFunctions,
    } = require('../../helperFunction/commonService');
    const userValidators = require('./userRequestValidators');
    //------------------------ end of dependencies -------------------
    // let Upload = upload.fields([{
    //     name: 'user_profile_pic'
    // }]);


const {
    userRegisterController,
    userLoginController,
    userUpdateController,
    userSendOtpController,
    userUpdatePasswordController
} = require('./usersController');


app.post('/:lang/register', userValidators.userValidations.validateUserRegister, userRegisterController);
app.post('/:lang/login', userValidators.userValidations.validateUserSignin, userLoginController);
app.put('/:lang/user', userValidators.userValidations.validateUserUpdate, userUpdateController);
app.post("/:lang/send_otp_forgot_password", userSendOtpController);
app.put("/:lang/user_password", userUpdatePasswordController);

return app;
}

//****************************************************************************************/
//                                    End of User Routes                                 //
//****************************************************************************************/