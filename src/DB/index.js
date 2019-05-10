const CONFIG = require('../config');
const mysql = require('mysql');



let db_config = {
    host: CONFIG.DB_HOST,
    user: CONFIG.DB_USER,
    password: CONFIG.DB_PASS,
    database: CONFIG.DB_NAME,
    multipleStatements: true
};

function initializeConnectionPool(db_config) {
    let numConnectionsInPool = 0;
    console.log('CALLING INITIALIZE POOL');
    const conn = mysql.createPool(db_config);
    conn.on('connection', function (connection) {
        numConnectionsInPool++;
        console.log('NUMBER OF CONNECTION IN POOL : ' + numConnectionsInPool);
    });
    return conn;
}



let mysqlQueryPromise = (apiReference, event, queryString, params) => {
    return new Promise((resolve, reject) => {
        const query = connection.query(queryString, params, function (sqlError, sqlResult) {
            console.log("EVENT:" + event + " API REF:" + apiReference + " QUERY:" + queryString + " PARAMS:" + params);
            if (sqlError || !sqlResult) {
                if (sqlError) {
                    if (sqlError.code === 'ER_LOCK_DEADLOCK' || sqlError.code === 'ER_QUERY_INTERRUPTED') {
                        setTimeout(mysqlQueryPromise.bind(null, apiReference, event, queryString, params), 50);
                    } else {
                        return reject({
                            ERROR: sqlError,
                            QUERY: query.sql,
                            Event: event
                        });
                    }
                }
            }
            return resolve(sqlResult);
        });
    });
}

connection = initializeConnectionPool(db_config);
exports.mysqlQueryPromise = mysqlQueryPromise;


