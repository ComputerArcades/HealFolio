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
//                console.log('Authentication successful');
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

    $scope.select_doctor = function(){
        $location.path("/doctor_signup");
    };

    $scope.select_patient = function(){
        $location.path("/patient_signup");
    };

    $scope.doctor = {};
    $scope.doctor = {first_name:'',last_name:'',email:'',password:'',id_num:'',practice_number:'',practice_name:'',cell_phone:''};
    $scope.doctorSignUp = function(paramDoctor){
        $scope.doctor_email = "user1@healfolio.com";
        $scope.doctor_password = "healfolio";

//        firebase.auth().createUserWithEmailAndPassword($scope.doctor_email, $scope.doctor_password).catch(function(error) {
//            // Handle Errors here.
//            console.log("Error Code: " + error.code);
//            console.log("Error Message: " + error.message);
//        });

        firebase.auth().createUserWithEmailAndPassword($scope.doctor_email, $scope.doctor_password)
            .then(function(user){
                console.log("Doctor added successfully!");
                console.log(user);
            },function(error){
                //Failure callback
                console.log(error);
            });


    };


});

