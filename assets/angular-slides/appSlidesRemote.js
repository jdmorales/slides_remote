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
    return API.event;
  }, function (newVal) {

    if(newVal) {

      var eventName = API.event.name;
      var data = API.event.data;

      switch (eventName) {
        case "ChangeSlide" :
          $scope.updateSelected(data.currentSlide); break;
      }

    }

  });


});

appSlide.directive('formSlide',function(){
  return{
    restrict:'EC',
    transclude:true,
    replace : true,
    controller :'slideController',
    template: '<div ng-transclude class="content_slide"></div>',
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

      window.addEventListener("load",function(){

        scope.style = {
          top: function () {
            var top = 0;

            top = (sizeSlide.height - $element.height()) / 2;

            return top + 'px';
          }
        };

        scope.$apply();
      });

    },
    template : '<section ng-transclude ng-style="style" ng-class="{present : selected}"></section>'
  }
});

///////////////////////////// Components /////////////////////////////


appSlide.directive('checkList', function () {
  return{
    restrict : 'E',
    transclude: true,
    replace: true,
    controller: ['$scope', 'API', function ($scope, API) {
      var items = [];
      const componentType = "checkList";

      var existItem = function (itemChange) {

        for (var i=0; i < items.length ; i++){
          if (items[i].$id == itemChange.id) {
            return {
              index : i
            };
          }
        }

        return false;
      };

      this.addItem = function (itemScope) {
        items.push(itemScope);
      };

      this.checkedItem = function (itemScope) {

        if(API.changeComponent){
          API.changeComponent($scope.toJSON(itemScope))
        }

      };


      $scope.toJSON = function (itemChange) {

        var itemsJSON = items.map(function (item) {
          return item.toJSON();
        });

        return{
          componentType : componentType,
          id            : $scope.$id,
          items         : itemsJSON,
          itemChange    : itemChange
        }

      };

      $scope.updateComponent = function (data) {

        if(data.id == $scope.$id){
          var item = existItem(data.itemChange);
          if(item){
            items[item.index].updateItem(data.itemChange);
          }
        }

      };

      /// Update Changes
      $scope.$watch(function () {
        return API.event;
      }, function (newVal) {

        if(newVal) {


          var eventName   = API.event.name;
          var data        = API.event.data;
          const typeEvent = "changeComponent";

          if(eventName === typeEvent){
            var component = data.component;
            if(component.componentType === componentType){
              $scope.updateComponent(component);
            }
          }


        }

      });

    }],
    template : '<ul class="item-list" ng-transclude></ul>'
  }
});


appSlide.directive('itemList', function () {
  return{
    require : '^checkList',
    restrict : 'E',
    replace : true,
    scope: {
      text : '@itemText'
    },
    link : function(scope, element, attrs, superController) {

      scope.checked = false;

      scope.toJSON = function () {
        return{
          id      : scope.$id,
          text    : scope.text,
          checked : scope.checked
        }
      };

      superController.addItem(scope);

      scope.updateItem  = function (dataUpdate) {
        scope.checked = dataUpdate.checked;
        scope.$apply();
      };

      scope.checkedItem = function () {
        scope.checked != scope.checked;
        superController.checkedItem(scope.toJSON());
      }

    },
    templateUrl: '/angular-slides/templates/itemList.tpl.html'
  }
});
