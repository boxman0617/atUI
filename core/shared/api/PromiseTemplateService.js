(function() {
	var api = angular.module('atAPI');

	api.service('PromiseTemplateService', [
		function() {

			this.get = function() {
				return {
					'_promise': null,
					'_successCb': null,
					'_errorCb': null,
					'_argsConst': '2147483647',
					'_messages': {
						'RejectedRequestException': 'The action you have attempted has been rejected by the system.',
						'Denied': 'You are not authorized to complete this action.'
					},
					'_init': null,
					'_errorMessage': function(proxy) {
						if(this._messages.hasOwnProperty(proxy.throwables[0].message)) {
							return this._messages[proxy.throwables[0].message];
						}

						return 'An unknown exception has occured!';
					},

					'success': function(cb) {
						this._successCb = cb;
						return this;
					},
					'error': function(cb) {
						this._errorCb = cb;
						return this;
					}
				};
			};
		}
	]);
})();