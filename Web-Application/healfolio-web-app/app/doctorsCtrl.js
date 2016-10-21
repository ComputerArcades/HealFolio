/**
 * Created by pcc on 08-Sep-16.
 */
app.controller('doctorsCtrl',function($scope, $rootScope, $firebaseAuth, $firebaseArray, $routeParams, $location){

    //Show list of Doctor's patients
    $scope.doctor = {};
    $scope.patients = [];

    $scope.doctor_id_num = $routeParams.doctorId; //This here will come from some form of current User variable
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
                        //Add the record to the $scope.patients array
                        $scope.patients.push(patient_info.$getRecord(patient_id_num));
                    }
//                    console.log($scope.patients[0]);
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
        {text:"First Name",predicate:"first_name",sortable:true},
        {text:"Last Name",predicate:"lastname",sortable:true},
        {text:"Date of Birth",predicate:"date_of_birth",sortable:true,dataType:"number"},
        {text:"Gender",predicate:"gender",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];

});


app.controller('docAddDiagnosisCtrl',function($scope, $rootScope, $firebaseAuth, $firebaseArray, $routeParams, $location){
    $scope.diagnosis_info = {};
    $scope.diagnosis_info = {practice_name: '',practice_number:'',doctor_id:'',doctor_name:'',title:'',notes:''};
    $scope.doctor = {};

        var ref = firebase.database().ref().child("doctors");
        // return it as a synchronized object
        var doctor_info = $firebaseArray(ref);
        doctor_info.$loaded()
            .then(function(){
                //success callback
                $scope.doctor = doctor_info.$getRecord($rootScope.user_auth.id_num);
            })
            .catch(function(error){
                //Failure callback
                console.log(error);
            });



    $scope.newDiagnosis = function(){
        $scope.date_time = new Date().getTime();  //Retreiving the time in a universal format to store with firebase

        var ref = firebase.database().ref().child('diagnosis/' + $routeParams.patientId);
        var diag_info = $firebaseArray(ref);
        diag_info.$add({
            date_time: $scope.date_time,
            practice_name: $scope.doctor.practice_name,
            practice_number: $scope.doctor.practice_number,
            doctor_id: $rootScope.user_auth.id_num,
            doctor_name: $rootScope.displayName,
            title: $scope.diagnosis_info.title,
            notes: $scope.diagnosis_info.notes
        })
            .then(function(diag_data) {

                //Adding a prescription after the diagnosis has been added
//                console.log("added record with id " + diag_data.key);
                var presc_ref = firebase.database().ref().child('prescriptions/'+ $routeParams.patientId);
                var presc_info = $firebaseArray(presc_ref);
                presc_info.$add({
                    date_time: $scope.date_time,
                    diagnosis_id: diag_data.key,
                    practice_name: $scope.doctor.practice_name,
                    doctor_name: $rootScope.displayName,
                    title: $scope.diagnosis_info.title,
                    prescription: $scope.diagnosis_info.prescription
                })
                    .then(function(presc_data){
                       //success callback
                    })
                    .catch(function(error){
                        console.log(error);
                    });
                $location.path('/patient_dashboard/'+$routeParams.patientId);

            })
            .catch(function(error){
                console.log(error);
            });

    }

});


app.controller("docAddPatientCtrl", function($scope, $rootScope, $firebaseArray, $location, $routeParams) {

    var ref = firebase.database().ref().child("patients");
    // create a synchronized array
    $scope.patients = $firebaseArray(ref);

//    $scope.message = true;
    var database = firebase.database();

    $scope.addPatientId = function(paramDoctorIdnum){
        var key = $rootScope.user_auth.id_num;
        var doc_obj = {};
        doc_obj[key] = true;

        database.ref('patients').child($scope.patient_id_num).child('doctor_requests').set(doc_obj)
            .then(function(){
                //Success Callback
//                console.log("Request sent successfully!");
                alert("Patient request sent successfully!");
            })
            .catch(function(error){
                alert(error);
            });
    };

    $scope.addPatientDetails = function() {
        var valid_id = validateID($scope.patient_id);
        var valid_first_names = ($scope.patient_first_names == null) ? false : true;
        var valid_surname = ($scope.patient_surname == null) ? false : true;
        var valid_race = ($scope.patient_race == null) ? false : true;
        var valid_phone_number = ($scope.phone_number == null) ? false : true;

        if(valid_id && valid_first_names && valid_surname && valid_race){
            //Send data to database
            database.ref('patient_details/'+$scope.patient_id).set({
                id_num: $scope.patient_id,
                first_names: $scope.patient_first_names,
                surname: $scope.patient_surname,
                dob: getDOB($scope.patient_id),
                gender: getGender($scope.patient_id),
                race: $scope.patient_race,

                allergies: ($scope.patient_allergies == null) ? "N/A" : $scope.patient_allergies,
                med_aid_provider: ($scope.medical_aid_provider == null) ? "N/A" : $scope.medical_aid_provider,
                med_aid_scheme: ($scope.medical_aid_scheme == null) ? "N/A" : $scope.medical_aid_scheme,
                med_aid_number: ($scope.medical_aid_number == null) ? "N/A" : $scope.medical_aid_number,
                main_mem_id: ($scope.main_member_id == null) ? "N/A" : $scope.main_member_id,
                main_mem_first_names: ($scope.main_member_first_names == null) ? "N/A" : $scope.main_member_first_names,
                main_mem_surname: ($scope.main_member_surname == null) ? "N/A" : $scope.main_member_surname,
                main_mem_med_aid_number: ($scope.main_member_medical_aid_number == null) ? "N/A" : $scope.main_member_medical_aid_number,

                address1: ($scope.address_1 == null) ? "N/A" : $scope.address_1,
                address2: ($scope.address_2 == null) ? "N/A" : $scope.address_2,
                address3: ($scope.address_3 == null) ? "N/A" : $scope.address_3,
                postal_code: ($scope.postal_code == null) ? "N/A" : $scope.postal_code,
                phone_number: ($scope.phone_number == null) ? "N/A" : $scope.phone_number
            });

////            var patient_basic = {
//                first_names: $scope.patient.first_names,
//                last_name: $scope.patient_surname,
//                date_of_birth: getDOB($scope.patient_id),
//                gender: getGender($scope.patien_id),
//                race = $scope.patient_race,
//                $scope.patient_basic
//        }
            var patient_basic_info = {};
            patient_basic_info.first_names = $scope.patient_first_names;
            patient_basic_info.last_name = $scope.patient_surname;
            patient_basic_info.date_of_birth = getDOB($scope.patient_id);
            patient_basic_info.gender = getGender($scope.patient_id);
            patient_basic_info.race = $scope.patient_race;

            var patient_details = {};
            patient_details.allergies = ($scope.patient_allergies == null) ? "N/A" : $scope.patient_allergies;
            patient_details.address1 = ($scope.address_1 == null) ? "N/A" : $scope.address_1;
            patient_details.postal_code = ($scope.postal_code == null) ? "N/A" : $scope.postal_code;
            patient_details.phone_number = ($scope.phone_number == null) ? "N/A" : $scope.phone_number;

            var patient_db_updates = {};
            patient_db_updates['/patients/'+$scope.patient_id] = patient_basic_info;
            patient_db_updates['/patients_details/'+$scope.patient_id] = patient_details;

            firebase.database().ref().update(patient_db_updates);


            console.log("Patient Details added successfully!");
            $location.path("/patients");
        }
        else{
            //Change labels to red to highlight problem field(s) and green if problem was corrected but another problem exists
            if(!valid_id) $scope.label_patient_id = "label label-danger";
            else $scope.label_patient_id = "label label-success";

            if(!valid_first_names) $scope.label_patient_first_names = "label label-danger";
            else $scope.label_patient_first_names = "label label-success";

            if(!valid_surname) $scope.label_patient_surname = "label label-danger";
            else $scope.label_patient_surname = "label label-success";

            if(!valid_race) $scope.label_patient_race = "label label-danger";
            else $scope.label_patient_race = "label label-success";

            if(!valid_phone_number) $scope.label_phone_number = "label label-danger";
            else $scope.label_phone_number = "label label-success";
        }
    };



    //Extract DoB from ID
    function getDOB(id_num){
        return id_num.substring(0,2) + '/' + id_num.substring(2,4) + '/' + id_num.substring(4,6);
    }

    //Extract gender from ID
    function getGender(id_num){
        if(parseInt(id_num.substring(6,7)) >= 5){
            return 'Male';
        }
        else return 'Female';
    }

    //Ensure ID is valid SA format
    function validateID(id_num){
        if(id_num == null) return false;

        if( (id_num.length == 13) && (/^\d+$/.test(id_num)) ){
            return true;
        }

        return false;
    }


});