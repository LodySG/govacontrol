$(function() {

    var initialAlpha = undefined;
    var initialBeta = undefined;
    var initialGamma = undefined;

    var currentBeta = undefined;
    var currentGamma = undefined;
    var currentAlpha = undefined;

    var socket = io();

    var left = 0;
    var right = 0;

    var getMove = function(event){
        currentAlpha = nx.prune(event.originalEvent.alpha, 1);
        currentBeta = nx.prune(event.originalEvent.beta, 1);
        currentGamma = nx.prune(event.originalEvent.gamma, 1);

        var scaleBeta = initialBeta - currentBeta;
        var scaleGamma = initialGamma - currentGamma;
        var speed_tmp = nx.scale(scaleBeta,-30,30,-255,255);
        var virage_tmp = nx.scale(scaleGamma,-30,30,-255,255);
        var speed_clip = nx.clip(speed_tmp,-255,255 );
        var virage_clip = nx.clip(virage_tmp,-255,255 );
        var speed = nx.prune(speed_clip,0);
        var virage = nx.prune(virage_clip,0);
        
        if(initialAlpha != undefined) {
            left = virage > 0 ? speed - virage : speed;
            right = virage < 0 ? speed + virage : speed;
        } else {
            left = 0;
            right = 0;
        }

        $("#alpha").html("alpha : "+currentAlpha);
        $("#beta").html("beta : "+currentBeta);
        $("#gamma").html("gamma : "+currentGamma);
        //$("#scalebeta").html("scaleBeta : "+nx.prune(scaleBeta,1));
        //$("#scalegamma").html("scaleGamma : "+nx.prune(scaleGamma,1));
        $("#left").html("left : "+nx.prune(left,1));
        $("#right").html("right : "+nx.prune(right,1));
        $("#speed").html("speed : "+speed);
        $("#virage").html("virage : "+virage);
        $("#initial").html("{ "+initialAlpha+" , "+initialBeta+" , "+initialGamma+" }");

        socket.emit('speed', {left: left,right: right});
    };
    
    var command = function(data) {
        console.log(currentGamma);
        if(data == 1) {
            if(initialBeta == undefined){
                initialGamma = currentGamma;
                initialBeta = currentBeta;
                initialAlpha = currentAlpha;
            }
        }
        else {
            initialGamma = undefined;
            initialBeta = undefined;
            initialAlpha = undefined;
        }
    };

    nx.colorize("fill","#3A4750");
    nx.colorize("border", "#303841");
    nx.colorize("accent", "#F3F3F3");

    //console.log(screen.orientation);
    // y = beta , x = gamma
    $(window).on("deviceorientation",function(event){
        getMove(event);
    });

    move.on('press', command);

    $('.spinner').hide();
});