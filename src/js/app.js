'use strict';

var DAT = require('dat-gui');
// var gui = new DAT.GUI();

// Declare global variables
var canvas, ctx, timeout,
	speedInput = document.getElementById('speedInput'),
	dotsInput = document.getElementById('dotsInput'),
	factorInput = document.getElementById('factorInput'),
	moduloInput = document.getElementById('moduloInput'),
	speedText = document.getElementById('speedText'),
	dotsText = document.getElementById('dotsText'),
	factorText = document.getElementById('factorText'),
	moduloText = document.getElementById('moduloText'),
	btn = document.getElementById('btn'),
	dots = [],
	lines = [],
	timer,
	isPlaying = true,
	viewWidth = window.innerWidth,
	viewHeight = window.innerHeight,
	radius = viewWidth > viewHeight ? viewHeight/3 : viewWidth/3,
	center = { x: viewWidth/2, y: viewHeight/2 };

// Install paper.js
paper.install(window);


// Some parameters
var params = {
	speed: 100,
	dots: 100,
	factor: 200,
	modulo: 10.55555
};


// We're ready!!!
window.addEventListener('load', function() {

	setup();

	view.onFrame = function(e) {
		if (!isPlaying) return;
		params.modulo += e.delta*(params.speed/1000000);
		moduloInput.value = moduloText.innerHTML = Math.round(params.modulo*10000)/10000;
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

	btn.addEventListener('click', function() {
		this.classList.toggle('is-paused');
		isPlaying = !isPlaying;
	});

	speedInput.value = speedText.innerHTML = params.speed;
	dotsInput.value = dotsText.innerHTML = params.dots;
	factorInput.value = factorText.innerHTML = params.factor;
	moduloInput.value = moduloText.innerHTML = params.modulo;

	speedInput.addEventListener('input', function() {
		params.speed = speedText.innerHTML = parseInt(this.value);
		if (!isPlaying) makeDots();
	});

	dotsInput.addEventListener('input', function() {
		params.dots = dotsText.innerHTML = parseInt(this.value);
		if (!isPlaying) makeDots();
	});

	factorInput.addEventListener('input', function() {
		params.factor = factorText.innerHTML = parseInt(this.value);
		if (!isPlaying) makeDots();
	});

	moduloInput.addEventListener('input', function() {
		params.modulo = moduloText.innerHTML = parseInt(this.value);
		if (!isPlaying) makeDots();
	});

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
	// var dot, point;

	// if (dots.length) {
	// 	for (var i = 0; i < dots.length; i++) dots[i].remove();
	// }

	// for (var i = 0; i < params.dots; i++) {
	// 	var point = Math.circPos((-360/params.dots*i)-90);
	// 	dot = new Path.Circle(new Point(point.x, point.y), 1);
	// 	dot.fillColor = 'black';
	// 	dot.opacity = 0.3;
	// 	dots.push(dot);
	// }

	makeLines();
}

function makeLines() {
	var line, result, from, to, point1, point2;

	if (lines.length) {
		for (var i = 0; i < lines.length; i++) lines[i].remove();
	}

	if (dots.length) {
		for (var i = 0; i < dots.length; i++) dots[i].remove();
	}

	for (var i = 0; i < params.dots; i++) {
		result = params.factor * i;

		var dir = i % 2 ? -360 : 360;

		var p1 = Math.circPos((dir/params.modulo*i)-90);
		var p2 = Math.circPos((dir/params.modulo*result)-90);

		p1.x = p1.x > (viewWidth/2 + 100) ? viewWidth/2 + 100 : p1.x;
		p1.x = p1.x < (viewWidth/2 - 100) ? viewWidth/2 - 100 : p1.x;

		p1.y = p1.y > (viewHeight/2 + 200) ? viewHeight/2 + 200 : p1.y;
		p1.y = p1.y < (viewHeight/2 - 200) ? viewHeight/2 - 200 : p1.y;

		// p2.x = p2.x > (viewWidth/2 + 100) ? viewWidth/2 + 100 : p2.x;
		// p2.x = p2.x < (viewWidth/2 - 100) ? viewWidth/2 - 100 : p2.x;

		// p2.x = p2.x === p1.x && p2.x > (viewWidth/2 - 100) ? viewWidth/2 - 100 : p2.x;
		// p2.x = p2.x === p1.x && p2.x < (viewWidth/2 + 100) ? viewWidth/2 + 100 : p2.x;

		// p2.y = p2.y > (viewHeight/2 + 220) ? viewHeight/2 + 220 : p2.y;
		// p2.y = p2.y < (viewHeight/2 - 220) ? viewHeight/2 - 220 : p2.y;

		// p2.y = p2.y === p1.y && p2.y > (viewHeight/2 + 220) ? viewHeight/2 - 220 : p2.y;
		// p2.y = p2.y === p1.y && p2.y < (viewHeight/2 - 220) ? viewHeight/2 + 220 : p2.y;

		from = new Point(p1.x, p1.y);
		to = new Point(p2.x, p2.y);
		point1 = new Path.Circle(from, 1);
		point2 = new Path.Circle(to, 1);
		// point1.strokeColor = point2.strokeColor = '#fff';
		// point1.strokeWidth = point2.strokeWidth = 1.5;
		point1.fillColor = point2.fillColor = '#222';
		point1.opacity = point2.opacity = 0.5;
		point1.bringToFront();
		point2.bringToFront();
		line = new Path.Line(from, to);
		line.strokeColor = '#222';
		line.opacity = 0.2;
		line.sendToBack();

		dots.push(point1);
		dots.push(point2);
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
