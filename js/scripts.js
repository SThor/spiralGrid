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


var canvas, ctx,
    color_bg = "#F3ECE2",
    color_main = "black",
    padding = 50,
    settings = {
        point1: {"x": 300, "y": 300},
        point2: {"x": 200, "y": 200},
        spacing: 0,
        currentStep: 0.05,
        sections: 200
    },
    center, bottomCenter, topCenter;

resizeCanvas = function () {
    //width = window.innerWidth;
    //height = window.innerHeight - grid.offsetTop;

    var minSide = Math.min(window.innerWidth, window.innerHeight);

    canvas.width = (4 / 5) * minSide;
    canvas.height = (4 / 5) * minSide;

    settings.spacing = canvas.height / 32;
    settings.point1 = {
        "x": settings.currentStep * canvas.height / 2,
        "y": settings.currentStep * canvas.height / 2
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

lerp = function (a, b, t) {
    var color1 = hexToRGB(a);
    var color2 = hexToRGB(b);

    return "rgb(" + ((color1.r * t) + (color2.r * 1 - t)) + "," + ((color1.g * t) + (color2.g * 1 - t)) + "," + ((color1.b * t) + (color2.b * 1 - t)) + ")";
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
    center = {"x": canvas.width / 2, "y": canvas.height / 2};
    bottomCenter = {"x": canvas.width / 2, "y": canvas.height};
    topCenter = {"x": canvas.width / 2, "y": 0};
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

    // for (i = 0; i < canvas.width; i += 2 * settings.spacing) {
    //     ctx.lineTo(i, 0);
    //     ctx.lineTo(i + settings.spacing, 0);
    //     ctx.lineTo(p1.x, p1.y);
    //
    //     ctx.lineTo(i + settings.spacing, canvas.height);
    //     ctx.lineTo(i + settings.spacing * 2, canvas.height);
    //     ctx.lineTo(p1.x, p1.y);
    //
    //     ctx.lineTo(0, i + settings.spacing);
    //     ctx.lineTo(0, i + settings.spacing * 2);
    //     ctx.lineTo(p1.x, p1.y);
    //
    //     ctx.lineTo(canvas.height, i);
    //     ctx.lineTo(canvas.height, i + settings.spacing);
    //     ctx.lineTo(p1.x, p1.y);
    // }

    // for (i = 0; i < canvas.width; i += 2 * settings.spacing) {
    //     ctx.lineTo(i, 0);
    //     ctx.lineTo(i + settings.spacing, 0);
    //     ctx.lineTo(p2.x, p2.y);
    //
    //     ctx.lineTo(i + settings.spacing, canvas.height);
    //     ctx.lineTo(i + settings.spacing * 2, canvas.height);
    //     ctx.lineTo(p2.x, p2.y);
    //
    //     ctx.lineTo(0, i + settings.spacing);
    //     ctx.lineTo(0, i + settings.spacing * 2);
    //     ctx.lineTo(p2.x, p2.y);
    //
    //     ctx.lineTo(canvas.height, i);
    //     ctx.lineTo(canvas.height, i + settings.spacing);
    //     ctx.lineTo(p2.x, p2.y);
    // }
    ctx.fillStyle = "black";
    // ctx.stroke();
    ctx.fill('evenodd');
    // setTimeout(loop,0);
};

drawBackground = function () {
    var i, j;

    if (true) {
        ctx.fillStyle = color_bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color_bg;
        ctx.fillStyle = "white";
        for (i = 0; i < 30000; i++) {
            ctx.fillStyle = hexToRGB("#ffffff", getRandomInt(2, 10) * 0.1);
            ctx.fillRect(getRandomInt(padding, canvas.width - padding), getRandomInt(padding, canvas.height - padding), 1, 1);
        }
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color_bg;
        ctx.fillRect(padding, padding, canvas.width - 2 * padding, canvas.height - 2 * padding);
        for (i = 0; i < canvas.width - 2 * padding; i++) {
            for (j = 0; j < canvas.width - 2 * padding; j++) {
                ctx.fillStyle = hexToRGB("#ffffff", getRandomInt(2, 10) * 0.05);
                ctx.fillRect(i + padding, j + padding, 1, 1);
            }
        }
    }
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
