(function() {
	var app = angular.module('atCore');
	
	app.factory('ListBoxFactory', [function() {
		class ListBox {
			constructor(title, icon) {
				this.observers = {
					'search': [],
					'list': []
				};
				this.options = {
					'title': title,
					'icon': icon,
					'search': false
				};
				this._list = [];
			}
			
			get title() {
				return this.options.title;
			}
			
			get icon() {
				return this.options.icon;
			}
			
			set list(list) {
				var oldValue = angular.copy(this._list);
				this._list = list;
				this.notify('list', oldValue, this._list);
			}
			
			get list() {
				return this._list;
			}
			
			get search() {
				return this.options.search;
			}
			
			enableSearch() {
				this.notify('search', false, true);
				this.options.search = true;
				return this;
			}
			
			watch(subject, action) {
				this.observers[subject].push(action);
			}
			
			notify(subject, oldValue, newValue) {
				for(var i in this.observers[subject]) {
					this.observers[subject][i].apply(null, [oldValue, newValue]);
				}
			}
		}
		
		return {
			'build': function(title, icon) {
				return new ListBox(title, icon);
			}
		};
	}]);
})();