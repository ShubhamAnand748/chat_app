const io = require("socket.io-client");
checkSocketIoConnect = function() {
  return new Promise(function(resolve, reject) {
    let errAlready = false;
    let timeout = 5000;
    let url = "http://localhost:3003";

    let socket = io(url, { reconnection: false, timeout: timeout });
    socket.emit("connection");
    // success
    socket.on("connect", () => {
      clearTimeout(timer);
      resolve();
      
      // addUser
      socket.emit("addUser", 2);
      socket.emit("addUser", 11);
      socket.on("addUser", data => {
        console.log('user_id - ', data);                
                
      });

      // user_online_status
      socket.emit("user_online_status", 2);
      socket.emit("user_online_status", 11);
      socket.emit("user_online_status", 1);
      socket.on("user_online_status", data => {
        console.log('user_online_status :', data);        
      });

      // chat_message
      let chatObj = {
        sender_id: 2,
        // receiver_id: 11,
        message: 'Hello',
        id_array: '2,11'
      };
      socket.emit("chat_message", chatObj)
      socket.on("chat_message", data => {
        console.log('data', data);
        
        console.log('user_id - ' + chatObj.sender_id + ':', chatObj.message);        
      });

    });

    // set our own timeout in case the socket ends some other way than what we are listening for
    let timer = setTimeout(() => {
      timer = null;
      error("local timeout");
    }, timeout);
    // common error handler
    function error(data) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (!errAlready) {
        errAlready = true;
        reject(data);
        socket.disconnect();
      }
    }
    // errors
    socket.on("connect_error", error);
    socket.on("connect_timeout", error);
    socket.on("error", error);
    socket.on("disconnect", error);
  });
};

checkSocketIoConnect();
