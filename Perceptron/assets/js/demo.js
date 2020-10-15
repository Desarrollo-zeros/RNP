
Circles.create({
	id:           'task-complete',
	radius:       75,
	value:        80,
	maxValue:     100,
	width:        8,
	text:         function(value){return value + '%';},
	colors:       ['#eee', '#1D62F0'],
	duration:     400,
	wrpClass:     'circles-wrp',
	textClass:    'circles-text',
	styleWrapper: true,
	styleText:    true
})





