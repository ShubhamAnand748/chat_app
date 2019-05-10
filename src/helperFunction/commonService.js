//------------Define Module ------------------------
const dbHandler = require('../DB');
const utf8 = require('utf8');
    constants = require('../utils/constants'),
    Promise = require('bluebird'),
    db = require('../DB'),
    _ = require('underscore'),
    bcrypt = require('bcrypt-nodejs'),
    multer = require('multer');

    // ----------------Middleware------------------------
    request = require('../middleware/request'),
    // upload = require('../middleware/storage.js')('armbet_app'),
    storage = require('../middleware/storage.js'),
    authMiddleware = require('../middleware/authMiddleware'),
    userService = require('../modules/users/usersServices'); // userService
    const commonFunctions = {
        //-------------------  insert a single a row  -------------------
        insertSingleRow: (APIRef, table, object, event) => {
            return new Promise((resolve, reject) => {
    
                let sql = 'INSERT INTO ' + table + ' SET ?';
                dbHandler.mysqlQueryPromise(APIRef, event, sql, [object]).then((rows) => {
                    resolve(rows);
    
                }).catch((error) => {
                    reject(error);
                });
            })
        },
    
        //-------------------  Get single row -------------------
        getSingleRow: (APIRef, table, keyColoumn, id, event, queryString = '') => {
            return new Promise((resolve, reject) => {
    
                let sql = 'SELECT * from ' + table + ' where ' + keyColoumn + ' = ?' + queryString;
                dbHandler.mysqlQueryPromise(APIRef, event, sql, [id]).then((rows) => {
                    resolve(rows);
    
                }).catch((error) => {
                    reject(error);
                });
            })
        },

    //-------------------  Update a single row  -------------------
    updateSingleRow: (APIRef, table, object, keyColoumn, id, event, queryString = '') => {
        return new Promise((resolve, reject) => {

            let sql = 'UPDATE ' + table + ' SET ? where ' + keyColoumn + ' = ?' + queryString;
            dbHandler.mysqlQueryPromise(APIRef, event, sql, [object, id]).then((rows) => {
                resolve(rows);

            }).catch((error) => {
                reject(error);
            });
        })
    },

        upload: (req, res) => {
        return new Promise((resolve, reject) => {
            if (req.file === undefined && req.files === undefined) {
                console.log('req.file', req.file);
                console.log('req.files', req.files);
                resolve({ status: 200, message: 'File not attached', data: req.body.body })
              } else {
                if (err) {
                    console.log('err', err);
                  reject({ status: 400, message: 'error', data: err })
                } else {
                    console.log('req.body.body', req.body.body);
                    
                  resolve({
                    status: 200,
                    message: 'File attached',
                    filename: req.file ? req.file.filename : _.pluck(req.files, 'filename'),
                    data: req.body.body
                  })
                }
            }
        })

        },

    }

module.exports = {
    //-------module------------------
    bcrypt,
    multer,
    // validator,
    Promise,
    db,
    _,
    // config,
    dbHandler,
    utf8,
    //---- base service functions--------
    constants,
    // ----------------Middleware------------------------
    authMiddleware,
    request,
    storage,
    //-------------helper function-------------
    commonFunctions,
    //---------  Define models---------------
    //-------- Define services -----------
    userService,
}
