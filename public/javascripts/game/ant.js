
var antgame = function (screen) {
    this.screen = $(screen);
    this.home = new anthome(screen);
    this.ant = new ant (screen);
    this.insects = new insects (screen);
    this.actions = [new action(this.ant)];
}

antgame.prototype = {
    constructor: antgame,
    start: function () {
        this.home.draw(this.screen.width() / 2, this.screen.height() / 2);
        this.ant.draw(this.screen.width() / 3, this.screen.height() / 3);
        this.insects.draw(10, 10);
        this.refresh(0);
    },

    refresh: function (step) {
        for (var i in this.actions)
            this.actions[i].render(step);
        var game = this;
        setTimeout(function () { game.refresh(step + 1); }, 200);
    }
}


var anthome = function (screen) {
    this.img = $("<img src='/javascripts/game/images/agt_home.png' style='display:none;'>")
        .addClass('anthome').appendTo(screen);
}

anthome.prototype = {
    constructor: anthome,
    draw: function (x, y) {
        this.img.show().css('left', x).css('top', y);
    }

}


var ant = function (screen) {
    this.x = 0;
    this.y = 0;
    this.img = $("<img src='/javascripts/game/images/ant.gif' style='display:none;'>")
        .addClass('anthome').appendTo(screen);
}

ant.prototype = {
    constructor: ant,
    draw: function (x, y) {
        this.x = x;
        this.y = y;
        this.img.show().css('left', x).css('top', y);
    }

}

var insects = function (screen) {
    this.img = $("<img src='/javascripts/game/images/insect_swarm.gif' style='display:none;'>")
        .addClass('anthome').appendTo(screen);
}

insects.prototype = {
    constructor: insects,
    draw: function (x, y) {
        this.img.show().css('left', x).css('top', y);
    }

}

var action = function (obj) {
    this.obj = obj;
    this.startX = 320;
    this.startY = 240;
    this.endX = 10;
    this.endY = 10;
    this.size = Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
    this.direction = true;
}

action.prototype = {
    constructor: action,
    render: function (step) {
        //document.title = step;
        if (this.direction) {
            var x = this.obj.x + 5 * (this.endX - this.startX) / this.size;
            var y = this.obj.x + 5 * (this.endY - this.startY) / this.size;
        } else {
            var x = this.obj.x - 5 * (this.endX - this.startX) / this.size;
            var y = this.obj.x - 5 * (this.endY - this.startY) / this.size;
        }
        if (x < this.endX) { //alert(1); 
            this.direction = false; }
        else if (x > this.startX) this.direction = true;
        //document.title = this.size;
        this.obj.draw(x, y);
    }
}


var route = function () { 

}

route.prototype = {
    constructor: route,
    join: function (ant) {

    },
    leave: function () { 
    
    }
}

