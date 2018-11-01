function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

var canvas = {
    canvas:null,
    ctx:null,
    color_bg:"#F3ECE2", //"white"
    color_main:"black",
    padding:50,
    settings:{
        point1:{"x":300,"y":300},
        point2:{"x":200,"y":200},
        spacing:0,
        currentStep:0.95
    },
    resizeCanvas : function() {
        //canvas.width = window.innerWidth;s
        //canvas.height = window.innerHeight - grid.canvas.offsetTop;

        var minSide = Math.min(window.innerWidth,window.innerHeight);

        canvas.canvas.height = (4/5)*minSide;
        canvas.canvas.width = canvas.canvas.height*2;

        canvas.settings.spacing = canvas.canvas.height/16;
        canvas.settings.point1 = {
            "x":(1/5)*canvas.canvas.width,
            "y":(2/3)*canvas.canvas.height
        };
        canvas.settings.point2 = {
            "x":(3/4)*canvas.canvas.width,
            "y":(4/9)*canvas.canvas.height
        };

        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        canvas.drawStuff();
    },

    hexToRGB:function(hex){
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    lerp:function(a,b,t){
        var color1 = canvas.hexToRGB(a);
        var color2 = canvas.hexToRGB(b);

        return "rgb("+((color1.r*t)+(color2.r*1-t))+","+((color1.g*t)+(color2.g*1-t))+","+((color1.b*t)+(color2.b*1-t))+")";
    },

    getRainbowColor:function(i, total){
        var frequency = 0.3;

        //value = Math.sin(frequency*increment)*amplitude + center;

        red   = Math.sin(frequency*i + 0) * 127 + 128;
        green = Math.sin(frequency*i + 2) * 127 + 128;
        blue  = Math.sin(frequency*i + 4) * 127 + 128;
        return "rgba("+red+","+green+","+blue+","+0.1+")";
    },

    drawStuff: function() {
        var point;
        var center = {"x":canvas.canvas.width/2,"y":canvas.canvas.height/2};
        var bottomCenter = {"x":canvas.canvas.width/2,"y":canvas.canvas.height};
        var topCenter = {"x":canvas.canvas.width/2,"y":0};
        canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvas.ctx.clearRect(0,0,canvas.canvas.width,canvas.canvas.height);
        canvas.drawBackground();


        // Move registration point to the center of the canvas
        canvas.ctx.translate(canvas.canvas.width/2, canvas.canvas.height/2);
        // Rotate 1 degree
        // canvas.ctx.rotate(45*Math.PI / 180);
        // Move registration point back to the top left corner of canvas
        canvas.ctx.translate(-canvas.canvas.width/2, -canvas.canvas.height/2);

        var i;
        var p1 = canvas.settings.point1;
        var p2 = canvas.settings.point2;

        canvas.ctx.moveTo(p1.x,p1.y);
        canvas.ctx.beginPath();

        for(i=0;i<canvas.canvas.width;i+=2*canvas.settings.spacing) {
            canvas.ctx.lineTo(i,0);
            canvas.ctx.lineTo(i+canvas.settings.spacing,0);
            canvas.ctx.lineTo(p1.x,p1.y);

            canvas.ctx.lineTo(i+canvas.settings.spacing,canvas.canvas.height);
            canvas.ctx.lineTo(i+canvas.settings.spacing*2,canvas.canvas.height);
            canvas.ctx.lineTo(p1.x,p1.y);
        }
        for(i=0;i<canvas.canvas.height;i+=2*canvas.settings.spacing){
            canvas.ctx.lineTo(0,i+canvas.settings.spacing);
            canvas.ctx.lineTo(0,i+canvas.settings.spacing*2);
            canvas.ctx.lineTo(p1.x,p1.y);

            canvas.ctx.lineTo(canvas.canvas.width,i);
            canvas.ctx.lineTo(canvas.canvas.width,i+canvas.settings.spacing);
            canvas.ctx.lineTo(p1.x,p1.y);
        }
        
        for(i=0;i<canvas.canvas.width;i+=2*canvas.settings.spacing) {
            canvas.ctx.lineTo(i,0);
            canvas.ctx.lineTo(i+canvas.settings.spacing,0);
            canvas.ctx.lineTo(p2.x,p2.y);

            canvas.ctx.lineTo(i+canvas.settings.spacing,canvas.canvas.height);
            canvas.ctx.lineTo(i+canvas.settings.spacing*2,canvas.canvas.height);
            canvas.ctx.lineTo(p2.x,p2.y);
        }
        for(i=0;i<canvas.canvas.height;i+=2*canvas.settings.spacing){
            canvas.ctx.lineTo(0,i+canvas.settings.spacing);
            canvas.ctx.lineTo(0,i+canvas.settings.spacing*2);
            canvas.ctx.lineTo(p2.x,p2.y);

            canvas.ctx.lineTo(canvas.canvas.width,i);
            canvas.ctx.lineTo(canvas.canvas.width,i+canvas.settings.spacing);
            canvas.ctx.lineTo(p2.x,p2.y);
        }
        canvas.ctx.fillStyle="black";
        canvas.ctx.fill('evenodd');
        // setTimeout(canvas.loop,0);
    },

    drawBackground: function(){
        var i,j;

        if(true){
            canvas.ctx.fillStyle = canvas.color_bg;
            canvas.ctx.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            canvas.ctx.fillStyle = canvas.color_bg;
            canvas.ctx.fillStyle = "white";
            for(i=0;i<30000;i++){
                canvas.ctx.fillStyle = hexToRGB("#ffffff",getRandomInt(2,10)*0.1);
                canvas.ctx.fillRect(getRandomInt(canvas.padding,canvas.canvas.width-canvas.padding),getRandomInt(canvas.padding,canvas.canvas.height-canvas.padding),1,1);
            }
        }else{
            canvas.ctx.fillStyle = "white";
            canvas.ctx.fillRect(0,0,canvas.canvas.width,canvas.canvas.height);
            canvas.ctx.fillStyle = canvas.color_bg;
            canvas.ctx.fillRect(canvas.padding,canvas.padding,canvas.canvas.width-2*canvas.padding,canvas.canvas.height-2*canvas.padding);
            for(i=0;i<canvas.canvas.width - 2*canvas.padding;i++){
                for(j=0;j<canvas.canvas.width - 2*canvas.padding;j++){
                    canvas.ctx.fillStyle = hexToRGB("#ffffff",getRandomInt(2,10)*0.05);
                    canvas.ctx.fillRect(i+canvas.padding,j+canvas.padding,1,1);
                }
            }
        }
    },

    distance: function(point1, point2){
        var a = point1.x - point2.x;
        var b = point1.y - point2.y;
        return Math.sqrt( a*a + b*b );
    },

    loop : function(){
        console.log("loop");
        canvas.settings.currentStep = (canvas.settings.currentStep+0.01)%1;
        canvas.resizeCanvas();
    }
};

canvas.canvas = document.getElementById('canvas');
canvas.ctx = canvas.canvas.getContext('2d');
window.addEventListener('resize', canvas.resizeCanvas, false);
canvas.resizeCanvas();
