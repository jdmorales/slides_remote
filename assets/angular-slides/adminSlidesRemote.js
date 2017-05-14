var adminSlidesRemote = angular.module('adminSlidesRemote',['appSlidesRemote'])


adminSlidesRemote.controller('CtrlSlide',function($scope, $http){

  $scope.initSlide = function(id,slug){
    $scope.slide = {
      slug        : slug,
      id          : id
    };

    $scope.initLiveSlide();

  };

  $scope.suscribe = function (subscribe) {

    var data = {
      id        : $scope.slide.id,
      subscribe : subscribe
    };

    io.socket.post('/app/suscribe_live_slide',data, function (resData, jwRes) {
      if(jwRes.statusCode){

        console.log("restData", resData);

      }
    });

  };

  $scope.initLiveSlide = function () {

    $http.post('/app/get_slide', {slug : $scope.slide.slug })
      .then(
        function (response) { // Success
          //console.log(response);

          $scope.slide  = response.data.slide;
          $scope.author = response.data.author;
          $scope.user   = response.data.user;

          $scope.suscribe(true);

        },
        function (response) { //Error
          console.log(response)
        });

  };


  ///////////////////////////////////////////////////

  function AddDeleteUser (isAdd,user) {

    if(!isAdd){
      var indexRemove;

      $scope.slide.activeUsers.filter(function(userAct, index){
        if(userAct.id == user.id){
          indexRemove = index;
          return true;
        }
      });

      $scope.slide.activeUsers.splice(indexRemove,1);
    }else{
      $scope.slide.activeUsers.push(user)
    }

    $scope.$apply();
  };

  io.socket.on('slide', function onServerSentEvent (msg) {

    if(msg.verb == "updated"){
       var data = msg.data.data;
      switch (msg.data.action){
        case 'unsubscribeUser' : AddDeleteUser(false, data.user); break;
        case 'subscribeUser'   : AddDeleteUser(true, data.user); break;
      }
    }

  });

});




adminSlidesRemote.directive('adminControl',function($window){
  return{
    restrict:'E',
    replace : true,
    scope : {
      slide  : '=',
      user   : '=',
      author : '='
    },
    templateUrl: '/angular-slides/templates/admin-control.tpl.html',
    link:function(scope,element,attr,ctrl){

      scope.activated = false;

      scope.openPanel = function () {
        scope.activated = !scope.activated;
      };

      scope.publishSlide = function(){

        scope.slide.published = !scope.slide.published;

        var data = {
          id        :   scope.slide.id,
          published :   scope.slide.published
        };

        io.socket.post('/admin/publishSlide',data, function (resData, jwRes) {

          if(jwRes.statusCode){

            console.log("Data published", resData);

            var path = (scope.slide.published) ? "/app/live_slide/" : "/app/preview_slide/";

            $window.location.href = $window.location.origin + path + scope.slide.slug;

          }
        });

      };

      scope.exitSlide = function () {
        console.log(scope);
        scope.$parent.suscribe(false);
        $window.location.href = $window.location.origin + "/admin";
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


