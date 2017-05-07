var appSlide = angular.module('adminSlidesRemote',[]);


appSlide.controller('slideController',function ($scope) {
  $scope.direction = 'left';
  $scope.currentIndex = 0;

  $scope.list = [];
  self = this;

  this.isCurrentSlideIndex = function (index) {
    if( $scope.currentIndex === index){
      $scope.list[index].selected = true;
      return true;
    }else{
      $scope.list[index].selected = false;
      return false;
    }
  };

  $scope.updateSelected = function (currentIndex) {

    $scope.list.forEach(function (element, index) {
      if(index == currentIndex){
        element.selected = true;
      }else{
        element.selected = false;
      }
    });

  };

  $scope.setCurrentSlideIndex = function (index) {
    $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
    $scope.currentIndex = index;

  };

  $scope.prevSlide = function () {
    console.log("prev Slide");
    $scope.direction = 'left';
    $scope.currentIndex = ($scope.currentIndex < $scope.list.length - 1) ? ++$scope.currentIndex : 0;
    $scope.updateSelected($scope.currentIndex);
  };

  $scope.nextSlide = function () {
    console.log("next Slide");
    $scope.direction = 'right';
    $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.list.length - 1;
    $scope.updateSelected($scope.currentIndex);
  };

  this.addItem = function(item){
    console.log(item);
    $scope.list.push(item)
  };

});


appSlide.directive('formSlide',function(){
  return{
    restrict:'EC',
    transclude:true,
    replace : true,
    controller:'slideController',
    templateUrl: '/angular-admin/templates/controls.tpl.html',
    link:function(scope,iElement,attr,ctrl){

      scope.updateSelected(0);

    }
  }
});


appSlide.directive('sectionItem',function () {
  return{
    require: '^formSlide',
    restrict : 'E',
    transclude: true,
    replace: true,
    scope: {
      title: '@nameItem'
    },
    link : function(scope, element, attrs, superController) {

      scope.selected = false;
      superController.addItem(scope);

    },
    template : '<section ng-transclude ng-class="{present : selected}"></section>'
  }
});