var appSlide = angular.module('appSlidesRemote',[]);

appSlide.config = {
  size : {
    width  : '960',
    height : '700'
  },
  currentSlide : 0,
  direction : 'left',
};

// Interface communication
appSlide.factory('API', function() {

  return {
    event           : undefined,
    setCurrentSlide : undefined,
    changeSlide     : undefined,
    changeComponent : undefined
  };

});

appSlide.controller('slideController',function ($scope, API) {
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

    if(API.changeSlide){
      API.changeSlide(currentIndex);
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


  /// Update Changes
  $scope.$watch(function () {
    return API.event
  }, function (newVal) {

    if(newVal) {

      var eventName = API.event.name;
      var data = API.event.data;

      //console.log("event", API.event);

      switch (eventName) {
        case "ChangeSlide" :
          $scope.updateSelected(data.currentSlide);
          break;
      }

    }

  });


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
