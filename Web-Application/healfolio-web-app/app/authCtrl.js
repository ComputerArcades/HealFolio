app.controller('authCtrl',function ($scope, $firebaseObject,$firebaseAuth,$rootScope,$route, $routeParams, $location) {

    $scope.login = {};
    $scope.login = {email:'',password:''};
    $rootScope.hide_navbar = true;


    $scope.Auth = $firebaseAuth();

    $scope.doLogin = function (paramUser) {

        $scope.Auth.$signInWithEmailAndPassword(
            paramUser.email,
            paramUser.password
        )
            .then(function(user) {
                // Success callback
                $rootScope.hide_navbar = false;
                $rootScope.displayName = user.displayName;
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


    //Sign up a new doctor
    $scope.doctor = {};
    $scope.doctor = {first_name:'',last_name:'',email:'',password:'',id_num:'',practice_number:'',practice_name:'',cell_phone:''};
    $scope.doctorSignUp = function(){
//        $scope.doctor_email = "user1@healfolio.com";
//        $scope.doctor_password = "healfolio";

        //Create a new user into the firebase authentication database object
        firebase.auth().createUserWithEmailAndPassword($scope.doctor.email, $scope.doctor.password)
            .then(function(user){

                //Update the users display name to their first name in the firebase authentication database object
                user.updateProfile({
                   displayName: $scope.doctor.first_name
                }).then(function() {
                    // Update successful.
                }, function(error) {
                    // An error happened.
                });

                var database = firebase.database();

                //Add the new user (user id + account type) to the firebase auth db object
                database.ref('users/'+user.uid).set({
                    id_num: $scope.doctor.id_num,
                    account_type: 'doctor'
                });

                //Add the new users' basic details to their respective db object
                database.ref('doctors/'+$scope.doctor.id_num).set({
                    first_name: $scope.doctor.first_name,
                    last_name: $scope.doctor.last_name,
                    email: user.email,
                    cell_phone: $scope.doctor.cell_phone,
                    practice_number: $scope.doctor.practice_number,
                    practice_name: $scope.doctor.practice_name

                });

                console.log("Doctor added successfully!");
                $rootScope.authenticated = true;
                $location.path("/");

            },function(error){
                //Failure callback
                console.log(error);
            });


    };

    $scope.patient = {};
    $scope.patient = {id_num:'',first_name:'',last_name:'',email:'',password:'',date_of_birth:'',gender:''};

    $scope.patientSignUp = function(){
        //Create a new user into the firebase authentication database object
        firebase.auth().createUserWithEmailAndPassword($scope.patient.email,$scope.patient.password)
            .then(function(user){

                //Update the users display name to their first name in the firebase authentication database object
                user.updateProfile({
                    displayName: $scope.patient.first_name
                }).then(function() {
                    // Update successful.
                }, function(error) {
                    // An error happened.
                });

                var database = firebase.database();

                //Add the new user (user id + account type) to the firebase auth db object
                database.ref('users/'+user.uid).set({
                    id_num: $scope.patient.id_num,
                    account_type: 'patient'
                });

                //Add the new users' basic details to their respective db object
                database.ref('patients/'+$scope.patient.id_num).set({
                    first_name: $scope.patient.first_name,
                    last_name: $scope.patient.last_name,
                    date_of_birth: $scope.patient.date_of_birth,
                    gender: $scope.patient.gender,
                    email: $scope.patient.email,
                    cell_phone: $scope.patient.cell_phone
                });

                console.log("Patient added successfully!");
                $rootScope.authenticated = true;
                $location.path("/");
            },function(error){
                //Failure callback
                console.log(error);
            });
    };


});

