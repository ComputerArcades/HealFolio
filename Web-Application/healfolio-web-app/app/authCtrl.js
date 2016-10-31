app.controller('authCtrl',function ($scope, $firebaseObject,$firebaseAuth,$rootScope,$route, $routeParams, $location, SessionService) {

    $scope.login = {};
    $scope.login = {email:'',password:''};
    $rootScope.hide_navbar = true;
    $scope.show_login_error = false;

    //DELELTE IN PRODUCTION (Debugging only!!!!)
//   $scope.login = {email:'doctor.joe@healfolio.com',password:'healfolio'};
//    $scope.login = {email:'doctor.paul@healfolio.com',password:'healfolio'};
//   $scope.login = {email:'patient.alice@healfolio.com',password:'healfolio'};

    $scope.hide_login_error = function(){
        $scope.show_login_error = false;
    };


    $scope.Auth = $firebaseAuth();

    $scope.doLogin = function (paramUser) {

        $scope.Auth.$signInWithEmailAndPassword(
            paramUser.email,
            paramUser.password
        )
            .then(function(user) {
                // Success callback
                $rootScope.hide_navbar = false;

                var ref = firebase.database().ref("users").child(user.uid);
                var user_auth = $firebaseObject(ref);
                user_auth.$loaded().then(function(){
                    //Saving information in session to keep after refresh
                    SessionService.set("userIdNum", user_auth.id_num);
                    SessionService.set("userAccountType", user_auth.account_type);
                    SessionService.set("userDisplayName", user.displayName);
//                    console.log("Get: " + SessionService.get("userId"));
                    $location.path("/");
                });
//
            }, function(error) {
//                console.log(error);
                $scope.show_login_error = true;
            });


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

        //Create a new user into the firebase authentication database object
        firebase.auth().createUserWithEmailAndPassword($scope.doctor.email, $scope.doctor.password)
            .then(function(user){

                var ref = firebase.database().ref("users").child(user.uid);
                var user_auth = $firebaseObject(ref);
                user_auth.$loaded().then(function(){
                    //Saving information in session to keep after refresh
                    SessionService.set("userIdNum", user_auth.id_num);
                    SessionService.set("userAccountType", user_auth.account_type);
                    SessionService.set("userDisplayName", user.displayName);
//                    console.log("Get: " + SessionService.get("userId"));
                    $location.path("/");
                });

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


app.controller('userProfileCtrl',function($scope, $rootScope, $firebaseObject, $firebaseArray, $routeParams, $location, SessionService){

    $scope.user_auth = {};
    $scope.user_auth.id_num = SessionService.get("userIdNum");
    $rootScope.displayName = SessionService.get("userDisplayName");
    $scope.user_auth.account_type = SessionService.get("userAccountType");

    //Show list of Doctor's patients

    $scope.doctor = {};
    $scope.doctor_id_num = $scope.user_auth.id_num;
    $scope.patients = [];


    if($scope.user_auth.account_type == 'doctor'){

        var ref = firebase.database().ref().child("doctors/" + $scope.user_auth.id_num);
        // return it as a synchronized object
        var doctor_info = $firebaseObject(ref);
        doctor_info.$loaded()
            .then(function(){
                //success callback
                $scope.doctor = doctor_info;
            })
            .catch(function(error){
                //Failure callback
                console.log(error);
            });
    }

    if($scope.user_auth.account_type == 'patient') {

        var patient_ref = firebase.database().ref().child("patients/" + $scope.user_auth.id_num);
        // return it as a synchronized object
        var patient_info = $firebaseObject(patient_ref);
        patient_info.$loaded()
            .then(function(){
                //success callback
                $scope.patient = patient_info;
            })
            .catch(function(error){
                //Failure callback
                console.log(error);
            });

    }

});
