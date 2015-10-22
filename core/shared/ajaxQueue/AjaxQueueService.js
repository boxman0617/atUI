(function() {
	var app = angular.module('atUI');

	app.service('AjaxQueueService', ['APIService',
		function(APIService) {
			var queue = [];
			var ranQueue = false;
			var cache = {};
			var noCache = false;

			this.turnOffCaching = function() {
				noCache = true;
			};
			
			this.clearCache = function(forName) {
				cache[forName] = {};
			};
			
			this.clearSpecificCache = function(cacheObjName, call) {
				delete cache[cacheObjName][call];
			};

			this.register = function(name) {
				cache[name] = {};
			};

			this.addToQueue = function(call, cacheObjName, cb) {
				queue.push({
					'call': call,
					'cacheObj': cache[cacheObjName],
					'cb': cb
				});
				runQueue();
			};

			var runQueue = function() {
				if(!ranQueue) {
					ranQueue = true;
					runNext();
				}
			};

			var runNext = function() {
				if(queue.length > 0) {
					var next = queue.shift();
					if(!noCache && next.cacheObj.hasOwnProperty(next.call)) {
						next.cb.apply(null, [next.cacheObj[next.call]]);
						runNext();
					} else {
						APIService.get(next.call, {'cache': true})
							.success(function(data) {
								next.cacheObj[next.call] = data;
								next.cb.apply(null, [next.cacheObj[next.call]]);
								runNext();
							});
					}
				} else {
					ranQueue = false;
				}
			};
		}
	])
})();