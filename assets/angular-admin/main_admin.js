var appAdmin = angular.module('adminSlidesRemote',[]);

appAdmin.config(['$httpProvider','$locationProvider', function($httpProvider, $locationProvider) {
  // Expose XHR requests to server
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // This is `false` by default
  $locationProvider.html5Mode(true);
}
]);


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
      console.log("asdasdsadasdasda");

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




