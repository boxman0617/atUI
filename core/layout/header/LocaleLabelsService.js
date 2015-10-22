(function() {
	var app = angular.module('atUI');

	app.service('LocaleLabels', ['APIService', 
		function(APIService) {
			this.locales = {
				'labels': {},
				'cache': {}
			};
			
			var on = [];
			
			this.doOnRefresh = function() {
				for(var i in on) {
					on[i].apply(null, [this.locales.labels]);
				}
			};
			
			this.onRefresh = function(cb) {
				on.push(cb);
			};
			
			this.refreshLabels = function(locale) {
				var ref = this;
				if(!ref.locales.cache.hasOwnProperty(locale.id)) {
					APIService.get('locals/labels_'+locale.id).success(function(data) {
						ref.locales.cache[locale.id] = data;
						ref.locales.labels = ref.locales.cache[locale.id];
						ref.doOnRefresh();
					}).error(function(data, status) {
						console.error(data, status);
					});
				} else {
					ref.locales.labels = ref.locales.cache[locale.id];
					ref.doOnRefresh();
				}
			};
		}
	]);
})();