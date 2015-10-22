angular.module('atUI').service('anchorSmoothScroll', [function(){
	
	var scrollCB = null;
	
	this.onScroll = function(cb) {
		scrollCB = cb;
	};
    
    this.scrollTo = function(eID) {
    	scrollCB.apply(null, [eID]);        
    };
    
}]);