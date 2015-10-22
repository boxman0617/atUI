(function() {
	angular.module('atUI').directive('fields', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, el) {
				
				var ref = this;
				
				this.applyModelChange = function(element) {
					var $elem = $(element);
					var model_name = $elem.attr('ng-model');
					var s = model_name.split('.');
					scope.$apply(function() {
						scope[s[0]][s[1]] = $elem.val();
					});
				};

				scope.$watch('arc_groups', function(newValue, oldValue) {
					if(newValue.length === 0) {
						el.css({
							'display': 'none'
						});
					} else {
						el.slideDown(function() {
							$('.field-type-date').datetimepicker({
								'pickTime': false
							}).on('dp.change', function(e) {
								ref.applyModelChange(this);
							});
							$('.field-type-time').datetimepicker({
								'pickDate': false
							}).on('dp.change', function(e) {
								ref.applyModelChange(this);
							});
						});
					}
				});
			}
		}
	}]);
})();