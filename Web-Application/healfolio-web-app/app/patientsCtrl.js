/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientsCtrl', function ($scope, $firebaseArray, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
//    $scope.patients = {};

//    var ref = firebase.database().ref().child("patients");

    // create a synchronized array
//    $scope.patients = $firebaseArray(ref);

    $scope.patient = {};
    $scope.doctors = [];

//    $scope.doctor_id_num = 123456789; //This here will come from some form of current User variable
    $scope.patient_id_num = $routeParams.patientId;
    var ref_doctors = firebase.database().ref().child("doctors");
    var ref_patients = firebase.database().ref().child("patients");

    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire doctors object
    var doctor_info = $firebaseArray(ref_doctors);
    var patient_info = $firebaseArray(ref_patients);


    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
    patient_info.$loaded()
        .then(function(){
            $scope.patient = patient_info.$getRecord($scope.patient_id_num);

            doctor_info.$loaded()
                .then(function(){

                    //iterating over an object in javascript, you need to the ".hasOwnProperty" attribute
                    for (var doctor_id_num in $scope.patient.doctors) {
                        if (!$scope.patient.doctors.hasOwnProperty(doctor_id_num)) {
                            //The current property is not a direct property of $scope.doctor.patients
                            continue;
                        }
                        //Do your logic with the property here
//                        console.log(patient_id_num);
                        $scope.doctors.push(doctor_info.$getRecord(doctor_id_num));
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
        {text:"Doctor",predicate:"first_name",sortable:true},
        {text:"ID",predicate:"id_num",sortable:true,dataType:"number"},
        {text:"Practice Name",predicate:"gender",sortable:true},
        {text:"Practice Number",predicate:"date_of_birth",sortable:true,dataType:"number"},
        {text:"Action",predicate:"",sortable:false}
    ];
});

app.controller('patientsDashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
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
            $scope.patient = patient_info.$getRecord($routeParams.patientId);
        })
        .catch(function(error){
            console.log(error);
        });


    //Javascript tag handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //Display Diagnosis Records
    $scope.diagnosis = [];

    var ref_diag = firebase.database().ref().child("diagnosis");
//    var ref_diag = firebase.database().ref().child("diagnosis/" + $routeParams.patientId);

    var diag_info = $firebaseArray(ref_diag);

    $scope.patient_diag = {};
    diag_info.$loaded()
        .then(function(){
//            var t_id = 1476505305171;
            $scope.patient_diag = diag_info.$getRecord($routeParams.patientId);
//            $scope.diagnosis = diag_info.$getRecord(t_id);
//            console.log(diag_info.$getRecord($routeParams.patientId));

//            for (var temp in $scope.patient_diag){
//                if (!$scope.patient_diag.hasOwnProperty){
//                    continue;
//                }
//                console.log(temp);
//            }


//            console.log($scope.diagnosis[t_id]);
//
//            for (var timestamp_id in diag_info){
//                if(!diag_info.hasOwnProperty(timestamp_id)){
//                    continue;
//                }
//                //Add record to Array
//                console.log(diag_info.$getRecord(timestamp_id));
////                $scope.diagnosis.push(diag_info.$getRecord(timestamp_id));
//
//            }

//            console.log(diag_info.$getRecord($routeParams.patientId));
//            console.log($scope.diagnosis);
        })
        .catch(function(error){
            console.log(error);
        });
    $scope.columns = [
        {text:"Date",predicate:"id_num",sortable:true,dataType:"number"},
        {text:"Title/Summary",predicate:"title",sortable:true},
        {text:"Practice",predicate:"practice_name",sortable:true},
        {text:"Doctor",predicate:"doctor_name",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];


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

                var key = paramDoctor.$id;
                var pat_obj = {};
                pat_obj[key] = true;
                database.ref('patients').child($rootScope.user_auth.id_num).child('doctors').set(pat_obj)
                    .then(function(){
                        //Success Callback

                        alert("Doctor request has been accepted!");
                        $scope.doctor_requests.$remove(paramDoctor);
                    })
                    .catch(function(error){
                        console.log(error);
                    });
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


