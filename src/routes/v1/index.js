const allRoutes = require('express').Router();
const users = require('../../modules/users/usersRoutes');

allRoutes.use(users());

module.exports = allRoutes;
