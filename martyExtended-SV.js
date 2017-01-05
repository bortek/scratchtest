// scratchSerialRobot.js

// inspired by / based on picoExtension.js by Shane M. Clements


(function(ext) {
    var device = null;
    var rawData = null;

    var hostname = prompt("Knappa in Martys IP address?", "192.168.0.241");
    console.log("2016-12-07 17:26")


    var waitingForReply = {
      setup: function(callback, timeout=5000){
        this.callback = callback;
        this.timeoutID = window.setTimeout(function(msg) {
          this.clearCallback();
        }.bind(this), timeout);
      },

      clearCallback: function(data){
        try {
          rcv = JSON.parse(data);
          if(rcv.sensorData != undefined){
            returnval = rcv.sensorData;
          } else {
            returnval = data;
          }
        } catch(err){
          returnval = data;
        }

        
        if (this.callback != undefined){
          this.callback(returnval);
          console.log("callback with data: " + returnval);
          this.callback = undefined;
        }
        if (typeof this.timeoutID === "number") {
          window.clearTimeout(this.timeoutID);
          this.timeoutID = undefined;
        }
      },

    }

    ext.resetAll = function(){};
    ext._deviceConnected = function(){};

    console.log("hostname: " + hostname);

    ws = new WebSocket("ws://" + hostname + ":5996");

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

      waitingForReply.clearCallback(evt.data);
   };


    function sendCmd(cmd, callback, timeout=5000){
        if (ws.readyState){
            ws.send(JSON.stringify(cmd));
        }
        waitingForReply.setup(callback, timeout);

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

    ext.walk = function(numsteps, steplength, turn, steptime, callback){
      cmd = {"cmd": "walk", "id": 6, "numsteps": parseInt(numsteps), "steplength": parseInt(steplength), "turn": parseInt(turn), "movetime": parseInt(parseFloat(steptime)*1000)};
      sendCmd(cmd, callback, numsteps*steptime*1000+500);
    }

    ext.walk_forward = function(numsteps, callback){
      var steptime = 1600;
      cmd = {"cmd": "walk", "id": 6, "numsteps": parseInt(numsteps), "steplength": 50, "turn": 0, "movetime": steptime};
      sendCmd(cmd, callback, numsteps*steptime+500);
    }

    ext.walk_backward = function(numsteps, callback){
      var steptime = 1600;
      cmd = {"cmd": "walk", "id": 6, "numsteps": parseInt(numsteps), "steplength": -50, "turn": 0, "movetime": steptime};
      sendCmd(cmd, callback, numsteps*steptime+500); 
    }

    ext.turn = function(direction, numsteps, callback){
      var turn = 40;
      var steptime = 1300;
      if (direction == "right" ){
        turn = -40;
      }
      cmd = {"cmd": "walk", "id": 6, "numsteps": parseInt(numsteps), "steplength": 0, "turn": turn, "movetime": steptime};
      sendCmd(cmd, callback, numsteps*steptime+500);
    }

    ext.hello = function(callback){
      cmd = {"cmd": "hello", "id": 0};
      sendCmd(cmd, callback, 2500);
    }

    ext.kick = function(leg, callback){
      cmd = {"cmd": "kick", "id": 8, "leg": leg};
      sendCmd(cmd, callback); 
    }

    ext.eyes = function(eyes, callback){
      cmd = {"cmd": "eyes", "id": 7, "eyes": eyes};
      sendCmd(cmd, callback);
    }

    ext.lean = function(direction, callback){
      cmd = {"cmd": "lean", "id": 0, "direction": direction, "amount": 50};
      sendCmd(cmd, callback);
    }

    ext.liftLeg = function(leg, callback){
      cmd = {"cmd": "liftLeg", "id": 10, "leg": leg, "amount": 100};
      sendCmd(cmd, callback);
    }

    ext.lowerLeg = function(callback){
      cmd = {"cmd": "lowerLeg", "id": 11};
      sendCmd(cmd, callback);
    }

    ext.moveHip = function(leg, direction, movetime, callback){
      cmd = {"cmd": "moveHip", "id": 2, "leg": leg, "direction": direction, "movetime": parseInt(parseFloat(movetime)*1000), "amount": 30};
      sendCmd(cmd, callback);
    }

    ext.switchPressed = function(callback){
      cmd = {"cmd": "get", "id": 13, "sensor": "gpio", "sensor_id": 0};
      sendCmd(cmd, callback);
    }

    ext.moveJoint = function(joint, angle, movetime, callback){
      cmd = {"cmd": "moveJoint", "id": 12, "joint": joint, "angle": parseInt(angle), "movetime": parseInt(parseFloat(movetime)*1000)};
      sendCmd(cmd, callback);
    }

    ext.getGPIO = function(channel, callback){
      cmd = {"cmd": "get", "id": 13, "sensor": "gpio", "sensor_id": parseInt(channel)};
      sendCmd(cmd, callback);
    }

    ext.getMotorCurrent = function(joint, callback){
      cmd = {"cmd": "get", "id": 13, "sensor": "current", "joint": joint};
      sendCmd(cmd, callback);
    }

    ext.getAccel = function(axis, callback){
      cmd = {"cmd": "get", "id": 13, "sensor": "accelerometer", "axis": axis};
      sendCmd(cmd, callback);
    }

    ext.getBattery = function(callback){
      cmd = {"cmd": "get", "id": 13, "sensor": "battery"};
      sendCmd(cmd, callback);
    }

    ext.disableMotors = function(callback){
      cmd = {"cmd": "stop", "id": 14};
      sendCmd(cmd, callback);
    }



    var descriptor = {
        blocks: [
          ['w', 'Gör klar', 'hello'],
          ['w', 'Stäng av motorer', 'disableMotors'],
          ['w', 'Vifta', 'wiggle'],
          ['w', 'Gå: %n steg, steg lengd: %n, vänd mängd: %n, steg tid: %n', 'walk', 2, 40, 10, 1.8],
          ['w', 'Gå %n steg fram', 'walk_forward', 2],
          ['w', 'Gå %n steg bak', 'walk_backward', 2],
          ['w', 'Vänd %m.leg %n steg', 'turn', 'vänster', 2],
          ['w', 'Kicka %m.leg fot', 'kick', 'vänster'],
          ['w', 'Luta %m.leg', 'lean', 'vänster'],
          ['w', 'Lyft %m.leg fot', 'liftLeg', 'vänster'],
          ['w', 'Sänk fot', 'lowerLeg'],
          ['w', 'Rör %m.leg fot %m.sagittal i %n sekunder', 'moveHip', 'vänster', 'fram', 1.1],
          ['w', 'Ögon %m.eyes', 'eyes', 'vanliga'],
          ['w', 'Rör %m.joints till %n grader i %n sekunder', 'moveJoint', 'höger höft', 0, 0],
          ['R', 'Stöt knap intryckt', 'switchPressed'], 
          ['R', 'Ingång %m.gpios', 'getGPIO', '0'],
          ['R', '%m.motorCurrents motor Ström', 'getMotorCurrent', 'höger arm'],
          ['R', 'Accelerometer %m.accel', 'getAccel', 'Z axel'],
          ['R', 'Batterispänninge', 'getBattery'],

//          ['w', 'Demo', 'demo']
        ],
        menus: {
          leg: ['vänster', 'höger'],
          eyes: ['vanliga', 'vida', 'arga', 'upphetsade'],
          sagittal: ['fram', 'bak'],
          joints: ['höger höft', 'höger twist', 'höger knee', 'vänster höft', 'vänster twist', 'vänster knee', 'höger arm', 'vänster arm', 'eyes'],
          gpios: ['0', '1', '2', '3', '4', '5', '6', '7'],
          motorCurrents: ['höger höft', 'höger twist', 'höger knee', 'vänster höft', 'vänster twist', 'vänster knee', 'höger arm', 'vänster arm'],
          accel: ['X axel', 'Y axel', 'Z axel'],
        },

    };

    ScratchExtensions.register('SerialRobot', descriptor, ext, {type: 'serial'});
})({});
