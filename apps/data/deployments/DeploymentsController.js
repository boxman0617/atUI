(function() {
	var app = angular.module('atUI');
	
	class DeploymentsController {
		constructor($scope, PlatformService, NotificationQueue, AlertMessageService, StoreService) {
			this.PlatformService = PlatformService;
			this.$scope = $scope;
			this.NotificationQueue = NotificationQueue;
			this.AlertMessageService = AlertMessageService;
			this.StoreService = StoreService;
			
			this._setupScope();
			this._init();
		}
		
		_setupScope() {
			var self = this;
			this._baseDeployment = {
				'name': '',
				'version': 10,
				'createDate': '',
				'createUserID': 0
			};
			this._resetNewDeployment();
			
			this.$scope.cleanCreate = function() {
				self.cleanCreate();
			};
			
			this.$scope.cloneBasedOnThis = function(deployment) {
				self.cloneBasedOnThis(deployment);
			};
			
			this.$scope.onClone = function(deployment) {
				self.onClone(deployment);
			};
			
			this.$scope.onDelete = function(deployment) {
				self.onDelete(deployment);
			};
			
			this.$scope._cloneIntent = null;
		}
		
		_init() {
			this._refreshPlatforms();
			this.StoreService.leftOffHere('Deployments');
		}
		
		_refreshPlatforms() {
			var self = this;
			this.PlatformService.fetchPlatforms(function() {
				self.$scope.deployments = self.PlatformService.getPlatforms();
			});
		}
		
		_resetNewDeployment() {
			this.$scope.newDeployment = angular.copy(this._baseDeployment);
		}
		
		onClone(deployment) {
			this.$scope._cloneIntent = deployment;
			$('#clone-deployment-modal').modal();
		}
		
		onDelete(deployment) {
			var self = this;
			this.AlertMessageService.showQuestion('Hold on!', 'Deleting this Deployment will also delete ALL associated data. Continue?', [
                {
                	'class': 'btn-danger',
                	'action': function() {
                		self.deleteDeployment(deployment);
                	},
                	'label': 'DELETE',
                	'dismiss': true
                },
                {
                	'class': 'btn-default',
                	'label': 'Cancel',
                	'dismiss': true
                }
	        ]);
		}
		
		deleteDeployment(deployment) {
			var self = this;
			this.PlatformService.deletePlatform(deployment, function() {
				self._refreshPlatforms();
				self.NotificationQueue.push({
					'icon': 'thumbs-o-up',
					'text': 'Successfully delete Deployment!'
				});
			});
		}
		
		cleanCreate() {
			var self = this;
			this.PlatformService.cleanCreate(this.$scope.newDeployment, function() {
				self._refreshPlatforms();
				self.NotificationQueue.push({
					'icon': 'thumbs-o-up',
					'text': 'Successfully created a new Deployment!'
				});
				self._resetNewDeployment();
			});
		}
		
		cloneBasedOnThis(deployment) {
			var self = this;
			this.PlatformService.cloneBasedOnThis(this.$scope.newDeployment, deployment, function() {
				self._refreshPlatforms();
				self.NotificationQueue.push({
					'icon': 'thumbs-o-up',
					'text': 'Successfully cloned new Deployment!'
				});
				self._resetNewDeployment();
			});
		}
	}
	
	app.controller('DeploymentsController', ['$scope', 'PlatformService', 'NotificationQueue', 'AlertMessageService', 'StoreService', DeploymentsController]);
})();