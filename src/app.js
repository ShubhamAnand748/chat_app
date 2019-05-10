const express = require("express");
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const config = require('./config');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
// Routes
const allRoutes = require('./routes');
// View Engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// socket.io
const http = require('http').Server(app);
const ioServer = require('socket.io');
const io = new ioServer();
io.attach(http);
const socketEvents = require('./modules/users/usersEvents')(io);
//------------------------------- use cors globaly --------------------
app.use(cors());
//--------------------------------------------------------------------
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
// Define App Routes
app.use(allRoutes);
// Start application
const PORT = config.PORT;
http.listen(PORT, () => {
    console.log(`Connection established on Port: ${PORT}`);
});