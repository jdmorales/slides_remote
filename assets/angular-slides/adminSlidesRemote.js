var adminSlidesRemote = angular.module('adminSlidesRemote',['appSlidesRemote'])


adminSlidesRemote.controller('CtrlSlide',function($scope){

});

adminSlidesRemote.directive('adminControl',function(){
  return{
    restrict:'E',
    replace : true,
    controller:'CtrlSlide',
    scope : {

    },
    templateUrl: '/angular-slides/templates/admin-control.tpl.html',
    link:function(scope,element,attr,ctrl){

      scope.activated = false;
      scope.spectators = [
        {
          id : 1,
          name : "John Darwin"
        },
        {
          id : 2,
          name : "Juan Da"
        },
        {
          id : 3,
          name : "Pedro Sanchez"
        }
      ];

      scope.openPanel = function () {
        scope.activated = !scope.activated;
      }

    }
  }
});



/*
 appSlide.API = {

 setCurrentSlide : function(){
 appSlide.config.currentSlide = 0;
 },

 changeSlide : function (currentIndex) {
 console.log(currentIndex);
 }

 };
 */


