var adminSlidesRemote = angular.module('adminSlidesRemote',['appSlidesRemote'])


adminSlidesRemote.controller('CtrlSlide',function($scope, $http, $window, API){

  var eventUser = {
    changeSlide : {
      userId    : undefined
    },
    changeComponent : {
      userId    : undefined
    }
  };

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

    io.socket.post('/app/suscribe_live_slide',data);

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


  ///////////// API for Ctrl Slide  ///////////////////////

  var isAdmin = function () {

    if($scope.user && $scope.author) {
      if ($scope.user.id == $scope.author.id) {
        return true;
      }
    }

    return false;
  };

  API.changeSlide = function (currentSlide){
    if(isAdmin()){
      if(!eventUser.changeSlide.userId){
        var data = {idSlide : $scope.slide.id , currentSlide : currentSlide};
        io.socket.post('/app/changes_status_slide',data);
      }
      eventUser.changeSlide.userId = undefined
    }
  };

  // API for change Component
  API.changeComponent = function (component){
    if(isAdmin()){
      if(!eventUser.changeComponent.userId) {
        var data = {idSlide: $scope.slide.id, component: component};
        io.socket.post('/app/changes_status_component', data);
      }
      eventUser.changeComponent.userId = undefined
    }
  };

  /////////////////////// METHODS ////////////////////////////
  function isMySelf(userID) {
    return (userID === $scope.user.id) ? true : false;
  }

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

  function changeStatePublish(publish, slide) {
    if(!publish){
      //$scope.slide.activeUsers = slide.activeUsers;
      $window.location.href = $window.location.origin
    }
  };

  function changeStateSlide(data) {
    API.event = {
      name : "ChangeSlide",
      data : {
        currentSlide : data.currentSlide
      }
    };

    eventUser.changeSlide = {
      userId    : data.userId
    };

    $scope.$apply();
  }

  function changeComponent(data) {
    API.event = {
      name : 'changeComponent',
      data : data
    };

    eventUser.changeComponent = {
      userId    : data.userId
    };

    $scope.$apply();
  }

  //////////////// WEB SOCKET EVENTS /////////////////////////
  io.socket.on('slide', function onServerSentEvent (msg) {

    if(msg.verb == "updated"){
      var data = msg.data.data;
      //console.log(msg);
      switch (msg.data.action){
        case 'unsubscribeUser'  : AddDeleteUser(false, data.user); break;
        case 'subscribeUser'    : AddDeleteUser(true, data.user); break;
        case 'offlineSlide'     : changeStatePublish(false, data); break;
        case 'changeStateSlide' : changeStateSlide(data); break;
        case 'changeComponent'  : changeComponent(data); break;
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
