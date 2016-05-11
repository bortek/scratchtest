// scratchSerialRobot.js

// inspired by / based on picoExtension.js by Shane M. Clements


(function(ext) {
    var device = null;
    var rawData = null;

    ext.resetAll = function(){};
    ext._deviceConnected = function(){};

    ws = new WebSocket("ws://archie3.local:5996");

    ws.onopen = function()
   {
      // Web Socket is connected, send data using send()
      //ws.send(cmd);
      console.log("ws open.");
      ws.send("scratch started");
      //console.log("sending cmd: " + cmd);
      //window.setTimeout(function(){callback()}, 1000);
   };

   ws.onmessage = function (evt) 
   { 
      var received_msg = evt.data;
      console.log("received: " + evt.data);
   };


    function sendCmd(cmd, callback){
        if (ws.readyState){
            ws.send(JSON.stringify(cmd));
        }
        callback();

    }
/*
    var ws = new WebSocket("ws://archie3.local:5996");


*/
    ext._shutdown = function() {
        if(device) device.close();
        if(poller) poller = clearInterval(poller);
        device = null;
    };

    ext._getStatus = function() {
        //if (!ws.readyState){return {status: 1, msg: 'Websocket connecting'}};
        return {status: 2, msg: 'websocket connected'};
    }

    ext.send_message = function(callback){
        console.log("send command function");
        //console.log("wsa size: "  + wsa.length);
        cmd = {"cmd": "celebrate", "id": 12};
        sendCmd(cmd,callback);
        //window.setTimeout(function(){callback()}, 1000);
        //callback();
    }

    ext.wiggle = function(callback){
      cmd = {"cmd": "celebrate", "id": 12};
      sendCmd(cmd,callback);
    }

    ext.walk_forward = function(numsteps, callback){
      cmd = {"cmd": "walk", "id": 6, "numsteps": numsteps, "steplength": 50, "turn": 0, "movetime": 16 };
      sendCmd(cmd, callback);
    }


    var descriptor = {
        blocks: [
            ['w', 'Wiggle', 'wiggle'],
            ['w', 'Walk %n steps forward', 'walk_forward', 2]
        ],
        menus: {
        },

    };

    ScratchExtensions.register('SerialRobot', descriptor, ext, {type: 'serial'});
})({});