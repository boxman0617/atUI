(function() {
	var app = angular.module('atUI');
	
	class UsersController {
		constructor($scope, UsersService, AdminModalService, NotificationQueue, UserService) {
			this.$scope = $scope;
			this.$scope.users = [];
			this.UsersService = UsersService;
			this.AdminModalService = AdminModalService;
			this.NotificationQueue = NotificationQueue;
			this.UserService = UserService;
			
			this.getUsers();
			this.setupEvents();
		}
		
		getUsers() {
			var self = this;
			this.UsersService.getAllUsers(function(users) {
				self.$scope.users = users;
				
				for(let u of self.$scope.users) {
					self.UserService.getThisUserImage(u, function(img) {
						u.img = img;
					});
				}
			});
		}
		
		newUser() {
			this.AdminModalService.up('users', {});
		}
		
		deleteUser(user) {
			var self = this;
			this.UsersService.deleteUser(user, function() {
				self.NotificationQueue.push({
					'icon': 'thumbs-o-up',
					'text': 'User has been deleted!'
				});
				self.UsersService.clearCache('users');
				self.getUsers();
			});
		}
		
		setupEvents() {
			var self = this;
			
			this.$scope.$on('users-controller-refresh', function() {
				self.getUsers();
			});
			
			this.$scope.startNew = function() {
				self.newUser();
			};
			
			this.$scope.onDelete = function(user) {
				self.deleteUser(user);
			};
		}
	}
	
	app.controller('UsersController', ['$scope', 'UsersService', 'AdminModalService', 'NotificationQueue', 'UserService',  UsersController]);
})();