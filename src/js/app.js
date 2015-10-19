'use strict';

var DAT = require('dat-gui');
// var gui = new DAT.GUI();

// Declare global variables
var canvas, ctx, timeout,
	dotsEl = document.getElementById('paramDots'),
	factorEl = document.getElementById('paramFactor'),
	moduloEl = document.getElementById('paramModulo'),
	dots = [],
	lines = [],
	viewWidth = window.innerWidth,
	viewHeight = window.innerHeight,
	radius = viewWidth > viewHeight ? viewHeight/3 : viewWidth/3,
	center = { x: viewWidth/2, y: viewHeight/2 };

// Install paper.js
paper.install(window);


// Some parameters
var params = {
	dots: 100,
	factor: 200,
	modulo: 10
};


// We're ready!!!
window.addEventListener('load', function() {

	setup();

	view.onFrame = function(e) {
		params.modulo += e.delta/1000;
		dotsEl.innerHTML = params.dots;
		factorEl.innerHTML = params.factor;
		moduloEl.innerHTML = Math.round(params.modulo*100000)/100000;
		makeDots();
	};
});


// Setup function
function setup() {
	canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	ctx = canvas.getContext('2d');
	canvas.width = viewWidth;
	canvas.height = viewHeight;
	document.body.appendChild(canvas);

	paper.setup('canvas');
}

function setSize() {
	canvas.width = viewWidth = window.innerWidth;
	canvas.height = viewHeight = window.innerHeight;
	radius = viewWidth > viewHeight ? viewHeight/3 : viewWidth/3,
	center = { x: viewWidth/2, y: viewHeight/2 };
	view.viewSize = new Size(viewWidth, viewHeight);
}
window.addEventListener('resize', setSize);

function makeDots() {
	var dot, point;

	if (dots.length) {
		for (var i = 0; i < dots.length; i++) dots[i].remove();
	}

	for (var i = 0; i < params.modulo; i++) {
		var point = Math.circPos((-360/params.modulo*i)-90);
		dot = new Path.Circle(new Point(point.x, point.y), 1);
		dot.fillColor = 'black';
		dot.opacity = 0.3;
		dots.push(dot);
	}

	makeLines();
}

function makeLines() {
	var line, result, from, to;

	if (lines.length) {
		for (var i = 0; i < lines.length; i++) lines[i].remove();
	}

	for (var i = 0; i < params.dots; i++) {
		result = params.factor * i;

		var p1 = Math.circPos((-360/params.modulo*i)-90);
		var p2 = Math.circPos((-360/params.modulo*result)-90);

		from = new Point(p1.x, p1.y);
		to = new Point(p2.x, p2.y);
		line = new Path.Line(from, to);
		line.strokeColor = '#555';
		line.opacity = 0.5;

		lines.push(line);
	}
}


Math.circPos = function(angle) {
	angle = Math.radians(angle);
	return {
		x: center.x + radius * Math.cos(angle),
		y: center.y + radius * Math.sin(angle)
	};
}


// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
