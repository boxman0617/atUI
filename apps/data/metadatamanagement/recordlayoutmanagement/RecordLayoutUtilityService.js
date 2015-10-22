(function() {
	var app = angular.module('atUI');

	app.service('RecordLayoutUtilityService', [
		function() {
			var _layout = null;

			this._segmentMold = function(sName, sVersion) {
				var tmp = {
					'name': sName,
					'version': sVersion / 100,
					'latest': true,
					'children': []
				};

				if(sVersion > 0) {
					tmp.latest = false;
				}

				return tmp;
			};
			
			this._findDRC = function() {
				var drc = _layout.filter(function(s) {
					if(s.segmentName === 'DRC') {
						return s;
					}
				});

				return drc;
			};

			this._initLayout = function(layout) {
				_layout = layout;

				var drc = this._findDRC();
				var l = this._segmentMold(drc[0].segmentName, drc[0].segmentVersion);

				l.children = this._findChildren(drc);

				return l;
			};

			this._findSegment = function(name, version) {
				var segments = _layout.filter(function(s) {
					if(this.name === s.segmentName && this.version === s.segmentVersion) {
						return s;
					}
				}, {
					'name': name,
					'version': version
				});

				return segments;
			};

			this._findChildren = function(parent) {
				var children = [];
				for(var i in parent) {
					children.push(
						this._segmentMold(parent[i].childSegmentName, parent[i].childSegmentVersion)
					);

					var _tmp = this._findSegment(parent[i].childSegmentName, parent[i].childSegmentVersion);
					if(_tmp.length > 0) {
						children[children.length - 1].children = this._findChildren(_tmp);
					}
				}

				return children;
			};
		}
	]);
})();