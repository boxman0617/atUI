(function() {
	var app = angular.module('atUI');
	
	class NewReformatterController {
		constructor($scope, $element, $attrs, RecordLayoutService, APIService, RecordLayoutUtilityService, PlatformService, $compile) {
			this.$scope = $scope;
			this.$element = $element;
			this.$attrs = $attrs;
			this.RecordLayoutService = RecordLayoutService;
			this.APIService = APIService;
			this.RecordLayoutUtilityService = RecordLayoutUtilityService;
			this.PlatformService = PlatformService;
			this.$compile = $compile;
			
			this._initValues();
			this._initScopeValues();
			this._setupScopeMethods();
			this._initHeights();
		}
		
		_initHeights() {
			this.$element.css('height', $(this.$attrs.newReformatter).outerHeight());
			
			var height = this.$element.find('.bottom-section').outerHeight();
			var total = this.$element.outerHeight();
			var full = total - height;
			this.$element.find('.top-section').css('height', full);
			
			var $panels = this.$element.find('.panels');
			var $panel = $panels.find('.panel').filter(':first');
			var heightDiff = parseInt($panel.outerHeight()) - parseInt($panel.height());
			var endHeight = ((full - heightDiff) - parseInt($panel.find('.panel-heading').outerHeight())) - 20;
			this.$scope.heights = {
				'height': endHeight
			};
			
			var $top = this.$element.find('.top-of-format');
			var topHeight = parseInt($top.outerHeight());
			this.$scope.tableHeight = {
				'height': full - topHeight - 22 - 66
			};
		}
		
		_initValues() {
			this._template = null;
		}
		
		_initScopeValues() {
			var self = this;
		}
		
		_setupScopeMethods() {
			var self = this;
			
			this.$scope.dropzoneClose = false;
			this.$scope.templateHeader = [];
			this.$scope.template = [];
			this.$scope.heights = {};
			this.$scope.tableHeight = {};
			this.$scope.layoutChosen = false;
			this.$scope.templateReady = false;
			this.$scope.layouts = [];
			this.$scope.layout = {};
			this.$scope.layoutSelected = null;
			
			this.$scope.dropzoneConfig = {
				'dictDefaultMessage': '- Drop template file here -',
				'acceptedFiles': '.csv',
				'accept': function(file, done) {
					self.addedFile(file);
					done('');
				},
				'init': function() {
					var dz = this;
					this.on('error', function(file, err) {
						dz.removeFile(file);
						dz.disable();
						self.$scope.$apply(function() {
							self.$scope.dropzoneClose = true;
						});
					});
				}
			};
			
			this.RecordLayoutService.getList(function(layouts) {
				self.$scope.layouts = layouts;
			});
			
			this.$scope.selectLayout = function(layout) {
				self.selectLayout(layout);
			};
		}
		
		selectLayout(layout) {
			var self = this;
			this.$scope.layoutChosen = true;
			this.$scope.layoutSelected = layout;
			
			this.APIService.get('layout/latest/'+layout.id+'/p/'+this.PlatformService.current.id).success(function(l) {
				self.APIService.get('layout/segments/'+l.id).success(function(segments) {
					self.$scope.layout = self.RecordLayoutUtilityService._initLayout(segments);
					
					self._render();
				});
			});
		}
		
		_render() {
			var dom = '<div reformat-item></div>';
			var newScope = this.$scope.$new();
			newScope.item = this.$scope.layout;
			newScope.deploymentID = this.PlatformService.current.id;
			var $dom = this.$compile(dom)(newScope);
			this.$element.find('.layout-panel').append($dom);
		}
		
		_setTemplate(text) {
			this._template = text;
			this._readTemplate();
		}
		
		_readTemplate() {
			var t = this._template.split("\n");
			
			var header = t.shift();
			this.$scope.templateHeader = header.split(',').map(function(e) {
				return e.trim();
			});
			this.$scope.templateHeader.push('Maps to');
			this.$scope.templateHeader.push('Trans. Rule');
			
			for(var i in t) {
				var row = t[i].split(',').map(function(e) {
					return e.trim();
				});
				this.$scope.template.push(row);
			}
			
			this._renderTable();
			this.$scope.templateReady = true;
		}
		
		_renderTable() {
			var dom = '<tr reformat-table-row></tr>';
			var tbody = this.$element.find('.format-panel tbody');
			for(var i in this.$scope.template) {
				var newScope = this.$scope.$new();
				newScope.row = this.$scope.template[i];
				var $dom = this.$compile(dom)(newScope);
				tbody.append($dom);
			}
		}
		
		addedFile(file) {
			var self = this;
			
			var reader = new FileReader();
			reader.readAsText(file);
			reader.onload = function(e) {
				self._setTemplate(e.target.result);
			};
		}
	}
	
	app.directive('newReformatter', [function() {
		return {
			'controller': [	
				'$scope', 
				'$element', 
				'$attrs', 
				'RecordLayoutService', 
				'APIService', 
				'RecordLayoutUtilityService', 
				'PlatformService',
				'$compile',
				NewReformatterController]
		};
	}]);
	
	class DragService {
		constructor() {
			this._init();
		}
		
		_init() {
			this._holding = null;
		}
		
		holdThis(item) {
			this._holding = item;
		}
		
		drop() {
			if(this._holding === null) {
				return null;
			}
			var item = this._holding.item;
			this._holding = null;
			return item;
		}
	}
	
	app.service('DragService', [DragService]);
	
	class DraggingObjectController {
		constructor($scope, $element, $document) {
			this.$scope = $scope;
			this.$element = $element;
			this.$document = $document;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.pos = {
				'top': 0,
				'left': 0
			};
			
			this.$scope.c = {
				'offset': {'x': 5, 'y': -10}
			};
			
			this.$scope.pos.left = this.$scope.event.pageX + this.$scope.c.offset.x;
			this.$scope.pos.top = this.$scope.event.pageY + this.$scope.c.offset.y;
			
			this.$document.on('mousemove', function(e) {
				self.mouseMove(e);
			});
			
			this.$document.on('mouseup', function(e) {
				self.mouseUp(e);
			});
			
			this.$scope.$on('$destroy', function() {
				self.$document.off('mousemove');
				self.$document.off('mouseup');
			});
		}
		
		mouseMove(e) {
			var self = this;
			this.$scope.$apply(function() {
				self.$scope.pos.left = e.pageX + self.$scope.c.offset.x;
				self.$scope.pos.top = e.pageY + self.$scope.c.offset.y;
			});
		}
		
		mouseUp(e) {
			this.$element.remove();
			$('html').removeClass('dragging-something');
		}
	}
	
	app.directive('draggingObject', [function() {
		return {
			'template': '{{label}}',
			'controller': ['$scope', '$element', '$document', DraggingObjectController],
			'link': function(scope, element) {
				
			}
		};
	}]);
	
	class ReformatItemController {
		constructor($scope, $element, APIService, DragService, $compile) {
			this.$scope = $scope;
			this.$element = $element;
			this.APIService = APIService;
			this.DragService = DragService;
			this.$compile = $compile;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this.$scope.fields = [];
			this.$scope.exploded = false;
			
			this.openSegment();
			
			this.$scope.grabField = function($event, field) {
				self.grabField($event, field);
			};
		}
		
		grabField($event, field) {
			$('html').addClass('dragging-something');
			this.DragService.holdThis({
				'event': $event,
				'item': field
			});
			var dom = '<div dragging-object ng-style="pos"></div>';
			var newScope = this.$scope.$new();
			newScope.label = field.segmentName+'.'+field.name;
			newScope.event = $event;
			var $dom = this.$compile(dom)(newScope);
			this.$element.append($dom);
		}
		
		openSegment() {
			var self = this;
			
			this.APIService.get('segment/latest/'+this.$scope.item.name+'/p/'+this.$scope.deploymentID, {'raw': true}).success(function(data) {
				self.$scope.fields = data[3];
			});
			
			this.$scope.toggleOpen = function() {
				self.toggleOpen();
			};
		}
		
		toggleOpen() {
			this.$scope.exploded = !this.$scope.exploded;
		}
	}
	
	app.directive('reformatItem', ['$compile', function($compile) {
		return {
			'templateUrl': 'assets/templates/apps/data/metadatamanagement/reformatter/reformatItem.html',
			'controller': ['$scope', '$element', 'APIService', 'DragService', '$compile', ReformatItemController],
			'link': function(scope, element) {
				this._render = function(item) {
					var dom = '<div reformat-item></div>';
					var newScope = scope.$new();
					newScope.item = item;
					newScope.deploymentID = scope.deploymentID;
					var $dom = $compile(dom)(newScope);
					element.find('.children').append($dom);
				};
				
				if(scope.item.children.length > 0) {
					for(var i in scope.item.children) {
						this._render(scope.item.children[i]);
					}
				}
			}
		};
	}]);
	
	app.directive('heightOf', [function() {
		return {
			'link': function(scope, element, attrs) {
				var $ref = $(attrs.heightOf);
				
				element.css('height', $ref.outerHeight());
			}
		}
	}]);
})();