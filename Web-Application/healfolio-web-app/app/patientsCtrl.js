/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientViewDoctorsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location, SessionService) {
    $scope.doctors = [];

    $scope.user_auth = {};
    $scope.user_auth.id_num = SessionService.get("userIdNum");
    $rootScope.displayName = SessionService.get("userDisplayName");
    $scope.user_auth.account_type = SessionService.get("userAccountType");

    var patient_id_num = $scope.user_auth.id_num;
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

    $scope.modal_doc_obj = {};
    $scope.confirmDelete = function(paramDoctor) {
        $scope.modal_doc_obj = paramDoctor;
        $('#confirmDeleteModal').modal('show');
    };

    $scope.confirmYes = function(paramDoc){
        var index = patient_doctors.findIndex(x => x.$value==paramDoc.$id);
        patient_doctors.$remove(index);
        $('#confirmDeleteModal').modal('hide');
    };

    $('#confirmDeleteModal').on('hidden.bs.modal', function(e){
        $location.path('/');
    });



});

app.controller('viewPatientCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location, SessionService) {
    $scope.chkbx_edit_diag = false;
    $scope.patient = {};

    $scope.user_auth = {};
    $scope.user_auth.id_num = SessionService.get("userIdNum");
    $rootScope.displayName = SessionService.get("userDisplayName");
    $scope.user_auth.account_type = SessionService.get("userAccountType");

    //Load Patient Information
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

    //Load Doctor Information, Initialise new diagnosis info input fields
    $scope.diagnosis_info = {};
    $scope.diagnosis_info = {practice_name: '',practice_number:'',doctor_id:'',doctor_name:'',title:'',notes:''};
    $scope.doctor = {};

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



    //Display Diagnosis Records
    $scope.diagnosis = [];
    var ref_diag = firebase.database().ref().child("diagnosis/" + $routeParams.patientId);
    $scope.diagnosis = $firebaseArray(ref_diag);

    $scope.diag_columns = [
        {text:"Date",predicate:"id_num",sortable:true},
        {text:"Title/Summary",predicate:"title",sortable:true},
        {text:"Practice",predicate:"practice_name",sortable:true},
        {text:"Doctor",predicate:"doctor_name",sortable:true},
        {text:"Tag",predicate:"tag",sortable:true}
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
        {text:"Tag",predicate:"tag",sortable:true}
    ];


    //Javascript tab handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    //Javascript modal element
    $scope.modal_diag = {};
    $scope.modal_diag = {practice_name: '',practice_number:'',doctor_id:'',doctor_name:'',title:'',notes:''};
    $scope.modal_follow_up_diag = {};
    $scope.follow_up_diag_info = {};
    $scope.show_update_diag_success = false;
    $scope.add_follow_up_diag_success = false;

    $scope.openDiag = function(paramDiag){
        $scope.modal_diag = paramDiag;
        $('#diagModal').modal('show');
    };

    //Diagnosis Info update
    $scope.updateDiagnosis = function(paramModalDiag){
//        console.log(paramModalDiag);
        $scope.diagnosis.$save(paramModalDiag);
//        console.log("Diagnosis information updated successfully!");
        $scope.show_update_diag_success = true;
        $scope.chkbx_edit_diag = false;
    };
    //Hide Alert that displays success message when a diagnosis has been updated successfully.
    $scope.hide_update_diag_success = function(){
        $scope.show_update_diag_success = false;
    };
    $('#diagModal').on('hidden.bs.modal', function(e){
        $scope.hide_update_diag_success();
    });

    //Hide Alert that displays success message when a follow up diagnosis has been added successfully.
    $scope.hide_add_follow_up_diag_success = function(){
        $scope.add_follow_up_diag_success = false;
    };
    $('#followUpDiagModal').on('hidden.bs.modal', function(e){
        $scope.hide_add_follow_up_diag_success();
        $('#collapsePrescription').collapse('hide');
    });





    //Create Follow Up Diagnosis
    $scope.modal_follow_up_diag = {};
    $scope.modal_follow_up_diag = {practice_name:'',practice_number:'',doctor_id:'',doctor_name:'',orgl_diagnosis_key:'',follow_up_title:'',follow_up_notes:''};


    $scope.openFollowUpDiag = function(paramModalDiag){
        $scope.modal_follow_up_diag_obj = paramModalDiag;
        if(paramModalDiag.tag == 'orgl'){
            $scope.orgl_diagnosis_key = paramModalDiag.$id;
        }else if (paramModalDiag.tag == 'fw-up'){
            $scope.orgl_diagnosis_key = paramModalDiag.orgl_diagnosis_id;
        }

        $scope.modal_follow_up_diag = {
            practice_name: $scope.doctor.practice_name,
            practice_number: $scope.doctor.practice_number,
            doctor_id: $scope.user_auth.id_num,
            doctor_name: $rootScope.displayName,
            orgl_diagnosis_key: $scope.orgl_diagnosis_key,
            follow_up_title:'',
            follow_up_notes:''
        };

        $('#diagModal').modal('hide');
        $('#followUpDiagModal').modal('show');
    };


    $scope.addFollowUpDiagnosis = function(paramFollowUpDiag){

        $scope.follow_up_diag_info = paramFollowUpDiag;

        $scope.date_time = new Date().getTime();  //Retreiving the time in a universal format to store with firebase

        var ref = firebase.database().ref().child('diagnosis/' + $routeParams.patientId);
        var diag_info = $firebaseArray(ref);
        diag_info.$add({
            date_time: $scope.date_time,
            practice_name: $scope.doctor.practice_name,
            practice_number: $scope.doctor.practice_number,
            doctor_id: $scope.user_auth.id_num,
            doctor_name: $rootScope.displayName,
            orgl_diagnosis_id: $scope.follow_up_diag_info.orgl_diagnosis_key,
            title: $scope.follow_up_diag_info.follow_up_title,
            notes: $scope.follow_up_diag_info.follow_up_notes,
            tag: 'fw-up'
        })
            .then(function(diag_data) {

                //The following variables need to be created for the 'title' and 'prescription' as $scope.follow_up_diag_info 'title' and 'prescription'
                // // variables break after adding original diagnosis
                $scope.follow_up_diag_title = $scope.follow_up_diag_info.follow_up_title;
                $scope.follow_up_diag_prescription = $scope.follow_up_diag_info.prescription;


                //Adding the new follow up key to the original Diagnosis
                var org_diag_ref = firebase.database().ref().child('diagnosis/'+ $routeParams.patientId +'/' + paramFollowUpDiag.orgl_diagnosis_key +'/follow_up_diagnoses');
                var org_diag_info = $firebaseArray(org_diag_ref);
                org_diag_info.$add(diag_data.key);

                //Adding a prescription after the diagnosis has been added
                var presc_ref = firebase.database().ref().child('prescriptions/'+ $routeParams.patientId);
                var presc_info = $firebaseArray(presc_ref);

                presc_info.$add({
                    date_time: $scope.date_time,
                    diagnosis_id: diag_data.key,
                    orgl_diagnosis_key: paramFollowUpDiag.orgl_diagnosis_key,
                    practice_name: paramFollowUpDiag.practice_name,
                    doctor_name: $rootScope.displayName,
                    title: $scope.follow_up_diag_title,
                    prescription: $scope.follow_up_diag_prescription,
                    tag: 'fw-up'
                })
                    .then(function(presc_data){
//                        console.log("Added Successfuly!");
                        $scope.add_follow_up_diag_success = true;
                        // success callback
                        //$location.path('/doc_view_patient/'+$routeParams.patientId);
                    })
                    .catch(function(error){
                        console.log(error);
                    });


            })
            .catch(function(error){
                console.log(error);
            });


    };





    //Prescription Tab
    $scope.modal_presc = {};
    $scope.openPresc = function(paramPresc){
        $scope.modal_presc = paramPresc;
        $('#prescModal').modal('show');
    };


});

app.controller('patientDoctorRequestsCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location, SessionService) {
    $scope.doctor_requests = [];
    $scope.user_status = true;

    $scope.user_auth = {};
    $scope.user_auth.id_num = SessionService.get("userIdNum");
    $rootScope.displayName = SessionService.get("userDisplayName");
    $scope.user_auth.account_type = SessionService.get("userAccountType");

    var patient_id = $scope.user_auth.id_num;

    var ref = firebase.database().ref().child("patients").child(patient_id).child('doctor_requests');
    //  create a synchronized array
    //  FIX: Figure out how to maybe just retrieve a single record here to the client, this here retrieves the entire patients object
//    $scope.doctor_requests = $firebaseArray(ref);
    var doc_requests = $firebaseArray(ref);

    //Asynchronous function,  use a promise("$loaded") to before manipulating data
    doc_requests.$loaded()
        .then(function(){

            for (var i = 0; i < doc_requests.length; i++){
                var doc_id_num = doc_requests[i].$value;
                var doc_ref = firebase.database().ref().child('doctors/' + doc_id_num);
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


