var appAdmin = angular.module('adminSlidesRemote',[]);

appAdmin.controller('showSlidesLive',function ($scope){

  //$scope.slides;
  $scope.slides = [];

  io.socket.post('/admin/liveSlides',{}, function (resData, jwRes) {
    console.log("jwRes.statusCode",jwRes.statusCode);

    if(jwRes.statusCode){

      $scope.slides = resData;
      $scope.$apply();

    }
  });

  io.socket.on('slideLive', function onServerSentEvent (msg) {

    function putOnline() {
      $scope.slides.push(msg.data);
      $scope.$apply();
    }

    function putOffline() {
      var indexRemove;

      $scope.slides.filter(function(slide, index){
        if(slide.id == msg.data.id){
          indexRemove = index;
          return true;
        }
      });

      $scope.slides.splice(indexRemove,1);
      $scope.$apply();
    }

    // Let's see what the server has to say...
    switch(msg.verb) {
      case 'online': putOnline(); break;
      case 'offline' : putOffline(); break;
      default: return; // ignore any unrecognized messages
    }

  });

});

appAdmin.controller('createSlide',function($scope,$http,$window){

  $scope.slide = {
    title : '',
    description : '',
    template : ''
  };

  $scope.inputError = {
    title : {
      error : false,
      message : '',
    },
    description : {
      error : false,
      message : '',
    },
    template :{
      error : false,
      message : '',
    }
  };

  $scope.saveSlide = function () {

    $http.post('/admin/save_slide', angular.toJson($scope.slide))
      .then(
        function (response) { // Success
          $window.location.href = $window.location.origin + "/admin/my_slides";
        },
        function (response) { //Error
          var attr = response.data.invalidAttributes;

          if(attr){
            if(attr.title){
              $scope.inputError.title.error   = true;
              $scope.inputError.title.message = "Ya existe este nombre";
            }
          }

        })
  };

});

appAdmin.controller('editeSlide',function($scope,$http,$window){

  $scope.slide = {
    idSlide : '',
    title : '',
    description : '',
    template : '',
  };


  $scope.message = {
    error : false
  };


  $scope.publishSlide = function() {
    var data ={
      id        :   $scope.slide.idSlide,
      published : $scope.slidePublished
    };

    io.socket.post('/admin/publishSlide',data, function (resData, jwRes) {
      if(jwRes.statusCode){
      }
    });

  };


  $scope.inputError = {
    title : {
      error : false,
      message : '',
    },
    description : {
      error : false,
      message : '',
    },
    template :{
      error : false,
      message : '',
    }
  };

  $scope.init= function(id,title, description, template,message){
    $scope.slide = {
      idSlide : id,
      title : title,
      description : description,
      template : template
    };

    if(message){
      $scope.message = message;
      if(message.code == 1){
        $scope.message.error = true;
      }
    }

  };

  $scope.saveSlide = function () {

    if(!$scope.message.error){

      $http.post('/admin/edite_slide', angular.toJson($scope.slide))
        .then(
          function (response) { // Success
            $window.location.href = $window.location.origin + "/admin/my_slides";
          },
          function (response) { //Error
            var attr = response.data.invalidAttributes;

            if(attr){
              if(attr.title){
                $scope.inputError.title.error   = true;
                $scope.inputError.title.message = "Ya existe este nombre";
              }
            }

          })
    }

  };


});

appAdmin.directive('cardSlide', function () {
  return{
    restrict:'E',
    replace : true,
    scope : {
      slide : '='
    },
    templateUrl: '/angular-admin/templates/card-slide.tpl.html',
    link:function(scope,element,attr,ctrl){


    }
  }
});
