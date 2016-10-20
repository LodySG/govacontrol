$(function() {

    var initialY = undefined;
    var initialX = undefined;

    nx.colorize("fill","#3A4750");
    nx.colorize("border", "#303841");
    nx.colorize("accent", "#F3F3F3");

    mouvement.active = false;
    mouvement.text = "move";

    mouvement.on('*', function(data) {
        var y = data.y;
        //var speed = nx.scale(y,y-(0.100),y-(0.100),-255,255);
        var scale = initialY - y;
        var speed = nx.scale(scale,initialY-(0.100),initialY+(0.100),-255,255);

        $("#status").html("current x: "+data.x+" y: "+data.y);
        $("#initial").html("initial x: "+initialX+" y: "+initialY);
        $("#scale").html("scale : "+scale);
        $("#speed").html("speed: "+speed);
        //console.log(data);
    });
    rouegauche.on('*', function(data) {
        var res = data.value * 255;
        console.log(res);
    });
    rouedroite.on('*', function(data) {
        var res = data.value * 255;
        console.log(res);
    });
    command.on('press', function(data) {
        if(data == 1)
        {
            if(initialX == undefined){
                initialX = mouvement.val.x;
                initialY = mouvement.val.y;
            }
            mouvement.active = true;
        }
        else
        {
            mouvement.active = false;
            initialX = undefined;
            initialY = undefined;
        }
    });
});