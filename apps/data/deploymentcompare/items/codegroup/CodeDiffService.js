(function() {
	var app = angular.module('atUI');
	
	class CodeDiffService extends BaseDiff {
		constructor() {
			super();
		}
		
		_getUniquePanels(panels) {
			var unique = [];
			for(let i in panels) {
				for(let ii in panels[i].data) {
					unique.push(panels[i].data[ii]);
				}
			}
			
			return unique.reduce(function(p, c) {
				var found = false;
				for(let i in p) {
					if(p[i].shortName === c.shortName) {
						found = true;
						break;
					}
				}
				if(!found) {
					p.push(c);
				}
				
				return p;
			}, []);
		}
		
		_initDiff() {
			var newP = {};
			for(let i in this._panels) {
				newP[i] = [];
			}
			var panels = angular.copy(this._panels);
			var unique = this._getUniquePanels(panels);
			
			for(let i in panels) {
				for(let a in unique) {
					let found = false;
					for(let ii in panels[i].data) {
						if(unique[a].shortName === panels[i].data[ii].shortName) {
							found = panels[i].data[ii];
							break;
						}
					}
					if(found !== false) {
						newP[i].push(found);
					} else {
						let newItem = angular.copy(unique[a]);
						newItem.__MISSING = true;
						newP[i].push(newItem);
					}
				}
			}
			
			this._complete(newP);
		}
	}
	
	app.service('CodeDiffService', [CodeDiffService]);
})();