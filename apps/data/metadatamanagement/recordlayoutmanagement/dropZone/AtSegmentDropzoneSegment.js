(function() {
	var app = angular.module('atUI');
	
	class SegmentDropzone {
		constructor($scope, $element, $compile, SegmentGrabService, ContextMenuItemFactory, ContextMenuService) {
			this.$scope = $scope;
			this.$element = $element;
			this.$compile = $compile;
			this.SegmentGrabService = SegmentGrabService;
			this.ContextMenuItemFactory = ContextMenuItemFactory;
			this.ContextMenuService = ContextMenuService;
			
			this._setupState();
			this._setupScope();
			this._init();
		}

		_init() {
			var self = this;
			this.unwatch = this.$scope.$watch('segment', function(newValue, oldValue) {
				if(angular.isDefined(newValue) && newValue !== null && self.elementID === null) {
					self.onLoaded();
					self.unwatch();
				}
			});
			if(this.$scope.segment !== null) {
				this.unwatch();
				this.onLoaded();
			}
		}

		onLoaded() {
			var self = this;
			var rightNow = moment().format();
			var seg = {};

			this.elementID = 'at-dz-segment-'+md5(this.SegmentGrabService.segments.count + rightNow);
			this.SegmentGrabService.segments.count += 1;
			this.$element.attr('id', this.elementID);
			this.$scope.segment.$element_id = this.elementID;

			if(!this.$scope.segment.hasOwnProperty('children')) {
				this.$scope.segment.children = [];
			} else {
				if(this.$scope.segment.children.length > 0) {
					this.createOnInitLoadChildren();
				}
			}

			this.$scope.$on('dz-segment-'+this.$scope.segment.$element_id, function(e, e_id) {
				self.createChild();
			});

			this.$element.find(this.ACTUAL_ELEMENT).on('contextmenu', function(e) {
				e.preventDefault();
				return false;
			});
		}
		
		/**
		 * Creates a child within this Segment DZ
		 */
		createChild() {
			var $child = $(this.NEW_SEGMENT_TMPL);

			var newScope = this.$scope.$new();
			newScope.segment = this.$scope.segment.children[this.$scope.segment.children.length - 1];

			var child = this.$compile($child)(newScope);
			this.$element.find(this.CREATION_POINT).append(child);
		}

		/**
		 * Creates the initial children when first loaded
		 */
		createOnInitLoadChildren() {
			var children = [];
			for(let segment of this.$scope.segment.children) {
				let $child = $(this.NEW_SEGMENT_TMPL);
				let childScope = this.$scope.$new();
				childScope.segment = segment;
				let child = this.$compile($child)(childScope);
				children.push(child);
			}
			this.$element.find(this.CREATION_POINT).append(children);
		}

		onMouseOver($event) {
			this.$scope.over = true;
			this.SegmentGrabService.over(this.$scope.segment);
		}
		
		onMouseOut($event) {
			this.$scope.over = false;
		}

		onMouseDrop($e, $event) {
			this.SegmentGrabService.drop();
			this.createChild();
		}

		onSegmentContextMenuCreate($event) {
			var self = this;
			var context = {'scope': this.$scope, 'element': this.$element};
			var menuItems = [];
			menuItems.push(
				this.ContextMenuItemFactory.build('Copy')
					.setIcon('fa-file-o')
					.setAction(function() {
						self.$scope.parentController.copy(context);
					})
			);
			menuItems.push(
				this.ContextMenuItemFactory.build('Cut')
					.setIcon('fa-scissors')
					.setAction(function() {
						self.$scope.parentController.cut(context);
					})
			);

			if(this.$scope.parentController.canIPaste()) {
				menuItems.push(
					this.ContextMenuItemFactory.build('Paste')
						.setIcon('fa-clipboard')
						.setAction(function() {
							self.$scope.parentController.paste(context);
						})
				);
			}

			menuItems.push(
				this.ContextMenuItemFactory.build('Remove')
					.setIcon('fa-times')
					.setAction(function() {
						self.$scope.parentController.remove(context);
					})
			);

			this.ContextMenuService.create($event, menuItems);
		}

		onDRCContextMenuCreate($event) {
			if(this.canEdit) {
				if(this.$scope.parentController.canIPaste()) {
					var context = {'scope': this.$scope, 'element': this.$element};
					var menuItems = [];
					var self = this;
					menuItems.push(
						this.ContextMenuItemFactory.build('Paste')
							.setIcon('fa-clipboard')
							.setAction(function() {
								self.$scope.parentController.paste(context);
							})
					);
					this.ContextMenuService.create($event, menuItems);
				}
			}
		}

		onDestroy($event) {
			var self = this;
			this.$element.remove();
			this.SegmentGrabService.segmentsLocation.segments.forEach(function(segment, index) {
				for(let elementID of segment) {
					if(self.$scope.segment.$element_id === elementID) {
						self.SegmentGrabService.segmentsLocation.segments.splice(index, 1);
						return;
					}
				}
			});
		}

		_setupState() {
			this.canEdit = true;
			this.elementID = null;

			this.CREATION_POINT = '.segment-children:first';
			this.NEW_SEGMENT_TMPL = '<div at-layout-segment-dropzone segment="segment"></div>';
			this.MOUSE_OVER_CLASS = 'over-dropzone';
			this.ACTUAL_ELEMENT = '.segment-main:first';
		}
		
		_setupScope() {
			this.$scope.over = false;
			this._attachParentController();
			this._attachCanEditSwitch();
			this._attachMouseOver();
			this._attachMouseOut();
			this._attachMouseDrop();
			this._attachSegmentContextMenu();
			this._attachDestroy();
		}

		_attachDestroy() {
			var self = this;
			this.$scope.$on('$destroy', function($event) {
				self.onDestroy($event);
			});
		}

		_attachParentController() {
			this.$scope.parentController = null;
		}

		_attachSegmentContextMenu() {
			var self = this;
			this.$scope.spawnContextMenu = function($event) {
				if($event.button == 2) {
					if(self.$scope.$parent.hasOwnProperty('segment') && self.canEdit) {
						self.onSegmentContextMenuCreate($event);
					} else {
						self.onDRCContextMenuCreate($event);
					}
				}

				$event.stopPropagation();
				$event.preventDefault();
				return false;
			};
		}
		
		_attachCanEditSwitch() {
			var self = this;
			this.$scope.$on('layout-can-edit', function(e, status) {
				self.canEdit = status;
			});
		}
		
		_attachMouseOut() {
			var self = this;
			this.$scope.mouseIsOut = function($event) {
				self.onMouseOut($event);
			};
		}

		_attachMouseOver() {
			var self = this;
			this.$scope.mouseIsOver = function($event) {
				self.onMouseOver($event);
			};
		}

		_attachMouseDrop() {
			var self = this;
			this.$scope.mouseDrop = function($event) {
				if($event.button === 0 && self.SegmentGrabService.data.dragging) {
					self.onMouseDrop(null, $event);
				}
			};
		}
	}

	app.directive('atLayoutSegmentDropzone', ['$compile', 'SegmentGrabService', '$document', 'ContextMenuService', 'NotificationQueue', 'ContextMenuItemFactory',
		function($compile, SegmentGrabService, $document, ContextMenuService, NotificationQueue, ContextMenuItemFactory) {
			return {
				'restrict': 'A',
				'require': '^atLayoutDropzone',
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/dropZone/_atLayoutSegmentDropzone.html',
				'scope': {
					'segment': '='
				},
				'controller': function($scope, $element) {
					var dz = new SegmentDropzone($scope, $element, $compile, SegmentGrabService, ContextMenuItemFactory, ContextMenuService);
				},
				'link': function(scope, element, attrs, dzController) {
					scope.parentController = dzController;
				}
			};
		}
	]);
})();