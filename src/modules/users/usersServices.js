const { dbHandler } = require('../../helperFunction/commonService');
const APIRef = 'User Services';
const sgMail = require('@sendgrid/mail');
const config = require('../../config');


let userService = {
    getUserData: (user_email, user_password) => {

        return new Promise((resolve, reject) => {

            dbHandler.mysqlQueryPromise(APIRef, 'getUserData', 'SELECT * FROM `tbl_user` WHERE `user_email`=? AND `user_password`=?', [user_email, user_password]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })

    },
        // sendgrid for mail
        sendgrid: (mail_obj, dynamic_template_data) => {
            sgMail.setApiKey(config.sendgrid_api_key)
            sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
            const msg = {
                to: mail_obj.mail_to, 
                from: mail_obj.mail_from,
                subject: mail_obj.subject,
                text: mail_obj.text,
                html: mail_obj.html,
                templateId: mail_obj.templateId,
                dynamic_template_data: dynamic_template_data
            };
            sgMail.send(msg).then((myData) => console.log('Mail sent successfully', mail_obj.mail_to))       
            .catch(error => console.log('Error', error.toString()));
            console.log(mail_obj)     
            return 1
        }
}
module.exports = userService;
