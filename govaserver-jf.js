var express = require('express');
var path = require('path');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var last_action_date = Date.now();
var isControlled = false;
var robot = require("./robot-jf.js");

console.log(robot);

var port = 5360;

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.render(__dirname + '/index.html');
});

robot.on("ready", function() {
    io.on('connection', function(socket) {
        socket.on('speed', function(speed) {
            robot.move(speed);
        });
    });
});

server.listen(port, () => console.log("app launched -> localhost:" + port));