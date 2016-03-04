// scratchSerialRobot.js

// inspired by / based on picoExtension.js by Shane M. Clements


(function(ext) {
    var device = null;
    var rawData = null;

    ext.resetAll = function(){};

    // Hats / triggers

    function appendBuffer( buffer1, buffer2 ) {
        var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
        tmp.set( new Uint8Array( buffer1 ), 0 );
        tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
        return tmp.buffer;
    }

    var poller = null;
    var watchdog = null;
    var inputArray = [];
    function processData() {
        var bytes = new Uint8Array(rawData);

//        inputArray[15] = 0;

        if (watchdog && (bytes[0] == 0x04)) {
            // checking for initial ident
            clearTimeout(watchdog);
            watchdog = null;
        }

        rawData = null;
    }

    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }


    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        console.log('tryNextDevice()')
        device = potentialDevices.shift();
        if (!device) return;
        console.log('device exists!')

        try{
            device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 });
            console.log('device opened')
            device.set_receive_handler(function(data) {
                console.log('Received: ' + data.byteLength);
                try{
                    if(!rawData || rawData.byteLength >= 5) rawData = new Uint8Array(data);
                    else rawData = appendBuffer(rawData, data);

                    //if(rawData.byteLength >= 18) {
                        console.log(rawData);
                        processData();
                        //device.send(pingCmd.buffer);
                    //}
                }
                catch (e){
                    console.log(e.message);
                }
            });

        } catch (e){
            console.log('error opening device');
            console.log(e.message);
        }

        // Tell the PicoBoard to send a input data every 50ms
        var pingCmd = new Uint8Array(1);
        pingCmd[0] = 5;
        poller = setInterval(function() {
            device.send(pingCmd.buffer);
        }, 50);
        watchdog = setTimeout(function() {
            // This device didn't get good data in time, so give up on it. Clean up and then move on.
            // If we get good data then we'll terminate this watchdog.
            clearInterval(poller);
            poller = null;
            device.set_receive_handler(null);
            device.close();
            device = null;
            tryNextDevice();
        }, 250);
    };

    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        if(poller) poller = clearInterval(poller);
        device = null;
    };

    ext._shutdown = function() {
        if(device) device.close();
        if(poller) poller = clearInterval(poller);
        device = null;
    };

    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'PicoBoard disconnected'};
        if(watchdog) return {status: 1, msg: 'Probing for PicoBoard'};
        return {status: 2, msg: 'PicoBoard connected'};
    }


    var descriptor = {
        blocks: [
        ],
        menus: {
        },

    };

    ScratchExtensions.register('SerialRobot', descriptor, ext, {type: 'serial'});
})({});