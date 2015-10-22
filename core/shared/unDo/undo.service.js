(function() {
	angular.module('atUI').service('UndoService', ['$timeout', 
		function($timeout) {
			var _lastAction = null;
			var _actionContext = null;
			var _showing = false;
			var _promise = null;
			var _events = {
				'show': [],
				'hide': []
			};
			var service = this;
			var _runEvents = function(event, message) {
				message = message || null;
				for(var i in _events[event]) {
					_events[event][i].apply(null, [message]);
				}
			};

			this.on = function(action, cb) {
				_events[action].push(cb);
			};


			var trigger = {
				'_service': service,

				'_undoAction': null,
				'_undoContext': null,
				'_dismissAction': null,
				'_params': [],

				'onUndo': function(action) {
					this._undoAction = action;
					return this;
				},
				'contextIs': function(context) {
					this._undoContext = context;
					return this;
				},
				'onDismiss': function(cb) {
					this._dismissAction = cb;
					return this;
				},
				'passTheseParamsOnUndo': function(params) {
					this._params = params;
					return this;
				}	
			};

			this.triggerMessage = function(message) {
				message = message || null;
				_runEvents('show', message);
				this.clearLastAction();

				_promise = $timeout(function() {
					_runEvents('hide');
					
					if(trigger._dismissAction !== null) {
						trigger._dismissAction.apply(trigger._undoContext, trigger._params);
					}
				}, 10000);

				return trigger;
			};

			// this.triggerMessage = function(action, context, message, cb) {
			// 	cb = cb || null;
			// 	message = message || null;
			// 	_lastAction = action;
			// 	_actionContext = context;
			// 	_runEvents('show', message);

			// 	_promise = $timeout(function() {
			// 		service.clearLastAction();
			// 		_runEvents('hide');

			// 		if(cb !== null)
			// 			cb.apply(null, []);
			// 	}, 10000);
			// };

			this.cancelTimeout = function() {
				if(_promise !== null) {
					if($timeout.cancel(_promise)) {
						_promise = null;
					}
				}
			};

			this.runLastAction = function(cb) {
				cb = cb || null;
				if(trigger._undoAction !== null) {
					trigger._undoAction.apply(trigger._undoContext, trigger._params);
				}

				if(cb !== null) {
					cb.apply(null, []);
				}
			};

			this.clearLastAction = function() {
				trigger._undoAction = null;
				trigger._undoContext = null;
				trigger._dismissAction = null;
				trigger._params = [];
			};
		}
	]);
})();