document.addEventListener('DOMContentLoaded', function() {
	var current = i(),
		topology = {
			square: {
				horizontal: null,
				vertical: null
			},
			'h-cylinder': {
				horizontal: i(),
				vertical: null
			},
			'v-cylinder': {
				horizontal: null,
				vertical: i()
			},
			'h-mobius': {
				horizontal: vFlip(),
				vertical: null
			},
			'v-mobius': {
				horizontal: null,
				vertical: hFlip()
			},
			torus: {
				horizontal: i(),
				vertical: i()
			},
			klein: {
				horizontal: vFlip(),
				vertical: hFlip()
			}
		}[document.body.getAttribute('data-topology')],
		layers = content();

	reset();
	window.addEventListener('resize', reset);
	window.addEventListener('scroll', update);

	function reset() {
		if (topology.horizontal)
			document.body.scrollLeft = document.body.clientWidth;
		if (topology.vertical)
			document.body.scrollTop = document.body.clientHeight;
		update();
	}

	function update() {
		if (topology.horizontal) {
			if (document.body.scrollLeft < document.body.clientWidth) {
				document.body.scrollLeft += document.body.clientWidth;
				current = current.x(topology.horizontal);
			}
			if (document.body.scrollLeft >= 2 * document.body.clientWidth) {
				document.body.scrollLeft -= document.body.clientWidth;
				current = current.x(topology.horizontal);
			}
		}
		if (topology.vertical) {
			if (document.body.scrollTop < document.body.clientHeight) {
				document.body.scrollTop += document.body.clientHeight;
				current = current.x(topology.vertical);
			}
			if (document.body.scrollTop >= 2 * document.body.clientHeight) {
				document.body.scrollTop -= document.body.clientHeight;
				current = current.x(topology.vertical);
			}
		}
		t(0, 0);
		t(1, 0, topology.horizontal);
		t(0, 1, topology.vertical);
		t(1, 1, topology.horizontal, topology.vertical);
	}

	function content() {
		var buffer = document.getElementById('buffer'),
			layers = document.getElementsByClassName('main');
		if (topology.horizontal)
			buffer.style.left = '300vw';
		if (topology.vertical)
			buffer.style.top = '300vh';
		return [ [ layers[0], layers[1] ],
		         [ layers[2], layers[3] ] ];
	}

	function i() {
		return Sylvester.Matrix.I(3);
	}
	function hFlip() {
		return $M([ [ -1,  0,  0 ],
		            [  0,  1,  0 ],
		            [  0,  0,  0 ] ]);
	}
	function vFlip() {
		return $M([ [  1,  0,  0 ],
		            [  0, -1,  0 ],
		            [  0,  0,  0 ] ]);
	}

	function t(x, y) {
		var matrix = current;
		for (var i = 2; i < arguments.length; ++i)
			if (arguments[i])
				matrix = matrix.x(arguments[i]);
			else return;
		layers[x][y].style.transform = 
			'translate(' + 
				(topology.horizontal ? x * 100 + 100 : 0) + 'vw, ' +
				(topology.vertical ? y * 100 + 100 : 0) + 'vh) ' +
			'matrix(' + matrix.elements.map(function(row) {
				return row[0] + ',' + row[1];
			}).join() + ')';
	}
});