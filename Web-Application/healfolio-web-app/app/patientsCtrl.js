/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientsCtrl', function ($scope, $firebaseArray, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
//    $scope.patients = {};

//    var ref = firebase.database().ref().child("patients");

    // create a synchronized array
//    $scope.patients = $firebaseArray(ref);

    $scope.doctor = {};
    $scope.patients = [];

    $scope.doctor_id_num = 123456789; //This here will come from some form of current User variable
    var ref_doctors = firebase.database().ref().child("doctors");
    var ref_patients = firebase.database().ref().child("patients");

    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire doctors object
    var doctor_info = $firebaseArray(ref_doctors);
    var patient_info = $firebaseArray(ref_patients);


    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
    doctor_info.$loaded()
        .then(function(){
            $scope.doctor = doctor_info.$getRecord($scope.doctor_id_num);

            patient_info.$loaded()
                .then(function(){
//                    console.log(patient_info.$getRecord(patient_id_num));

                    //iterating over an object in javascript, you need to the ".hasOwnProperty" attribute
                    for (var patient_id_num in $scope.doctor.patients) {
                        if (!$scope.doctor.patients.hasOwnProperty(patient_id_num)) {
                            //The current property is not a direct property of $scope.doctor.patients
                            continue;
                        }
                        //Do your logic with the property here
//                        console.log(patient_id_num);
                        $scope.patients.push(patient_info.$getRecord(patient_id_num));
                    }
                })
                .catch(function(error){
                    console.log(error);
                });

        })
        .catch(function(error){
            console.log(error);
        });

    $scope.columns = [
        {text:"ID",predicate:"id_num",sortable:true,dataType:"number"},
        {text:"First Names",predicate:"first_names",sortable:true},
        {text:"Last Name",predicate:"lastname",sortable:true},
        {text:"Date of Birth",predicate:"date_of_birth",sortable:true,dataType:"number"},
        {text:"Gender",predicate:"gender",sortable:true},
        {text:"Race",predicate:"race",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];
});

app.controller('patientsDashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.patient = {};

//    var ref = firebase.database().ref().child("patients/"+$routeParams.patientId);
//    $scope.patient = $firebaseObject(ref.child($routeParams.patientId));

    var ref = firebase.database().ref().child("patients");
    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
    var patient_info = $firebaseArray(ref);

    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
    patient_info.$loaded()
        .then(function(){
            $scope.patient = patient_info.$getRecord($routeParams.patientId);
        })
        .catch(function(error){
            console.log(error);
        });

});

app.controller('patientDoctorRequestsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.doctor_requests = {};


//    var ref = firebase.database().ref().child("patients/"+$routeParams.patientId);
//    $scope.patient = $firebaseObject(ref.child($routeParams.patientId));

    var ref = firebase.database().ref().child("patients").child($rootScope.user_auth.id_num).child('doctor_requests');
    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
    $scope.doctor_requests = $firebaseArray(ref);

    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
    $scope.doctor_requests.$loaded()
        .then(function(){
//            console.log($scope.doctor_requests);
        })
        .catch(function(error){
            console.log(error);
        });

    var database = firebase.database();
    $scope.doctorAccept = function(paramDoctor){
        var key = $rootScope.user_auth.id_num;
        var doc_obj = {};
        doc_obj[key] = true;


        database.ref('doctors').child(paramDoctor.$id).child('patients').set(doc_obj)
            .then(function(){
                //Success Callback
                console.log("Request accepted successfully!");
                $scope.doctor_requests.$remove(paramDoctor);
            })
            .catch(function(error){
                console.log(error);
            });
    };


    $scope.columns = [
        {text:"Doctor",predicate:"first_name",sortable:true},
        {text:"ID",predicate:"id_num",sortable:true,dataType:"number"},
        {text:"Practice Number",predicate:"date_of_birth",sortable:true,dataType:"number"},
        {text:"Practice Name",predicate:"gender",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];

});


