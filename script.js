document.addEventListener('DOMContentLoaded', function() {
	var els = document.getElementsByClassName('topological');
	for (var eli = 0; eli < els.length; ++eli) (function(el) {
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
				'h-klein': {
					horizontal: vFlip(),
					vertical: i()
				},
				'v-klein': {
					horizontal: i(),
					vertical: hFlip()
				},
				rp2: {
					horizontal: vFlip(),
					vertical: hFlip()
				}
			}[el.getAttribute('data-topology')],
			layers = content();

		reset();
		window.addEventListener('resize', reset);
		el.addEventListener('scroll', update);

		function reset() {
			if (topology.horizontal)
				el.scrollLeft = el.clientWidth;
			if (topology.vertical)
				el.scrollTop = el.clientHeight;
			update();
		}

		function update() {
			if (topology.horizontal) {
				if (el.scrollLeft < el.clientWidth) {
					el.scrollLeft += el.clientWidth;
					current = current.x(topology.horizontal);
				}
				if (el.scrollLeft >= 2 * el.clientWidth) {
					el.scrollLeft -= el.clientWidth;
					current = current.x(topology.horizontal);
				}
			}
			if (topology.vertical) {
				if (el.scrollTop < el.clientHeight) {
					el.scrollTop += el.clientHeight;
					current = current.x(topology.vertical);
				}
				if (el.scrollTop >= 2 * el.clientHeight) {
					el.scrollTop -= el.clientHeight;
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

		function t(x, y) {
			var matrix = current;
			for (var i = 2; i < arguments.length; ++i)
				if (arguments[i])
					matrix = matrix.x(arguments[i]);
				else {
					if (layers[x][y]) {
						el.removeChild(layers[x][y]);
						layers[x][y] = null;
					}
					return;
				}
			layers[x][y].style.transform = 
				'translate(' + 
					(topology.horizontal ? x * 100 + 100 : 0) + 'vw, ' +
					(topology.vertical ? y * 100 + 100 : 0) + 'vh) ' +
				'matrix(' + matrix.elements.map(function(row) {
					return row[0] + ',' + row[1];
				}).join() + ')';
		}
	})(els[eli]);

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
});