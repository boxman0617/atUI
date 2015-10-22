(function() {
	var app = angular.module('atUI');

	app.service('SyncService', [
		function() {
			var _queue = {};
			var _onComplete = {};

			this.addKey = function(key) {
				_queue[key] = [];
			};

			this.addTo = function(key, name) {
				_queue[key].push(name);
			};

			this.syncComplete = function(key, name) {
				var i = _queue[key].indexOf(name);
				_queue[key].splice(i, 1);
				if(_queue[key].length === 0) {
					_fireComplete(key);
				}
			};

			this.onComplete = function(key, cb) {
				_onComplete[key] = cb;
			};

			var _fireComplete = function(key) {
				_onComplete[key].apply(null, []);
			};
		}
	]);
})();