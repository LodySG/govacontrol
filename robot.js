var Cylon = require('cylon');

var robot = module.exports = Cylon.robot({

  name: "wheels",
  speedL: 0,
  speedR: 0,

  connections: {
    arduino: { adaptor: 'firmata', port: '/dev/ttyACM0' }
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
      my.move();
    });
  },

  setSpeed: function(obj)
  { 
    this.speedL = obj.left;
    this.speedR = obj.right;
  },

  move: function(){
    console.log('speed left: ' + this.speedL +', right: '+ this.speedR);

    if(this.speedL > 0) {
      this.motorLeftReverse.speed(0);
      this.motorLeftForward.speed(this.speedL);
    } else if( this.speedL < 0 ) {
      this.motorLeftReverse.speed(Math.abs(this.speedL));
      this.motorLeftForward.speed(0);
    } else {
      this.motorLeftReverse.speed(0);
      this.motorLeftForward.speed(0);
    }

    if(this.speedR > 0) {
      this.motorRightReverse.speed(0);
      this.motorRightForward.speed(this.speedR);
    } else if( this.speedR < 0 ) {
      this.motorRightReverse.speed(Math.abs(this.speedR));
      this.motorRightForward.speed(0);
    } else {
      this.motorRightReverse.speed(0);
      this.motorRightForward.speed(0);
    }

  }
});