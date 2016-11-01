$(function() {

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
    var m = "Semicolon";
    var a = "KeyQ";
    var q = "KeyA";
    var haut = "ArrowUp";
    var bas = "ArrowDown";
    var vitesseMax = 255;
    var amplitudeSpeed = 30;
    var stepJaugeSpeed = 0.10;
    var minGamma = -85;
    var maxGamma = -50;

    var socket = io();

    var left = 0;
    var right = 0;

    var setSpeed = function(event) {
        var gamma = event.originalEvent.gamma;
        $("#gamma").html("gamma : "+gamma);
        gamma = nx.clip(gamma, minGamma, maxGamma);
        var speed_tmp = nx.scale(gamma, minGamma, maxGamma, 0, 1);
        jaugeSpeed.set({value: speed_tmp});
        var speed = nx.prune(speed_tmp * vitesseMax);
        var speedLeft = left * speed;
        var speedRight = right * speed;
        socket.emit('speed', { left: speedLeft, right: speedRight });
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

    if(is_touch_device())
    {
        $(window).on("deviceorientation", function(event) {
            setSpeed(event);
        });

        $(window).on("orientationchange", function(event) {
            $("#position").html("orientation : "+window.orientation);
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
        //$(".mobile").hide();
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
});