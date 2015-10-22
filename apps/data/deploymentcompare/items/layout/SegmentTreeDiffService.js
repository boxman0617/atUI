(function() {
	var app = angular.module('atUI');
	
	class SegmentTreeDiffService extends BaseDiff {
		constructor(RecordLayoutUtilityService) {
			super();
			
			this.RecordLayoutUtilityService = RecordLayoutUtilityService;
			
			this.index = 0;
		}
		
		_initDiff() {
			var newP = {};
			var trees = {};
			for(let i in this._panels) {
				newP[i] = [];
			}
			var panels = angular.copy(this._panels);
			
			for(let i in panels) {
				if(panels[i].data.length > 0) {
					trees[i] = this.RecordLayoutUtilityService._initLayout(panels[i].data);
				} else {
					trees[i] = {
						'children': [],
						'__MISSING': true
					};
				}
			}
			
			var mergedTree = this._mergeTrees(trees);
			
			trees = this._markMissing(trees, mergedTree);
			
			this._complete(trees);
		}
		
		_markMissing(trees, mergedTree) {
			var newTrees = {};
			for(var i in trees) {
				newTrees[i] = angular.copy(mergedTree);
				
				newTrees[i] = this._markBranchMissing(newTrees[i], trees[i]);
			}
			
			return newTrees;
		}
		
		_markBranchMissing(mainBranch, checkBranch) {
			if(checkBranch.hasOwnProperty('__MISSING')) {
				mainBranch.__MISSING = true;
			}
			for(var ii in mainBranch.children) {
				var check = mainBranch.children[ii];
				var found = false;
				for(var iii in checkBranch.children) {
					if(check.name === checkBranch.children[iii].name) {
						found = true;
						break;
					}
				}
				if(!found) {
					mainBranch.children[ii].__MISSING = true;
				}
				if(mainBranch.children[ii].children.length > 0 && checkBranch.children[ii] !== undefined) {
					mainBranch.children[ii] = this._markBranchMissing(mainBranch.children[ii], checkBranch.children[ii]);
				}
			}
			
			return mainBranch;
		}
		
		_markWithindex() {
			var m = this.index;
			this.index++;
			return m;
		}
		
		_mergeTrees(trees) {
			var merged = {
				'name': 'DRC',
				'version': 0,
				'latest': true,
				'children': [],
				'index': this._markWithindex(),
				'__LEVEL': 'layout-segment'
			};
			
			for(var i in trees) {
				merged = this._merge(merged, trees[i]);
			}
			
			return merged;
		}
		
		_merge(target, src) {
			for(var i in src.children) {
				
				let found = false;
				for(var ii in target.children) {
					if(target.children[ii].name === src.children[i].name) {
						found = true;
						break;
					}
				}
				
				if(!found) {
					let n = {
						'name': src.children[i].name,
						'version': src.children[i].version,
						'latest': src.children[i].latest,
						'children': [],
						'index': this._markWithindex(),
						'__LEVEL': 'layout-segment'
					};
					target.children.push(n);
					if(src.children[i].children.length > 0) {
						target.children[target.children.length - 1] = this._merge(
							target.children[target.children.length - 1], 
							src.children[i]
						);
					}
				}
			}
			
			return target;
		}
	}
	
	app.service('SegmentTreeDiffService', ['RecordLayoutUtilityService', SegmentTreeDiffService]);
})();