const Boom = require('boom');

let localisedStrings = {
    'DEFAULT_SUCCESS_MESSAGE': {
        en: 'Successful.',
        es: 'Spanish successful'
    },
    'DEFAULT_FAILURE_MESSAGE': {
        en: 'Failure.',
        es: 'Spanish failure.'
    },
    'USER_SIGNUP_SUCCESS': {
        en: 'Registration successful.',
        es: 'Spanish registration successful.'
    },
    'USER_SIGNUP_FAILURE': {
        en: 'Registration unsuccessful.',
        es: 'Spanish registration unsuccessful.'
    },
    'USER_LOGIN_SUCCESS': {
        en: 'Login successful.',
        es: 'Spanish login successful.'
    },
    'USER_LOGIN_FAILURE': {
        en: 'Login unsuccessful.',
        es: 'Spanish login unsuccessful.'
    },
    'UPDATE_PROFILE_SUCCESS': {
        en: 'Your profile updated successfully. ',
        es: 'Spanish - Your profile updated successfully.'
    },
    'MANDATORY_PARAMETER_MISSING': {
        en: 'One or more of the required parameters are missing.',
        es: 'Spanish - mandatory parameters missing.'
    },
    'EMAIL_ALREADY_EXISTS': {
        en: 'This email is already registered. Please try logging in.',
        es: 'Spanish - This email is already registered. Please try logging in.'
    },
    'INCORRECT_PASSWORD': {
        en: 'Please enter vaild password.',
        es: 'Spanish - Please enter vaild password.'
    },
    'INVALID_LANGUAGE': {
        en: 'Please enter valid language code.',
        es: 'Spanish - Please enter valid language code.'
    },
    'INVALID_OTP': {
        en: 'Please enter valid otp.',
        es: 'Spanish - Please enter valid otp.'
    },
    'ALREADY_EXIST': {
        en: 'This value already exist.',
        es: 'Spanish - This value already exist.'
    },
    'INVAILD_USER_PASSWORD': {
        en: 'You have entered an invalid email or password. ',
        es: 'Spanish - You have entered an invalid email or password.'
    },
    'NOT_EXIST_EMAIL_PHONE': {
        en: 'This email or phone number is not registered. ',
        es: 'Spanish - This email or phone number is not registered.'
    },
    'INVALID_OLD_PASSWORD': {
        en: 'Your old password is incorrect. ',
        es: 'Spanish - Your old password is incorrect.'
    },
    'OLD_NEW_PASSWORD_SAME': {
        en: 'Old and new passwords must be different. ',
        es: 'Spanish - Old and new passwords must be different.'
    },
    'PASSWORD_NOT_MATCH': {
        en: 'New and confirm password does not match. ',
        es: 'Spanish - New and confirm password does not match.'
    },
    'RETRY_OTP': {
        en: 'Please try agin for otp.',
        es: 'Spanish - Please try agin for otp.'
    },
    'INVALID_TOKEN': {
        en: 'Please provide valid token.',
        es: 'Spanish - Please provide valid token.'
    },
    'TOKEN_MISMATCH': {
        en: 'Token doesn\'t match with last updated token.',
        es: 'Spanish - Token doesn\'t match with last updated token.'
    },
    'PLEASE_PROVIDE_TOKEN': {
        en: 'Please provide token.',
        es: 'Spanish - Please provide token.'
    },
    'NO_USER_FOR_THIS_TOKEN': {
        en: 'No user present for this token.',
        es: 'Spanish - No user present for this token.'
    },
    'USERNAME_ALREADY_EXISTS': {
        en: 'This username is already taken. Please try anothe username.',
        es: 'Spanish - This username is already taken. Please try anothe username.'
    }
}
class sendResponse {

    constructor() {
        //---sucess code
        this.SUCCESS = 200;
        //-----Server errors
        this.SERVER_ERROR = 500;
        this.GATEWAY_TIMEOUT = 504;
        // ----Client errors
        this.NOT_FOUND = 404;
        this.UNAUTHORIZED = 401;
        this.FORBIDDEN = 403;
        this.BAD_REQUEST = 400;
        this.REQUEST_TIMEOUT = 408
        this.ALREADY_EXIST = 409;
        this.PRECONDITION_FAILED = 412;
        // ----System Error Codes 
        this.PARAMETER_MISSING = 1100;
        this.FILE_NOT_UPLOADED = 1101;
        this.VALUE_NOT_UNIQUE = 1102;
        // ---- Unofficial codes
        this.METHOD_FAILURE = 420;
        // ----Internet Information Services
        this.TIME_OUT = 440;
        this.RETRY = 449;
        this.REDIRECT = 451;
    }    
    static sendFailure(errObj, lang, statusCode) {
        if (typeof errObj === typeof '') {
            var message = localiseStrings.getLocalisedTextFor(errObj, lang);
            message = message === undefined ? localisedStrings.DEFAULT_FAILURE_MESSAGE.lang : message;
            return new Boom(message, {
                statusCode: statusCode
            });
        } else {
            return Boom.boomify(errObj, {
                statusCode: statusCode
            })
        }
    }
    static sendSuccess(strKey, data, lang) {
        var message = localiseStrings.getLocalisedTextFor(strKey, lang);
        message = message === undefined ? localisedStrings.DEFAULT_SUCCESS_MESSAGE.lang : message;
        return {
            success: 200,
            message: message,
            data: data
        };
    }
}
class localiseStrings {
    static getLocalisedTextFor(key, lang) {
        try {
            var message = localisedStrings[key][lang];
            console.log(message)
            message = message === undefined ? localisedStrings['DEFAULT_FAILURE_MESSAGE']['en'] : message;
            return message;
        } catch (e) {
            message = message === undefined ? localisedStrings['INVALID_LANGUAGE']['en'] : message;
            return message;
        }
    }
}

module.exports = {
    response: sendResponse,
    localise: localiseStrings,
}