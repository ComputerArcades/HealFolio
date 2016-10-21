app.controller('dashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {

    //Javascript tag handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

//    This code below will go on the app's Routing function
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
        } else {
            // No user is signed in.
            $location.path("/login");
//            console.log("No user is signed in!");
        }
    });

    //Retrieve the user that has been authenticated
    var user = firebase.auth().currentUser;
    $rootScope.user_auth = {};
    $scope.user_status = false;

    //FIX: Rather use this in the app's Routing function
    if(user){
        var ref = firebase.database().ref("users").child(user.uid);
        // return it as a synchronized object
        $rootScope.user_auth = $firebaseObject(ref);
        $rootScope.user_auth.$loaded()
            .then(function(){
                //success callback
                $scope.user_status = true;

                //FIX THIS LATER
                if($rootScope.user_auth.account_type == 'patient'){

                    $scope.patient = {};

//    var ref = firebase.database().ref().child("patients/"+$routeParams.patientId);
//    $scope.patient = $firebaseObject(ref.child($routeParams.patientId));

                    var ref_patient = firebase.database().ref().child("patients");
                    //  create a synchronized array
                    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
                    var patient_info = $firebaseArray(ref_patient);

                    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
                    patient_info.$loaded()
                        .then(function(){
                            $scope.patient = patient_info.$getRecord($rootScope.user_auth.id_num);
                        })
                        .catch(function(error){
                            console.log(error);
                        });



                    //Display Diagnosis Records
                    $scope.diagnosis = [];

//    var ref_diag = firebase.database().ref().child("diagnosis");
                    var ref_diag = firebase.database().ref().child("diagnosis/" + $rootScope.user_auth.id_num);

//    var diag_info = $firebaseArray(ref_diag);
                    $scope.diagnosis = $firebaseArray(ref_diag);

//    diag_info.$loaded()
//        .then(function(){
//            $scope.diagnosis = diag_info.$getRecord($routeParams.patientId);
////
//        })
//        .catch(function(error){
//            console.log(error);
//        });

                    $scope.diag_columns = [
                        {text:"Date",predicate:"id_num",sortable:true},
                        {text:"Title/Summary",predicate:"title",sortable:true},
                        {text:"Practice",predicate:"practice_name",sortable:true},
                        {text:"Doctor",predicate:"doctor_name",sortable:true}
                    ];

                    //Display Prescription Records
                    $scope.prescriptions = [];
                    var presc_ref = firebase.database().ref().child("prescriptions/" + $rootScope.user_auth.id_num);
                    $scope.prescriptions = $firebaseArray(presc_ref);

                    $scope.presc_columns = [
                        {text:"Date",predicate:"id_num",sortable:true},
                        {text:"Diagnosis Summary",predicate:"title",sortable:true},
                        {text:"Practice",predicate:"practice_name",sortable:true},
                        {text:"Doctor",predicate:"doctor_name",sortable:true}
                    ];


                }

            })
            .catch(function(error){
                //Failure callback
                console.log(error);
            });
    }else{
        console.log("Error: Page was loaded outside the scope of the application!");

        //FIX: Change what happens if $scope does not exist, i.e page refresh problem
        firebase.auth().signOut();
        $location.path("/login");
    }

    $rootScope.doLogout = function(){
        firebase.auth().signOut();
        $location.path("/login");
    };


});

