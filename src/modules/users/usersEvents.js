const express = require('express');

// -----------------------define all dependencies -----------------
let {
    //---- base service functions--------
    constants,
    userService,
} = require('../../helperFunction/commonService');

let socketUsers = {};

module.exports = function matchs(io) {

    let app = express.Router();
    io.on('connection', (socket) => {
    console.log('Socket connection established successfully')
    
    // Add users
    socket.on('addUser', (user_id) => {
        try {
            socketUsers[user_id] = socket;
            let userSocket = socketUsers[user_id];
            if (userSocket) {
                userSocket.emit('addUser', user_id);
                console.log('user_id - ', user_id);                
            }
        } catch (e) {
            console.log(e);
            socket.emit('addUser', e);
        }
    });

//*****************************************************************************************/
//                               Check online status                                      //
//                           Socket for online status                                     //
//*****************************************************************************************/
socket.on('user_online_status', (user_id) => {
    try {
        let userSocket = socketUsers[user_id];
        if (userSocket) {
            userSocket.emit('user_online_status', user_id);
            console.log(user_id, 'Online');                
        } else {
            socket.emit('user_online_status', 'Offline or user_id ' + user_id + ' not available');
            console.log('Offline or user_id ' + user_id + ' not available');
        }
    } catch (e) {
        console.log(e);
        socket.emit('user_online_status', e);
    }
});

//********************************* End of Check online status ***************************/

socket.on('disconnect', (error) => {
    console.log('User disconnected', error);
});

});

//*****************************************************************************************/
//                                    End of Socket Events                                // 
//*****************************************************************************************/

return app;
}