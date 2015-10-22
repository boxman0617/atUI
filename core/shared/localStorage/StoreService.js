(function() {
	var app = angular.module('atUI');

	app.service('StoreService', ['$log', '$location', '$window',
		function($log, $location, $window) {
			var _canUse = simpleStorage.canUse();

			this.leftOffHere = function(name, cb) {
				cb = cb || null;
				if(_canUse) {
					simpleStorage.set('leftOff', {'name': name, 'location': $location.url()});
					if(cb !== null) {
						cb.apply(null, []);
					}
				}
			};

			this.getWhereWeLeftOff = function() {
				var _port = $location.port();
				if(_port !== '80') {
					return $location.protocol() + '://' + $window.location.hostname + ':' + _port + $window.location.pathname + '#' + simpleStorage.get('leftOff').location;
				}
				return $location.protocol() + '://' + $window.location.hostname + $window.location.pathname + '#' + simpleStorage.get('leftOff').location;
			};

			this.getRawLeftOff = function() {
				return simpleStorage.get('leftOff');
			};
		}
	]);
})();