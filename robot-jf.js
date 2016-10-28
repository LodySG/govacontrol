/*
  IMPORTANT!!! This example is not intended for off the shelf
  H-Bridge based motor controllers. It is for home made H-Bridge
  controllers. Off the shelf controllers abstract away the need
  to invert the PWM (AKA Speed) value when the direction pin is set
  to high. This is for controllers that do not have that feature.
*/
var five = require("johnny-five");

var board = new five.Board({ port: "/dev/ttyACM0" });

board.on("ready", function() {
        var motorLeft = new five.Motor({ pins: { pwm: 6, dir: 7 }, invertPWM: true }); // à revoir
        var motorRight = new five.Motor({ pins: { pwm: 11, dir: 12 }, invertPWM: true }); // à revoir
        var move = function(speedObj) {
            if (speedObj.left > 0)
                this.motorLeft.forward(speedObj.left);
            else if (speedObj.left < 0)
                this.motorLeft.reverse(speedObj.left);
            else
                this.motorLeft.stop();

            if (speedObj.right > 0)
                this.motorRight.forward(speedObj.left);
            else if (speedObj.right < 0)
                this.motorRight.reverse(speedObj.left);
            else
                this.motorRight.stop();
        };
});

exports.board = board;

/*
board.on("ready", function() {
    
    board.repl.inject({
        motorLeft: this.motorLeft,
        motorRight: this.motorRight,
    });
    
    motor.on("start", function() {
        console.log("start", Date.now());
    });

    motor.on("stop", function() {
        console.log("automated stop on timer", Date.now());
    });

    motor.on("forward", function() {
        console.log("forward", Date.now());

        // demonstrate switching to reverse after 5 seconds
        board.wait(5000, function() {
            motor.reverse(255);
        });
    });

    motor.on("reverse", function() {
        console.log("reverse", Date.now());

        // demonstrate stopping after 5 seconds
        board.wait(5000, function() {
            motor.stop();
        });
    });

    // set the motor going forward full speed
    motor.forward(255);

});
*/