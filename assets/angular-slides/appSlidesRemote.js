var appSlide = angular.module('appSlidesRemote',[]);

appSlide.config = {
  size : {
    width  : '960',
    height : '700'
  },
  currentSlide : 0,
  direction : 'left',
};

appSlide.API = {
  setCurrentSlide : undefined,
  changeSlide : undefined
};

appSlide.controller('slideController',function ($scope) {
  $scope.direction = appSlide.config.direction;
  $scope.currentIndex = appSlide.config.currentSlide;

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

    if(appSlide.API.changeSlide){
      appSlide.API.changeSlide(currentIndex);
    }

  };

  $scope.setCurrentSlideIndex = function (index) {
    $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
    $scope.currentIndex = index;

  };

  $scope.prevSlide = function () {
    $scope.direction = 'left';
    $scope.currentIndex = ($scope.currentIndex < $scope.list.length - 1) ? ++$scope.currentIndex : 0;
    $scope.updateSelected($scope.currentIndex);
  };

  $scope.nextSlide = function () {
    $scope.direction = 'right';
    $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.list.length - 1;
    $scope.updateSelected($scope.currentIndex);
  };

  this.addItem = function(item){
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
    link:function(scope,element,attr,ctrl){

      scope.updateSelected(0);

      /// Set Size
      var sizeSlide = appSlide.config.size;

      $(element).width(sizeSlide.width+"px");
      $(element).height(sizeSlide.height+"px");

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

      /// Set Size
      var sizeSlide = appSlide.config.size;
      var $element  = $(element);

      scope.style = {
        top :  function () {
          var top = 0;

          top = (sizeSlide.height - $element.height()) / 2;

          return top+'px';
        }
      };


    },
    template : '<section ng-transclude ng-style="style" ng-class="{present : selected}"></section>'
  }
});



