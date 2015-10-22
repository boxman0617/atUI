(function() {
	var app = angular.module('atUI');
	
	class GroupsController {
		constructor($scope, UsersService, AdminModalService, NotificationQueue) {
			this.$scope = $scope;
			this.$scope.groups = [];
			this.UsersService = UsersService;
			this.AdminModalService = AdminModalService;
			this.NotificationQueue = NotificationQueue;
			
			this.getGroups();
			this.setupEvents();
		}
		
		editGroup(group) {
			this.AdminModalService.up('groups', group);
		}
		
		getGroups() {
			var self = this;
			this.UsersService.getAllGroups(function(groups) {
				self.$scope.groups = groups;
			});
		}
		
		newGroup() {
			this.AdminModalService.up('groups', {});
		}
		
		deleteGroup(group) {
			var self = this;
			this.UsersService.deleteGroup(group, function() {
				self.NotificationQueue.push({
					'icon': 'thumbs-o-up',
					'text': 'Group has been deleted!'
				});
				self.UsersService.clearCache('groups');
				self.getGroups();
			});
		}
		
		setupEvents() {
			var self = this;
			this.$scope.$on('groups-controller-refresh', function() {
				self.getGroups();
			});
			this.$scope.onEdit = function(group) {
				self.editGroup(group);
			};
			
			this.$scope.startNew = function() {
				self.newGroup();
			};
			
			this.$scope.onDelete = function(group) {
				self.deleteGroup(group);
			};
		}
	}
	
	app.controller('GroupsController', ['$scope', 'UsersService', 'AdminModalService', 'NotificationQueue', GroupsController]);
})();