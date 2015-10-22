(function() {
	angular.module('atUI').directive('scrollAgent', ['anchorSmoothScroll', function(anchorSmoothScroll) {
		return {
			'controller': function($scope, $element) {
				
				anchorSmoothScroll.onScroll(function(to) {
					var $target = $('#'+to);
					var targetTop = $target.offset().top;
					var stageScrollTop = $element.scrollTop();
					var offset = -60;
					$element.animate({
						'scrollTop': parseInt(stageScrollTop) + parseInt(targetTop) + offset
					}, 1000, 'swing');
				});
				
			}
		};
	}]);
	
	angular.module('atUI').factory('spyScrollService', function() {
		var spy = {
			'linkActive': '',
			'links': []
		};
		return spy;
	});

	angular.module('atUI').directive('spyScroll', ['$window', '$timeout', function($window, $timeout) {
		return {
			'link': function(scope, element, attrs) {
				if($('body').width() > 768) {
					function setActiveLink(ref) {
						var refPageYOffset = parseInt(ref.scrollTop());
						for(var i in scope.spy.links) {
							var targetOffsetTop = parseInt($('#'+scope.spy.links[i]['target_id']).offset().top - 60)
							var nextTargetOffsetTop = parseInt($('#'+scope.spy.links[parseInt(i)+1]['target_id']).offset().top - 60);
							if(!angular.isUndefined(scope.spy.links[parseInt(i)+1])) {
								if(
									refPageYOffset >= targetOffsetTop &&
									refPageYOffset < nextTargetOffsetTop
								) {
									scope.$apply(function() {
										scope.spy.linkActive = scope.spy.links[i]['target_id'];
									});
								}
							} else {
								if(
									refPageYOffset >= parseInt($('#'+scope.spy.links[i]['target_id']).offset().top - 60) ||
									(ref.innerHeight + ref.scrollY) >= $('#stage').height()
								) {
									scope.$apply(function() {
										scope.spy.linkActive = scope.spy.links[i]['target_id'];
									});
								}
							}
						}
					};

					angular.element($('#stage')).bind('scroll', function() {
						setActiveLink($('#stage'));
					});

					$timeout(function() {
						scope.spy.linkActive = scope.spy.links[0]['target_id'];
					}, 2200);
				}
			}
		};
	}]);

	angular.module('atUI').directive('spyScrollLink', ['spyScrollService', function(spyScrollService) {
		return {
			'link': function(scope, element, attrs) {
				var spy = spyScrollService;
				var link = {
					'target_id': element.attr('data-target')
					//'offset': elem.offset().top - 60
				};
				spy.links.push(link);
			}
		};
	}]);
})();