/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientsCtrl', function ($scope, $firebaseArray, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.patients = {};

    var ref = firebase.database().ref().child("patients");

    // create a synchronized array
    $scope.patients = $firebaseArray(ref);

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
    $scope.patients = {};
    $scope.Patients = {};

//    var ref = firebase.database().ref().child("patients/"+$routeParams.patientId);
    var ref = firebase.database().ref().child("patients");
    // create a synchronized array
//    $scope.patient_info = $firebaseArray(ref);
    $scope.patient = $firebaseObject(ref.child($routeParams.patientId));

});

app.controller("addPatientCtrl", function($scope, $firebaseArray,$location) {

    var ref = firebase.database().ref().child("patients");

    // create a synchronized array
    $scope.patients = $firebaseArray(ref);//

    var database = firebase.database();

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
