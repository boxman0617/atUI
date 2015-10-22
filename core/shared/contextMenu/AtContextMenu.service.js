(function() {
	var app = angular.module('atCore');

	app.service('ContextMenuService', [
		function() {
			var _items = [],
				_summonCB;

			this.create = function($event, items) {
				_items = items;

				_summonCB.apply(null, [$event]);
			};

			this.onSummon = function(cb) {
				_summonCB = cb;
			};

			this.getItems = function() {
				return _items;
			};
		}
	]);

	app.service('ContextMenuItemFactory', [
		function() {
			function ContextMenuItem(name) {
				var _name, 
					_icon,
					_disabled = false,
					_context = {},
					_action;

				this.setName = function(name) {
					_name = name;
					return this;
				};

				this.setIcon = function(icon) {
					_icon = icon;
					return this;
				};

				this.setContext = function(context) {
					_context = context;
					return this;
				};

				this.disable = function() {
					_disabled = true;
					return true;
				};

				this.setAction = function(cb) {
					_action = cb;
					return this;
				};

				this.getName = function() {
					return _name;
				};

				this.getIcon = function() {
					return _icon;
				};

				this.isDisabled = function() {
					return _disabled;
				};

				this.getContext = function() {
					return _context;
				};

				this.fireAction = function() {
					_action.apply(null, [_context]);
				};

				this.setName(name);
			};

			this.build = function(name) {
				return new ContextMenuItem(name);
			};
		}
	]);
})();