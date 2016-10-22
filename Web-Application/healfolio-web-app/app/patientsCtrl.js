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

app.controller('viewPatientCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
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


    //Javascript tab handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //Javascript modal element
    $scope.modal_diag = {};
    $scope.openDiag = function(paramDiag){
        $scope.modal_diag = paramDiag;
        $('#diagModal').modal('show');
    };
    $scope.chkbx_edit_diag = false;

    //Display Diagnosis Records
    $scope.diagnosis = [];

//    var ref_diag = firebase.database().ref().child("diagnosis");
    var ref_diag = firebase.database().ref().child("diagnosis/" + $routeParams.patientId);

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
        {text:"Doctor",predicate:"doctor_name",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];

    //Display Prescription Records
    $scope.prescriptions = [];
    var presc_ref = firebase.database().ref().child("prescriptions/" + $routeParams.patientId);
    $scope.prescriptions = $firebaseArray(presc_ref);

    $scope.presc_columns = [
        {text:"Date",predicate:"id_num",sortable:true},
        {text:"Diagnosis Summary",predicate:"title",sortable:true},
        {text:"Practice",predicate:"practice_name",sortable:true},
        {text:"Doctor",predicate:"doctor_name",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];


});

app.controller('patientDoctorRequestsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.doctor_requests = [];
    var patient_id = $rootScope.user_auth.id_num;


//    var ref = firebase.database().ref().child("patients/"+$routeParams.patientId);
//    $scope.patient = $firebaseObject(ref.child($routeParams.patientId));
//    var patient_id = 4654511666648;
//    var ref = firebase.database().ref().child("patients").child($rootScope.user_auth.id_num).child('doctor_requests');
    var ref = firebase.database().ref().child("patients").child(patient_id).child('doctor_requests');
    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
//    $scope.doctor_requests = $firebaseArray(ref);
    var doc_requests = $firebaseArray(ref);

    //Due to asynchronous function, you need to use a promise("$loaded") to update the $scope otherwise "$getRecord()" will always return a "null"
    doc_requests.$loaded()
        .then(function(){

            for (var i = 0; i < doc_requests.length; i++){//
                var doc_id_num = doc_requests[i].$value;
                var doc_ref = firebase.database().ref().child('doctors/'+doc_id_num);
                var doc_obj = $firebaseObject(doc_ref);
                doc_obj.$key = doc_requests[i].$id;
                $scope.doctor_requests.push(doc_obj);
            }
        })
        .catch(function(error){
            console.log(error);
        });

    $scope.doctorAccept = function(paramDoctor){

        var doctors_ref = firebase.database().ref('doctors').child(paramDoctor.$id).child('patients');
        var doctor_patients = $firebaseArray(doctors_ref);
        doctor_patients.$loaded()
            .then(function(){
                doctor_patients.$add(patient_id);
                var patients_ref = firebase.database().ref().child("patients").child(patient_id).child('doctors');
                //  create a synchronized array
                var patient_doctors = $firebaseArray(patients_ref);
                patient_doctors.$loaded()
                    .then(function(){
                        patient_doctors.$add(paramDoctor.$id);
                        doc_requests.$remove(doc_requests.$getRecord(paramDoctor.$key));
                        alert("Doctor request has been accepted!");
                        //FIX: Data binding by using $scope.doctor_requests.pop(paramDoctor.$id) doesn't work here
                        //the Doctor Id was repeated for whichever object was selected first.
                        //Reloading the page doesn't work either.
                    })
                    .catch(function(error){
                        console.log(error)
                    });
            })
            .catch(function(error){
                console.log(error)
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


