(function() {
	var app = angular.module('atUI');
	
	class ReformatterController {
		constructor($scope) {
			this.$scope = $scope;
			
			this._initValues();
			this._initScopeValues();
			this._setupScopeMethods();
		}
		
		_initValues() {
			this._baseTemplateLocation = 'assets/templates/apps/data/metadatamanagement/{PERSPECTIVE}/{ACTION}/_main.html';
			this._perspective = 'Reformatter';
		}
		
		_getTemplate(action) {
			return this._baseTemplateLocation
				.replace(/\{PERSPECTIVE\}/g, this._perspective.toLowerCase())
				.replace(/\{ACTION\}/g, action.toLowerCase()+this._perspective);
		}
		
		_setView(action) {
			this.$scope.current_view = this._getTemplate(action);
		}
		
		_initScopeValues() {
			this.$scope.reformatterList = [];
			this.$scope.current_view = null;
		}
		
		_setupScopeMethods() {
			var self = this;
			
			this.$scope.loaded = true;
			
			this.$scope.newReformatter = function() {
				self.createNewReformatter();
			};
			
			this.$scope.selectReformatter = function(item) {
				self.selectReformatter(item);
			};
		}
		
		createNewReformatter() {
			this._setView('new');
		}
		
		selectReformatter(item) {
			
		}
	}
	
	app.controller('ReformatterController', ['$scope', ReformatterController]);
})();