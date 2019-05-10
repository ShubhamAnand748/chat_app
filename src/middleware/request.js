const _ = require('underscore');
parseRequestBody = (body, paramsArr) => {
    let keys = paramsArr.map(obj => obj.key);
    let requestBody = {};
    keys.forEach(key => {
        body[key] === undefined || body[key] == '' ? requestBody[key] = _.findWhere(paramsArr, {
            key: key
        }).default : requestBody[key] = body[key];
    });
    return requestBody;
}

module.exports.parseRequestBody = parseRequestBody;