$(function(){
    
    function start() {

    function is_touch_device() {
        return 'ontouchstart' in window  || navigator.maxTouchPoints;
    }

    switch(window.orientation)
    {
        case 0:
            $("#pad").hide();
            $("#message").html("C'est pas dans le bon sens !!!");
            break;
        case -90:
            $("#pad").hide();
            $("#message").html("Dans l'autre sens ...");
            break;
        default:
            break;
    }

    var p = "KeyP";
    var c = "KeyC";
    var m = "Semicolon";
    var a = "KeyQ";
    var q = "KeyA";
    var l = "KeyL";
    var o = "KeyO";
    var haut = "ArrowUp";
    var bas = "ArrowDown";
    var vitesseMax = 255;
    var minAngle = 0;
    var maxAngle = 180;
    var amplitudeSpeed = 30;
    var stepJaugeSpeed = 0.10;
    var minGamma = -85;
    var maxGamma = -50;
    var centerY = 0.5;
    var centerX = 0.5;

    var socket = io();

    var left = 0;
    var right = 0;
    var angleUD = 90;
    var angleLR = 90;

    var setSpeed = function(event) {
        var gamma = event.originalEvent.gamma;
        gamma = nx.clip(gamma, minGamma, maxGamma);
        var speed_tmp = nx.scale(gamma, minGamma, maxGamma, 0, 1);
        jaugeSpeed.set({value: speed_tmp});
        var speed = nx.prune(speed_tmp * vitesseMax);
        var speedLeft = left * speed;
        var speedRight = right * speed;
        socket.emit('speed', { left: speedLeft, right: speedRight });
    };

    var setCam = function(event) {
        var ud = event.y;
        var lr = event.x;
        angleLR = nx.scale(lr, 1, 0, minAngle, maxAngle);
        angleUD = nx.scale(ud, 1, 0, minAngle, maxAngle);
        socket.emit('cam', {ud: angleUD, lr: angleLR});
    };

    var setLum = function(event){
        //console.log(event.value);
        socket.emit('lum', {val: event.value});
    };

    var toggleLum = function(event){   
        if(phare.val.value == 1){
            phare.set({value: 0});
            setLum(phare.val);
        }
        else{
            phare.set({value: 1});
            setLum(phare.val);
        }
    };

    var toggleMouse = function(event){
        if(vue.val.value == 1){
            vue.set({value: 0});
        }
        else{
            vue.set({value: 1});
        }
    };

    nx.colorize("fill", "#3A4750");
    nx.colorize("border", "#303841");
    nx.colorize("accent", "#F3F3F3");
    jaugeSpeed.hslider = false;
    
    jaugeSpeed.label = true;
    leftForward.label = true;
    leftReverse.label = true;
    rightForward.label = true;
    rightReverse.label = true;

    jaugeSpeed.draw();

    cam.on('*', function(data){
        //console.log(data);
        if(vue.val.value == 1)
            setCam(data);
    });

    phare.on('*', function(data){
        //console.log(data);
        setLum(data);
    });

    if(is_touch_device())
    {
        $("#leftForward").addClass("mobile");
        $("#rightForward").addClass("mobile");
        $("#leftReverse").addClass("mobile");
        $("#rightReverse").addClass("mobile");
        
        $(window).on("deviceorientation", function(event) {
            setSpeed(event);
        });

        $(window).on("orientationchange", function(event) {
            location.reload();
        });

        leftForward.on('press', function(data){
            if(data == 1)
                left = 1;
            else
                left = 0;
        });
        leftReverse.on('press', function(data){
            if(data == 1)
                left = -1;
            else
                left = 0;
        });
        rightForward.on('press', function(data){
            if(data == 1)
                right = 1;
            else
                right = 0;
        });
        rightReverse.on('press', function(data){
            if(data == 1)
                right = -1;
            else
                right = 0;
        });

        $(".desktop").hide();

    } else {
        $("#leftForward").hide();
        $("#rightForward").hide();
        $("#leftReverse").hide();
        $("#rightReverse").hide();
        
        $(document).keydown(function(event) {
            var speed = nx.prune(jaugeSpeed.val.value * vitesseMax);
            var value = jaugeSpeed.val.value;

            switch(event.originalEvent.code){
                case p:
                    right = speed;
                    break;
                case m:
                    right = 0 - speed;
                    break;
                case a:
                    left = speed;
                    break;
                case q:
                    left = 0 - speed;
                    break;
                case c:
                    cam.set({x: centerX, y: centerY});
                    setCam(cam.val);
                    break;
                case l:
                    toggleLum();
                    break;
                case o:
                    toggleMouse();
                    break;
                case haut:
                    value += stepJaugeSpeed;
                    value = nx.clip(value,0,1);
                    jaugeSpeed.set({value: value});
                    break;
                case bas:
                    value -= stepJaugeSpeed;
                    value = nx.clip(value,0,1);
                    jaugeSpeed.set({value: value});
                    break;
            };
            socket.emit('speed', { left: left, right: right });
            $("#speed").html(" speed : {"+left+","+right+"}");
            event.preventDefault();
        });

        $(document).keyup(function(event) {
            switch(event.originalEvent.code){
                case p:
                case m:
                    right = 0;
                    break;
                case a:
                case q:
                    left = 0;
                    break;
            }
            socket.emit('speed', { left: left, right: right });
            $("#speed").html(" speed : {"+left+","+right+"}");
            event.preventDefault();
        });
    }
    
    $(window).on("orientationchange", function(event) {
        location.reload(true);
    });

    $('.spinner').hide();
};

setTimeout(start, 2000);

});