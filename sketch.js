var cx1, cy1, cx2, cy2, cx3, cy3, cx4, cy4, cx5, cy5, cx6, cy6, cx7, cy7;
var cwidth = 1280;
var tickDistance = 360 / 144;
var longTick = 20;
var shortTick = 10;
var R = 640/(1+Math.sin(Math.PI/12));
var r = 640 - R - longTick;
var innerR = 8;
var innerMargin = 4;
var cheight = R + 2*r;
var clockCenters = new Array();
var innerCenters = new Array();
var useMinPerHour = new Array();

function quadraticCurve(x1, y1, x2, y2, x3, y3, lineWidth, r, g, b, a) {
	var canvas = document.getElementById('defaultCanvas0');
	var context = canvas.getContext('2d');

	context.beginPath();
	context.moveTo(x1, y1);
	context.quadraticCurveTo(x2, y2, x3, y3);
	context.lineWidth = lineWidth;

	context.strokeStyle = "rgba("+r+", "+g+", "+b+", "+a+")";
	context.stroke();
}

function scaleColor(minValue, maxValue, value){
	let startR = 190, startG = 190, startB = 190;
	let endR = 242, endG = 102, endB = 102;

	let resultR = startR + (endR - startR) * (value - minValue)/(maxValue - minValue);
	let resultG = startG + (endG - startG) * (value - minValue)/(maxValue - minValue);
	let resultB = startB + (endB - startB) * (value - minValue)/(maxValue - minValue);

	return [resultR, resultG, resultB];
}

function drawClockFace(tmpCx, tmpCy){
	//draw ticks
	for (var i = 0; i < 144; i++) {
		var radius = radians(i * tickDistance) - HALF_PI - radians(tickDistance * 12);
		if (i < 24) { //hour ticks
			noFill();
			stroke(255, 131, 21);
			strokeWeight(2);
			if ((i + 1) % 4 == 0) {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + longTick), tmpCy + sin(radius) * (r + longTick));
			} else {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + shortTick), tmpCy + sin(radius) * (r + shortTick));
			}
		} else if (i >= 24 && i < 84) {//minutes
			noFill();
			stroke(122, 198, 248);
			strokeWeight(2);
			if ((i + 1) % 5 == 0) {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + longTick), tmpCy + sin(radius) * (r + longTick));
			} else {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + shortTick), tmpCy + sin(radius) * (r + shortTick));
			}
		} else {//seconds
			noFill();
			stroke(200, 200, 200);
			strokeWeight(2);
			if ((i + 1) % 5 == 0) {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + longTick), tmpCy + sin(radius) * (r + longTick));
			} else {
				line(tmpCx, tmpCy, tmpCx + cos(radius) * (r + shortTick), tmpCy + sin(radius) * (r + shortTick));
			}
		}
	}
	noStroke();
	fill(255);
	ellipse(tmpCx, tmpCy, 2 * r);
}

function drawHMCurves(tmpCx, tmpCy, m, h, occupy){
	fill(0);
	stroke(0);
	strokeWeight(5);

	var m = radians(m * tickDistance) - HALF_PI + radians(tickDistance * 12);
	var h = radians((h - 1) * tickDistance) - HALF_PI - radians(tickDistance * 12);

	let colorR = 0, colorG = 0, colorB = 0, colorA = 0;
	if(occupy == 0){
		colorR = colorG = colorB = 230; colorA = 0.1;
	}else{
		colorR = 242;
		colorG = 102;
		colorB = 102; 
		colorA = 0.3;
	}

	quadraticCurve(cos(m) * r + tmpCx, sin(m) * r + tmpCy, tmpCx, tmpCy, cos(h) * r + tmpCx, sin(h) * r + tmpCy, 2, colorR, colorG, colorB, colorA);
}

function drawHMSCurves(tmpCx, tmpCy, s, m, h, occupy){
	fill(0);
	stroke(0);
	strokeWeight(5);

	var s = radians(s * tickDistance) + HALF_PI;
	var m = radians(m * tickDistance) - HALF_PI + radians(tickDistance * 12);
	var h = radians((h - 1) * tickDistance) - HALF_PI - radians(tickDistance * 12);

	let colorR = 0, colorG = 0, colorB = 0, colorA = 0;
	if(occupy == 0){
		colorR = colorG = colorB = 0; colorA = 0.3;
	}else{
		colorR = 242;
		colorG = 102;
		colorB = 102; 
		colorA = 0.6;
	}

	quadraticCurve(cos(m) * r + tmpCx, sin(m) * r + tmpCy, tmpCx, tmpCy, cos(s) * r + tmpCx, sin(s) * r + tmpCy, 2, colorR, colorG, colorB, colorA);
	quadraticCurve(cos(m) * r + tmpCx, sin(m) * r + tmpCy, tmpCx, tmpCy, cos(h) * r + tmpCx, sin(h) * r + tmpCy, 2, colorR, colorG, colorB, colorA);
}

function drawHCurves(x1, y1, x2, y2, x3, y3, minv, maxv, v){
	let tmpCX = (x2+x3)/2;
	let tmpCY = (y2+y3)/2;
	let rgbcolor = scaleColor(minv, maxv, v);
	quadraticCurve(x1, y1, tmpCX, tmpCY, x3, y3, 1, rgbcolor[0], rgbcolor[1], rgbcolor[2], 0.5);
}

function preload() {
  var url = "data/randData.json";
  randData = loadJSON(url);
}

function setup() {
	createCanvas(cwidth, cheight);
	var canvas = document.getElementById("defaultCanvas0");
	canvas.style.width = cwidth+"px";
	canvas.style.height = cheight+"px";

	//save clock centers
	cx1 = r + longTick;
	cy1 = height - (r + longTick);
	clockCenters.push([cx1,cy1]);
	cx2 = r+longTick+2*(r+longTick)*Math.sin(Math.PI/12);
	cy2 = height - (r + longTick + 2*(r+longTick)*Math.cos(Math.PI/12));
	clockCenters.push([cx2,cy2]);
	cx3 = width/2 - 2*(r+longTick)*Math.cos(Math.PI/12);
	cy3 = height - (r+longTick+2*(r+longTick)*Math.cos(Math.PI/12)*Math.sqrt(3));
	clockCenters.push([cx3,cy3]);
	cx4 = width/2;
	cy4 = r + longTick;
	clockCenters.push([cx4,cy4]);
	cx5 = width/2 + 2*(r+longTick)*Math.cos(Math.PI/12);
	cy5 = cy3;
	clockCenters.push([cx5,cy5]);
	cx6 = width - (r+longTick+2*(r+longTick)*Math.sin(Math.PI/12));
	cy6 = cy2;
	clockCenters.push([cx6,cy6]);
	cx7 = width - r - longTick;
	cy7 = cy1;
	clockCenters.push([cx7,cy7]);

	//save inner centers 
	innerCenters.push([width/2-6*innerR-3*innerMargin, height-r-longTick]);
	innerCenters.push([width/2-4*innerR-2*innerMargin, height-r-longTick]);
	innerCenters.push([width/2-2*innerR-1*innerMargin, height-r-longTick]);
	innerCenters.push([width/2, height-r-longTick]);
	innerCenters.push([width/2+2*innerR+1*innerMargin, height-r-longTick]);
	innerCenters.push([width/2+4*innerR+2*innerMargin, height-r-longTick]);
	innerCenters.push([width/2+6*innerR+3*innerMargin, height-r-longTick]);

	//generate hash data
	hashData = new Array();
	for(let i = 0, len1 =  randData.data.length; i < len1; i++){
		let tmpRecorder = 0;
		hashData[i] = new Array();
		useMinPerHour[i] = new Array(24);
		for(let j = 0; j < 24; j++){
			useMinPerHour[i][j] = 0;
		}

		let occupied = false;
		for(let j = 0, len2 = 24*60; j < len2; j++){
			if(j == randData.data[i].occupations[tmpRecorder].startTime){
				occupied = true;
			}else if(j == randData.data[i].occupations[tmpRecorder].endTime){
				occupied = false;
				if(tmpRecorder < randData.data[i].occupations.length-1){
					tmpRecorder++;
				}
			}
			if(occupied){
				hashData[i][j] = 1;
				useMinPerHour[i][j/60]++;
			}else{
				hashData[i][j] = 0;
			}
		}
	}
}

function draw() {
	var date = new Date(); 
	var day = date.getDay();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	background(255);

	//draw clockFaces
  	for(let i = 0; i < 7; i++){
  		drawClockFace(clockCenters[i][0],clockCenters[i][1]);
  	}

	//find max and min values in useMinPerHour
	let minV = 1000000, maxV = 0;
	for(let i = 0; i < useMinPerHour.length; i++){
		for(let j = 0; j < useMinPerHour[i].length; j++){
			if(maxV < useMinPerHour[i][j]){
				maxV = useMinPerHour[i][j];
			}
			if(minV > useMinPerHour[i][j]){
				minV = useMinPerHour[i][j];
			}
		}
	}
	//draw day-hour curves
	for(let i = 0; i < day+1; i++){
		let nextClockCen;
		if(i < 3){
			nextClockCen = clockCenters[i+1];
		}else if (i == 3){
			nextClockCen = clockCenters[i];
		}else{
			nextClockCen = clockCenters[i-1];
		}
		let currentClockCen = clockCenters[i];
		let currentInnerCen = innerCenters[i];
		if(i < day){
			for(let j = 0; j < 24; j++){
				let radius = radians(j * tickDistance) - HALF_PI - radians(tickDistance * 12);
				let tmpX1 = currentClockCen[0] + cos(radius) * r;
				let tmpY1 = currentClockCen[1] + sin(radius) * r;
				drawHCurves(tmpX1, tmpY1, nextClockCen[0], nextClockCen[1], currentInnerCen[0], currentInnerCen[1], minV, maxV, useMinPerHour[i][j]);
			}
		}else{
			for(let j = 0; j < hour; j++){
				let radius = radians(j * tickDistance) - HALF_PI - radians(tickDistance * 12);
				let tmpX1 = currentClockCen[0] + cos(radius) * r;
				let tmpY1 = currentClockCen[1] + sin(radius) * r;
				drawHCurves(tmpX1, tmpY1, nextClockCen[0], nextClockCen[1], currentInnerCen[0], currentInnerCen[1], minV, maxV, useMinPerHour[i][j]);
			}
		}
	}
	

	//draw center
	for(let i = 0; i < 7; i++){
		fill(150, 150, 150);
		noStroke();
	  	ellipse(innerCenters[i][0], innerCenters[i][1], 2*innerR, 2*innerR);
	  	fill(100);
		textSize(14);
		
		switch(i){
			case 0:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Sun.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 1:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Mon.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 2:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Tue.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 3:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Wed.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 4:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Thu.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 5:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Fri.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
			case 6:
				translate(innerCenters[i][0], innerCenters[i][1]);
				rotate(PI/2);
				text("Sat.", 10, 5);
				rotate(3*PI/2);
				translate(-innerCenters[i][0], -innerCenters[i][1]);
				break;
		}
	}

	//draw previous days
	for(let i = 0; i < day; i++){
		for(let j = 0; j < hashData[i].length; j++){
			let h = j/60;
			let m = j%60;
			let occupy = hashData[i][j];
			drawHMCurves(clockCenters[i][0], clockCenters[i][1], m, h, occupy)
		}
	}
	//draw today
	let currentMin = minute + hour*60;
	for(let j = 0; j < currentMin; j++){
		let h = j/60;
		let m = j%60;
		let occupy = hashData[day][j];
		drawHMCurves(clockCenters[day][0], clockCenters[day][1], m, h, occupy)
		// drawHMSCurves(clockCenters[day][0], clockCenters[day][1], second, m, h, occupy)
	}
	drawHMSCurves(clockCenters[day][0], clockCenters[day][1], second, minute, hour, hashData[day][currentMin])
}
