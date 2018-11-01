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

var foregroundPalette = [
    "568A8C",
    "424A53"
];
var backgroundPalette = [
    "D4B295",
    "D7D5BF"
];

var canvas, ctx,
    color_bg = "#F3ECE2",
    color_main = "black",
    padding = 50,
    settings = {
        point1: {"x": 300, "y": 300},
        point2: {"x": 200, "y": 200},
        spacing: 0,
        currentStep: 0.95,
        sections: 120
    },
    center, bottomCenter, topCenter;

resizeCanvas = function () {
    //width = window.innerWidth;
    //height = window.innerHeight - grid.offsetTop;

    var minSide = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = (4 / 5) * minSide;
    canvas.height = (4 / 5) * minSide;

    center = {"x": canvas.width / 2, "y": canvas.height / 2};
    bottomCenter = {"x": canvas.width / 2, "y": canvas.height};
    topCenter = {"x": canvas.width / 2, "y": 0};

    settings.spacing = canvas.height / 32;
    // settings.currentStep = settings.spacing;
    settings.point1 = {
        "x": settings.currentStep * canvas.height / 2,
        "y": canvas.height / 2
    };
    settings.point2 = {
        "x": canvas.height - settings.point1.x,
        "y": canvas.height - settings.point1.y
    };

    /**
     * Your drawings need to be inside this function otherwise they will be reset when
     * you resize the browser window and the canvas goes will be cleared.
     */
    drawStuff();
};

hexToRGB = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

colorLerp = function (a, b, t) {
    var color1 = hexToRGB(a);
    var color2 = hexToRGB(b);

    return "rgb(" + ((color1.r * t) + (color2.r * 1 - t)) + "," + ((color1.g * t) + (color2.g * 1 - t)) + "," + ((color1.b * t) + (color2.b * 1 - t)) + ")";
};

lerp = function(a,b,t){
    return a*t + b*(1-t);
};

getRainbowColor = function (i, total) {
    var frequency = 0.3;

    //value = Math.sin(frequency*increment)*amplitude + center;

    red = Math.sin(frequency * i + 0) * 127 + 128;
    green = Math.sin(frequency * i + 2) * 127 + 128;
    blue = Math.sin(frequency * i + 4) * 127 + 128;
    return "rgba(" + red + "," + green + "," + blue + "," + 0.1 + ")";
};

drawStuff = function () {
    var point;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();


    // Move registration point to the center of the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // Rotate 1 degree
    // ctx.rotate(45*Math.PI / 180);
    // Move registration point back to the top left corner of canvas
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    var i;
    var angle = (2 * Math.PI) / settings.sections;
    var p1 = settings.point1;
    var p2 = settings.point2;

    ctx.moveTo(p1.x, p1.y);
    ctx.beginPath();

    for (i = 0; i < settings.sections; i += 2) {
        ctx.lineTo(center.x + (canvas.height / 2 - settings.spacing) * Math.cos(angle * i), center.y + (canvas.height / 2 - settings.spacing) * Math.sin(angle * i));
        ctx.lineTo(center.x + (canvas.height / 2 - settings.spacing) * Math.cos(angle * (i + 1)), center.y + (canvas.height / 2 - settings.spacing) * Math.sin(angle * (i + 1)));
        ctx.lineTo(p1.x, p1.y);
    }
    for (i = 0; i < settings.sections; i += 2) {
        ctx.lineTo(center.x + (canvas.height / 2 - settings.spacing) * Math.cos(angle * i), center.y + (canvas.height / 2 - settings.spacing) * Math.sin(angle * i));
        ctx.lineTo(center.x + (canvas.height / 2 - settings.spacing) * Math.cos(angle * (i + 1)), center.y + (canvas.height / 2 - settings.spacing) * Math.sin(angle * (i + 1)));
        ctx.lineTo(p2.x, p2.y);
    }
    ctx.closePath();
    // ctx.fillStyle = "black";
    // ctx.stroke();
    // ctx.fill('evenodd');
    // setTimeout(loop,0);

    ctx.clip("evenodd");
    fillWithColors(foregroundPalette[0],foregroundPalette[1],true);
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var backgroundLimit = 100000;

fillWithColors=function(color1, color2, variableSize){
    var r,x,y, proximity, maxDistance;
    var minR=1;
    var maxR = 10;
    maxDistance = Math.sqrt( (center.x)*(center.x) + (center.y)*(center.y) );
    for(var i =0;i<backgroundLimit;i++){
        r=getRandomInt(minR,maxR);
        x=getRandomInt(r,canvas.width-r);
        y=getRandomInt(r,canvas.height-r);
        if(variableSize){
            proximity = Math.sqrt( (center.x-x)*(center.x-x) + (center.y-y)*(center.y-y) );
            r = lerp(maxR*2,minR/2,proximity/(maxDistance));
        }
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle=colorLerp(color1, color2,Math.random());
        ctx.fill()
    }
}

drawBackground = function () {
    fillWithColors(backgroundPalette[0],backgroundPalette[1])
};

distance = function (point1, point2) {
    var a = point1.x - point2.x;
    var b = point1.y - point2.y;
    return Math.sqrt(a * a + b * b);
};

loop = function () {
    console.log("loop");
    settings.currentStep = (settings.currentStep + 0.01) % 1;
    resizeCanvas();
};

crop = function () {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // store the current globalCompositeOperation
    var compositeOperation = ctx.globalCompositeOperation;


    var tempCanvas = document.createElement("canvas"),
        tCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
// draw background/rectangle on entire canvas

    tCtx.beginPath();
    tCtx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
    tCtx.closePath();
    // tCtx.fillStyle = "#FFFFFF";
    tCtx.fillStyle = color_bg;
    tCtx.fill();
    tCtx.globalCompositeOperation = "source-in";
    tCtx.drawImage(canvas, 0, 0);

    // write on screen
    var img = tempCanvas.toDataURL("image/png");
    document.write('<a href="' + img + '"><img src="' + img + '"/></a>');
};

canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();
