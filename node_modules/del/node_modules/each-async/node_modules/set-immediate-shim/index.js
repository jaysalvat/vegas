'use strict';
module.exports = typeof setImmediate === 'function' ? setImmediate :
	function setImmediate(fn) { setTimeout(fn, 0); };
