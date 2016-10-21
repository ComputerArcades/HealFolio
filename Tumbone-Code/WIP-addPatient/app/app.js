/**
 * Created by pcc on 14-Aug-16.
 */
var app = angular.module("sampleApp", ["firebase"]);
var database = firebase.database();

app.controller("SampleCtrl", function($scope, $firebaseArray) {

var ref = database.ref().child("patients");

    // create a synchronized array
    $scope.patients = $firebaseArray(ref);
//    // add new items to the array
//    // the message is automatically added to our Firebase database!

    $scope.addPatient = function() {
		var valid_id = validateID($scope.patient_id);
		var valid_first_names = ($scope.patient_first_names == null) ? false : true;
		var valid_surname = ($scope.patient_surname == null) ? false : true;
		var valid_race = ($scope.patient_race == null) ? false : true;
		var valid_phone_number = ($scope.phone_number == null) ? false : true;
		
		if(valid_id && valid_first_names && valid_surname && valid_race){
			//Send data to database
			database.ref('patients/'+$scope.patient_id).set({
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