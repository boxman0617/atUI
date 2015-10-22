(function() {
	var api = angular.module('atAPI');

	api.service('HttpBlockService', [
		function() {
			this.blocked = false;
		}
	]);

	api.service('APIUrlLocator', [
		function() {
			var env = 'DEV';
			var urls = {
				'DEV': '/services/gbp/'
			};

			this.getUrl = function(call) {
				return urls[env]+call;
			};
		}
	]);

	api.service('APIService', ['$http', 'HttpBlockService', 'APIUrlLocator',
		function($http, HttpBlockService, APIUrlLocator) {

			/**
			 * Returns the full URL depending on what {this.env} is set to
			 * @param  {STRING} call Suffix for API URL
			 * @return {STRING}      Full URL
			 */
			this.getApiURL = function(call) {
				return APIUrlLocator.getUrl(call);
			};

			this.get = function(url, config) {
				config = config || {};
				return $http.get(this.getApiURL(url), config);
			};

			this.post = function(url, data, headers) {
				headers = headers || {};
				return $http({
					'method': 'POST',
					'url': this.getApiURL(url),
					'headers': headers,
					'data': data
				});
			};

			this.put = function(url, data, headers) {
				headers = headers || {};
				return $http({
					'method': 'PUT',
					'url': this.getApiURL(url),
					'headers': headers,
					'data': data
				});
			};
			
			this.delete = function(url, config) {
				config = config || {};
				return $http.delete(this.getApiURL(url), config);
			};

			this.nonBlockedGet = function(url, config) {
				config = config || {};
				return $http.get(this.getApiURL(url), config);
			};

			this.blocking = function(url) {
				HttpBlockService.blocked = true;
				this.nonBlockedGet(url).success(function(res) {
					console.log(res);
					HttpBlockService.blocked = false;
				}).error(function(err, status) {
					console.log(err, status);
				});
			};

		}
	]);
})();
