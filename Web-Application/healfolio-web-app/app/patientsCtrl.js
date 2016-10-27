/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientViewDoctorsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.doctors = [];

    var patient_id_num = $rootScope.user_auth.id_num;
    var ref_patients = firebase.database().ref().child("patients").child(patient_id_num).child("doctors");
    //  create a synchronized array
    var patient_doctors = $firebaseArray(ref_patients);
    patient_doctors.$loaded()
        .then(function(){

            for (var i = 0; i < patient_doctors.length; i++){
                var doc_id_num = patient_doctors[i].$value;
                var doc_ref = firebase.database().ref().child('doctors/'+doc_id_num);
                var doc_obj = $firebaseObject(doc_ref);
                $scope.doctors.push(doc_obj);
            }

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
    $scope.chkbx_edit_diag = false;
    $scope.patient = {};

    var ref_patient = firebase.database().ref().child("patients/"+$routeParams.patientId);
    //  create a synchronized array
    var patient_info = $firebaseObject(ref_patient);

    patient_info.$loaded()
        .then(function(){
            $scope.patient = patient_info;
        })
        .catch(function(error){
            console.log(error)
        });


    //Display Diagnosis Records
    $scope.diagnosis = [];
    var ref_diag = firebase.database().ref().child("diagnosis/" + $routeParams.patientId);
    $scope.diagnosis = $firebaseArray(ref_diag);

    $scope.diag_columns = [
        {text:"Date",predicate:"id_num",sortable:true},
        {text:"Title/Summary",predicate:"title",sortable:true},
        {text:"Practice",predicate:"practice_name",sortable:true},
        {text:"Doctor",predicate:"doctor_name",sortable:true}
    ];

    //Display Prescription Records
    $scope.prescriptions = [];
    var presc_ref = firebase.database().ref().child("prescriptions/" + $routeParams.patientId);
    $scope.prescriptions = $firebaseArray(presc_ref);

    $scope.presc_columns = [
        {text:"Date",predicate:"id_num",sortable:true},
        {text:"Diagnosis Summary",predicate:"title",sortable:true},
        {text:"Practice",predicate:"practice_name",sortable:true},
        {text:"Doctor",predicate:"doctor_name",sortable:true}
    ];


    //Javascript tab handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //Javascript modal element
    $scope.modal_diag = {};
    $scope.show_update_diag_success = false;

    $scope.openDiag = function(paramDiag){
        $scope.modal_diag = paramDiag;
        $('#diagModal').modal('show');
    };

    $scope.updateDiagnosis = function(paramModalDiag){
//        console.log(paramModalDiag);
        $scope.diagnosis.$save(paramModalDiag);
//        console.log("Diagnosis information updated successfully!");
        $scope.show_update_diag_success = true;
        $scope.chkbx_edit_diag = false;
    };

    //Hide Alert that displays success message when Diagnosis has been updated successfully.
    $scope.hide_update_diag_success = function(){
        $scope.show_update_diag_success = false;
    };

    $scope.modal_presc = {};
    $scope.openPresc = function(paramPresc){
        $scope.modal_presc = paramPresc;
        $('#prescModal').modal('show');
    };


});

app.controller('patientDoctorRequestsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.doctor_requests = [];
    var patient_id = $rootScope.user_auth.id_num;

    var ref = firebase.database().ref().child("patients").child(patient_id).child('doctor_requests');
    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
//    $scope.doctor_requests = $firebaseArray(ref);
    var doc_requests = $firebaseArray(ref);

    //Asynchronous function,  use a promise("$loaded") to before manipulating data
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
                        //Try convert "doc_requests.$loaded" int a function that can be called here to reload "$scope.doctor_requests"
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


