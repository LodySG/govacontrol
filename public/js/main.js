$(function() {
    nx.colorize(nx.randomColor());
    vitesse.mode = "relative";
    vitesse.on('*', function(data) {
        var speed = nx.scale(data.value, 0, 1, -255, 255);
        console.log(speed);
    });
    camembert.on('*', function(data) {
        console.log(data);
    });
    kb.on('*', function(data) {
        console.log(data);
    });
    porte.on('*', function(data) {
        console.log(data);
    });
    position.on('*', function(data) {
        if (porte.val.value == 1) {
            vitesse.set({ value: data.y });
            camembert.set({ value: data.x });
        }
    });
    button.on('press', function(data) {
        console.log(data);
    });
});