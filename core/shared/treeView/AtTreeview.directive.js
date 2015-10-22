(function() {
	var app = angular.module('atUI');

	app.directive('atTreeview', [function() {
		return {
			'restrict': 'A',
			'scope': {
				'nodes': '=nodes'
			},
			'templateUrl': 'assets/templates/core/shared/treeView/attreeview.template.html',
			'link': function(scope, element, attrs) {

				var stage_height = $('#stage').height();
				var wrapper_bottom = parseInt($('#stage .wrapper').css('padding-bottom'));
				var $mgma = $('#mgma');
				var toolbar_height = $mgma.find('.toolbar').height() + 
					(parseInt($mgma.find('.toolbar').css('padding-top')) * 2) + 
					parseInt($mgma.find('.toolbar').css('border-bottom-width'));
				var mgma_stage_top = parseInt($mgma.find('.mgma-stage').css('padding-top'));
				
				element.css({
					'height': stage_height - (wrapper_bottom + toolbar_height + mgma_stage_top)
				});
			}
		};
	}]);

	app.directive('atTreeParentNode', ['ObjectToNodeService', '$compile', function(ObjectToNodeService, $compile) {
		return {
			'restrict': 'A',
			'templateUrl': 'assets/templates/core/shared/treeView/attreeparentnode.template.html',
			'link': function(scope, element, attrs) {
				var ref = this;
				var node_id = 'node-'+md5(JSON.stringify(scope.node.data));
				element.attr('id', node_id);
				scope.node.node_id = node_id;

				this.createChildren = function(_parent_scope, el) {
					for(var i in _parent_scope.node.children) {
						var $child = $('<div class="node node-type-'+_parent_scope.node.children[i].node_type+' closed" at-tree-'+_parent_scope.node.children[i].node_type+'-node></div>');

						var child_scope = _parent_scope.$new();
						child_scope.node = _parent_scope.node.children[i];

						var child = $compile($child)(child_scope);

						el.find('.node-children').append(child);
					}
				};

				this.toggleParent = function(el) {
					var _p = angular.element(el).parent();

					if(_p.hasClass('opened')) {
						_p.removeClass('opened').addClass('closed');
					} else {
						if(_p.scope().node.children.length > 0) {
							_p.removeClass('closed').addClass('opened');
						} else {
							this.getChildren(_p);
						}
					}
				};

				this.getChildren = function(_p) {
					_p.addClass('loading');
					ObjectToNodeService.setParentNode(_p.scope().node);
					ObjectToNodeService.getChildren(function() {
						ref.createChildren(_p.scope(), _p);
						_p.removeClass('loading');
						_p.removeClass('closed').addClass('opened');
					}, function() {
						_p.removeClass('loading').addClass('error');
					});
				};

				if(element.hasClass('opened') && scope.node.children.length === 0) {
					this.getChildren(element);
				}

				element.find('.node-indicator').on('click', function() {
					ref.toggleParent(this);
				});
				element.find('.node-name').on('dblclick', function() {
					ref.toggleParent(this);
				});
				element.find('.node-name').on('mousedown', function(e) {
					if(e.button == 2) {
						var _p = angular.element(this).parent();

						var $menu = $('<div at-context-menu></div>');
						var child_scope = _p.scope().$new();
						child_scope.mouse = {
							'x': e.pageX,
							'y': e.pageY
						};
						var child = $compile($menu)(child_scope);
						_p.append(child);

						return false;
					}
				});

				this.createChildren(scope, element);

			}
		};
	}]);

	app.directive('atTreeSterileNode', [function() {
		return {
			'restrict': 'A',
			'templateUrl': 'assets/templates/core/shared/treeView/attreesterilnode.template.html',
			'link': function(scope, element, attrs) {
				var ref = this;
				var node_id = 'node-'+md5(JSON.stringify(scope.node.data));
				element.attr('id', node_id);
				scope.node.node_id = node_id;
			}
		};
	}]);

	app.filter('atTreeNodeName', function() {
		return  function(node) {
			switch(node.type) {
				case 'platform': 
				case 'gbif':
					return node.data.name+' - v'+node.data.version;
					break;
				case 'field':
					return node.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\w\S*/g, function(txt) {
		                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		            });
					break;
			};
			return node.name;
		};
	});

})();