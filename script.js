document.addEventListener('DOMContentLoaded', function() {
	var current = i(),
		layers = content(),
		topology = {
			torus: {
				horizontal: i(),
				vertical: i()
			},
			klein: {
				horizontal: vFlip(),
				vertical: hFlip()
			}
		}[layers[0][0].getAttribute('data-topology')];

	reset();
	window.addEventListener('resize', reset);
	window.addEventListener('scroll', update);

	function reset() {
		document.body.scrollLeft = document.body.clientWidth;
		document.body.scrollTop = document.body.clientHeight;
		update();
	}

	function update() {
		if (document.body.scrollLeft < document.body.clientWidth) {
			document.body.scrollLeft += document.body.clientWidth;
			current = current.x(topology.horizontal);
		}
		if (document.body.scrollLeft >= 2 * document.body.clientWidth) {
			document.body.scrollLeft -= document.body.clientWidth;
			current = current.x(topology.horizontal);
		}
		if (document.body.scrollTop < document.body.clientHeight) {
			document.body.scrollTop += document.body.clientHeight;
			current = current.x(topology.vertical);
		}
		if (document.body.scrollTop >= 2 * document.body.clientHeight) {
			document.body.scrollTop -= document.body.clientHeight;
			current = current.x(topology.vertical);
		}
		t(0, 0, prod(current));
		t(1, 0, prod(current, topology.horizontal));
		t(0, 1, prod(current, topology.vertical));
		t(1, 1, prod(current, topology.horizontal, topology.vertical));
	}

	function content() {
		var body = document.getElementsByTagName('body')[0],
			twice = body.innerHTML + body.innerHTML;
		body.innerHTML = twice + twice + '<div class="buffer"></div>';
		var layers = document.getElementsByClassName('main');
		return [ [ layers[0], layers[1] ],
		         [ layers[2], layers[3] ] ];
	}

	function i() {
		return Sylvester.Matrix.I();
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

	function prod() {
		if (arguments.length == 0)
			return i();
		var o = $M(arguments[0].elements);
		for (var n = 1; n < arguments.length; ++n)
			o = o.x(arguments[n]);
		return o;
	}

	function t(x, y, m) {
		layers[x][y].style.transform = 
			'translate(' + (x * 100 + 100) + 'vw, ' + (y * 100 + 100) + 'vh) ' +
			'matrix(' + m.elements.map(function(row) {
				return row[0] + ',' + row[1];
			}).join() + ')';
	}
});