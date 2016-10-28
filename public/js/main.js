$(function() {

    function is_touch_device() {
        return 'ontouchstart' in window        // works on most browsers 
            || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };

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
    var amplitudeVirage = 15;
    var amplitudeSpeed = 30;
    var stepJaugeSpeed = 0.10;

    var initialAlpha = undefined;
    var initialBeta = undefined;
    var initialGamma = undefined;

    var currentBeta = undefined;
    var currentGamma = undefined;
    var currentAlpha = undefined;

    var desktopSpeedLeft = 0;
    var desktopSpeedRight = 0;

    var socket = io();

    var left = 0;
    var right = 0;

    var getMove = function(event) {
        currentAlpha = nx.prune(event.originalEvent.alpha, 1);
        currentBeta = nx.prune(event.originalEvent.beta, 1);
        currentGamma = nx.prune(event.originalEvent.gamma, 1);

        if (initialAlpha != undefined) {
            var scaleBeta = initialBeta - currentBeta;
            var scaleGamma = initialGamma - currentGamma;
            var virage_tmp = nx.scale(scaleBeta, 0-amplitudeVirage, amplitudeVirage, 0-vitesseMax, vitesseMax);
            var speed_tmp = nx.scale(scaleGamma, amplitudeSpeed, 0-amplitudeSpeed, 0-vitesseMax, vitesseMax);
            var speed_clip = nx.clip(speed_tmp, 0-vitesseMax, vitesseMax);
            var virage_clip = nx.clip(virage_tmp, 0-vitesseMax, vitesseMax);
            var speed = nx.prune(speed_clip, 0);
            var virage = nx.prune(virage_clip, 0);

            if ((speed > 0)) {
                left = virage > 0 ? speed - virage : speed;
                right = virage < 0 ? speed + virage : speed;
            } else if (speed < 0) {
                left = virage > 0 ? speed + virage : speed;
                right = virage < 0 ? speed - virage : speed;
            } else {
                left = 0;
                right = 0;
            }
        } else {
            left = 0;
            right = 0;
        }

        $("#inclinaison").html("alpha : " + currentAlpha + ", beta : " + currentBeta + ", gamma : " + currentGamma);
        $("#left").html("left : " + nx.prune(left, 1));
        $("#right").html("right : " + nx.prune(right, 1));
        $("#speed").html("speed : " + speed);
        $("#virage").html("virage : " + virage);
        $("#initial").html("{ " + initialAlpha + " , " + initialBeta + " , " + initialGamma + " }");

        socket.emit('speed', { left: left, right: right });
    };

    var commandGyro = function(data) {
        console.log(currentGamma);
        if (data == 1) {
            if (initialBeta == undefined) {
                initialGamma = currentGamma;
                initialBeta = currentBeta;
                initialAlpha = currentAlpha;
            }
        } else {
            initialGamma = undefined;
            initialBeta = undefined;
            initialAlpha = undefined;
        }
    };

    nx.colorize("fill", "#3A4750");
    nx.colorize("border", "#303841");
    nx.colorize("accent", "#F3F3F3");
    desktopSpeed.hslider = false;
    desktopSpeed.draw();

    if(is_touch_device())
    {
        $(window).on("deviceorientation", function(event) {
            getMove(event);
        });

        $(window).on("orientationchange", function(event) {
            $("#position").html("orientation : "+window.orientation);
            location.reload();
        });

        move.on('press', commandGyro);

        $("#desktopSpeed").hide();

    } else {

        $("#move").hide();

        $(document).keydown(function(event) {
            //console.log(event.originalEvent.code);
            var speed = nx.prune(desktopSpeed.val.value * vitesseMax);

            switch(event.originalEvent.code){
                case p:
                    desktopSpeedRight = speed;
                    break;
                case m:
                    desktopSpeedRight = 0 - speed;
                    break;
                case a:
                    desktopSpeedLeft = speed;
                    break;
                case q:
                    desktopSpeedLeft = 0 - speed;
                    break;
                case haut:
                    var value = desktopSpeed.val.value;
                    value += stepJaugeSpeed;
                    value = nx.clip(value,0,1);
                    desktopSpeed.set({value: value});
                    break;
                case bas:
                    var value = desktopSpeed.val.value;
                    value -= stepJaugeSpeed;
                    value = nx.clip(value,0,1);
                    desktopSpeed.set({value: value});
                    break;
            };
            socket.emit('speed', { left: desktopSpeedLeft, right: desktopSpeedRight });
            $("#clavier").html(" speed : {"+desktopSpeedLeft+","+desktopSpeedRight+"}");
            event.preventDefault();
        });

        $(document).keyup(function(event) {
            switch(event.originalEvent.code){
                case p:
                case m:
                    desktopSpeedRight = 0;
                    break;
                case a:
                case q:
                    desktopSpeedLeft = 0;
                    break;
            };
            socket.emit('speed', { left: desktopSpeedLeft, right: desktopSpeedRight });
            $("#clavier").html(" speed : {"+desktopSpeedLeft+","+desktopSpeedRight+"}");
            event.preventDefault();
        });
    }
    
    $(window).on("orientationchange", function(event) {
        location.reload(true);
    });

    $('.spinner').hide();
});