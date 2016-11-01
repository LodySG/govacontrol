var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var last_action_date = Date.now();
var isControlled = false;

var five = require("johnny-five");
var board = new five.Board({ 
    port: "/dev/ttyACM0",
    repl: false,
    debug: false
});

var port = 8080;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

board.on("ready", function() {
        var motorLeft = new five.Motor({ pins: { pwm: 6, dir: 7 }, invertPWM: true }); // à revoir
        var motorRight = new five.Motor({ pins: { pwm: 11, dir: 12 }, invertPWM: true }); // à revoir
        
        var move = (speedObj) => {
            if (speedObj.left > 0)
                motorLeft.forward(speedObj.left);
            else if (speedObj.left < 0)
                motorLeft.reverse(Math.abs(speedObj.left));
            else
                motorLeft.stop();

            if (speedObj.right > 0)
                motorRight.forward(speedObj.right);
            else if (speedObj.right < 0)
                motorRight.reverse(Math.abs(speedObj.right));
            else
                motorRight.stop();
        };

        io.sockets.on('connection', (socket) => {
            socket.on('speed', (speed) => {
                move(speed);
            });
        });
});

server.listen(port, () => console.log("app launched -> localhost:" + port));
