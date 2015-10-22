(function() {
	var app = angular.module('atUI');

	app.service('SegmentPreviewService', ['SegmentListService', 
		function(SegmentListService) {
			var eventChange = null;

			this.set = function(s) {
				s.previewing = true;

				SegmentListService.fetchByNameAndVersion(s.name, s.other_version_select.id.version, function(segment) {
					eventChange.apply(null, [segment]);
				});
			};

			this.onChange = function(cb) {
				eventChange = cb;
			};
		}
	]);

	app.service('SegmentGrabService', [function() {
		this.data = {
			'segment': null,
			'dragging': false,
			'over': null
		};

		this.timeout = {
			'count': 0
		};

		this.segments = {
			'count': 0
		};

		this.segmentsLocation = {
			'segments': []
		};

		this.listeners = [];

		var redoCount = 0;

		this.over = function(segment) {
			if(segment === null) {
				this.data.over = null;
				return;
			}
			if(this.data.over === null) {
				this.data.over = segment;
				return;
			}

			if(this.data.over !== null && this.data.over.$element_id !== segment.$element_id) {
				this.data.over = segment;
				return;
			}
		};

		this.on = function(action, data, cb) {
			this.listeners.push({
				'action': action,
				'do': cb,
				'data': data
			});
		};

		this.grab = function(segment) {
			this.over(null);
			this.data.dragging = true;
			this.data.segment = {
				'id': segment.id,
				'name': segment.name,
				'version': segment.version,
				'latest': segment.latest,
				'children': []
			};

			this._do('grab', this.data.segment);
		};

		this.drop = function() {
			this.data.dragging = false;
			if(this.data.over !== null && this.data.segment !== null) {
				this.data.over.children.push(this.data.segment);
				this._do('successfullDrop', this.data.over.children[this.data.over.children.length - 1]);
			}

			this.data.segment = null;

			this._do('drop');
		};

		this.redoDropzone = function(reset) {
			reset = reset || false;
			if(reset) {
				redoCount = 0;
			}

			if(redoCount < 2) {
				for(var i in this.segmentsLocation.segments) {
					for(var id in this.segmentsLocation.segments[i]) {
						var seg = {};
						if($('#'+id).length !== 0) {
							$main = $('#'+id).find('.segment-main:first');
							seg[id] = {
								'top': $main.offset().top,
								'bottom': $main.offset().top + $main.outerHeight(),
								'left': $main.offset().left,
								'right': $main.offset().left + $main.outerWidth()
							};
							this.segmentsLocation.segments[i] = seg;
						} else {
							this.segmentsLocation.segments.splice(i, 1);
						}
					}
				}
				redoCount++;
			}
		};

		this._do = function(action, data) {
			data = data || null;
			for(var i in this.listeners) {
				if(this.listeners[i].action === action) {
					this.listeners[i]['do'](data, this.listeners[i].data);
				}
			}
		};
	}]);
})();