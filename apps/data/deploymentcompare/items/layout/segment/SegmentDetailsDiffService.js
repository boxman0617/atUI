(function() {
	var app = angular.module('atUI');
	
	class SegmentDetailsDiffService extends BaseDiff {
		constructor($sce) {
			super();
			
			this.$sce = $sce;
			this.__init();
		}
		
		__init() {
			this._colors = {
				'added': '#2DAA46',
				'removed': '#AA2D2D'
			};
		}
		
		_initDiff() {
			var ordered = [];
			var newP = {}
			for(var i in this._panels) {
				var data = angular.copy(this._panels[i].data);
				if(!angular.isDefined(data)) {
					data = {'description': '', 'shortDescription': ''};
				}
				if(data.description === null) {
					data.description = '';
				}
				if(data.shortDescription === null) {
					data.shortDescription = '';
				}
				ordered.push({
					'order': this._panels[i].order,
					'id': i,
					'data': data
				});
				newP[i] = {};
			}
			ordered = ordered.sort(function(a, b) {
				if(a.order > b.order) {
					return 1;
				}
				if(a.order < b.order) {
					return -1;
				}
				return 0;
			});
			
			newP = this._markDifferences(ordered);
			
			this._complete(newP);
		}
		
		_markDifferences(panels) {
			var newP = {};
			for(var i in panels) {
				newP[panels[i].id] = panels[i].data;
			}
			
			for(var i in panels) {
				var next = parseInt(parseInt(i) + 1);
				if(i === "0") {
					newP[panels[i].id].__description = panels[i].data.description;
					newP[panels[i].id].__shortDescription = panels[i].data.shortDescription;
				}
				if(typeof panels[next] !== 'undefined') {
					var diff = JsDiff.diffWords(panels[i].data.description, panels[next].data.description);
					newP[panels[next].id].__description = this._realCompile(
						diff
					);
					diff = JsDiff.diffWords(panels[i].data.shortDescription, panels[next].data.shortDescription);
					newP[panels[next].id].__shortDescription = this._realCompile(
						diff
					);
				}
			}
			return newP;
		}
		
		_compileDiff(diff) {
			var str = '';
			for(var i in diff) {
				str += diff[i].value;
			}
			return str;
		}
		
		_realCompile(diff) {
			var str = '';
			for(var i in diff) {
				if(angular.isDefined(diff[i].added) && diff[i].added === true) {
					str += '<ins>'+diff[i].value+'</ins>';
					continue;
				}
				if(angular.isDefined(diff[i].removed) && diff[i].removed === true) {
					str += '<del>'+diff[i].value+'</del>';
					continue;
				}
				str += diff[i].value;
			}
			return this.$sce.trustAsHtml(str);
		}
	}
	
	app.service('SegmentDetailsDiffService', ['$sce', SegmentDetailsDiffService]);
})();