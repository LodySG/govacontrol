$(function() {
    nx.colorize(nx.randomColor());

    tilt.active = false;

    tilt.on('*', function(data) {
        $("#status").html("x: "+data.x+" y: "+data.y);
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
    send_command.on('press', function(data) {
        if(data == 1)
        {
            tilt.set({x: 0, y: 0, z: 0});
            tilt.active = true;
        }
        else
            tilt.active = false;
    });
});