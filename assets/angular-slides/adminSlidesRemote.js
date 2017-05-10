var adminSlidesRemote = angular.module('adminSlidesRemote',['appSlidesRemote'])


adminSlidesRemote.controller('CtrlSlide',function($scope){

  $scope.initSlide = function(id,slug,title, description, published){

    $scope.slide = {
      slug        : slug,
      idSlide     : id,
      title       : title,
      description : description,
      published   : published
    };

    //console.log($scope.slide);
  };

});

adminSlidesRemote.directive('adminControl',function($window){
  return{
    restrict:'E',
    replace : true,
    scope : {
      slide : '='
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

      scope.publishSlide = function(){

        scope.slide.published = !scope.slide.published;

        var data = {
          id        :   scope.slide.idSlide,
          published :   scope.slide.published
        };

        io.socket.post('/admin/publishSlide',data, function (resData, jwRes) {
          if(jwRes.statusCode){

            var path = (scope.slide.published) ? "/app/live_slide/" : "/app/preview_slide/";

            $window.location.href = $window.location.origin + path + scope.slide.slug;

          }
        });

      };


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


