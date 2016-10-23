var Cylon = require('cylon');

var robot = module.exports = Cylon.robot({

  name: "wheels",
  speedL: 0,
  speedR: 0,

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/tty.usbmodem1411' }
  },

  devices: {
    motorLeftForward: { driver: 'motor', pin: 6 },
    motorLeftReverse: { driver: 'motor', pin: 5 },
    motorRightForward: { driver: 'motor', pin: 11 },
    motorRightReverse: { driver: 'motor', pin: 10 }
  },

  work: function(my) {
    my.motorLeftReverse.speed(0);
    my.motorLeftForward.speed(0);
    my.motorRightReverse.speed(0);
    my.motorRightForward.speed(0);

    every(500, function(){
      console.log("move");
    });
  },

  setSpeed: function(left,right)
  { 
    this.speedL = left;
    this.speedR = right;
  },

  move: function(){

  }
});