app.controller('authCtrl',function ($scope, $firebaseObject,$firebaseAuth,$rootScope,$route, $routeParams, $location) {

    $scope.login = {};
    $scope.login = {email:'',password:''};
    $rootScope.authenticated = false;

//    console.log(firebase.User);
    $scope.Auth = $firebaseAuth();

    $scope.doLogin = function (paramUser) {

        $scope.Auth.$signInWithEmailAndPassword(
            paramUser.email,
            paramUser.password
        )
            .then(function(user) {
                // Success callback
                console.log('Authentication successful');
                $rootScope.authenticated = true;
                $location.path("/");
//
            }, function(error) {
                // Failure callback
                console.log("error: " + error);
            });

        //Sign in using firebase.auth()
//        firebase.auth().signInWithEmailAndPassword(paramUser.email, paramUser.password).catch(function(error) {
//            // Handle Errors here.
//            var errorCode = error.code;
//            var errorMessage = error.message;
//            // ...
//            if (error){
//                console.log(error.message);
//            }else{
//                console.log("No error");
//            }
//        }

//        firebase.auth().onAuthStateChanged(function(user) {
//            $rootScope.authenticated = false;
//            if (user) {
//                // User is signed in.
//                $rootScope.authenticated = true;
////                console.log("User is signed in!");
//                $location.path("/");
//                $scope.apply();
//                $route.reload();
//            } else {
//                // No user is signed in.
//                console.log("No user is signed in!");
//            }
//        });


    };


});

