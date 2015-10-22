(function() {
	var app = angular.module('atUI');
	
	class FieldDiffService extends BaseDiff {
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
					//if(JSON.stringify(p[i]) == JSON.stringify(c)) {
					if(p[i].name === c.name) {
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
		
		_findMissing(panels, unique, newP) {
			for(let i in panels) {
				for(let a in unique) {
					let found = false;
					for(let ii in panels[i].data) {
						//if(JSON.stringify(unique[a]) == JSON.stringify(panels[i].data[ii])) {
						if(unique[a].name === panels[i].data[ii].name) {
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
			
			return newP;
		}
		
		_initDiff() {
			var newP = {};
			for(let i in this._panels) {
				newP[i] = [];
			}
			
			var panels = angular.copy(this._panels);
			var unique = this._getUniquePanels(panels);
			
			newP = this._findMissing(panels, unique, newP);
			
			this._complete(newP);
		}
	}
	
	app.service('FieldDiffService', [FieldDiffService]);
})();