(function() {
	angular.module('atUI').directive('requiredIfNotDisabled', function() {
		return {
			'restrict': 'A',
			'link': function(scope, el) {
				var elm = angular.element(el[0]);
				var $dep = $('#'+elm.attr('data-dep-on'));

				$dep.bind('change', function() {
					if(elm.is(':disabled')) {
						elm.removeAttr('required');
						var $group = elm.closest('.form-group');
						$group.removeClass('has-error');
						$group.removeClass('has-success');
					} else {
						elm.attr('required', 'required');
					}
				});
			}
		};
	});
})();