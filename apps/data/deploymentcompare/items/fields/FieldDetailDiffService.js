(function() {
	var app = angular.module('atUI');
	
	class FieldDetailDiffService extends BaseDiff {
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
			this._defaults = {
				'codeTableName': '',
				'dataTypeName': '',
				'description': '',
				'fieldNumber': 0,
				'length': 0,
				'name': ''
			};
		}
		
		_initDiff() {
			var ordered = [];
			var newP = {}
			for(var i in this._panels) {
				var data = angular.copy(this._panels[i].data);
				if(!angular.isDefined(data)) {
					data = angular.copy(this._defaults);
				}
				
				for(var a in this._defaults) {
					if(data[a] === null) {
						data[a] = this._defaults[a];
					}
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
					for(var a in this._defaults) {
						newP[panels[i].id]['__'+a] = panels[i].data[a];
					}
				}
				if(typeof panels[next] !== 'undefined') {
					for(var a in this._defaults) {
						if(typeof panels[i].data[a] === 'string') {
							var diff = JsDiff.diffWords(
								panels[i].data[a],
								panels[next].data[a]
							);
							newP[panels[next].id]['__'+a] = this._realCompile(diff);
						} else {
							newP[panels[next].id]['__'+a] = panels[next].data[a];
						}
					}
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
	
	app.service('FieldDetailDiffService', ['$sce', FieldDetailDiffService]);
})();