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
		database.ref('patients/'+$scope.patient_id).set({
			id_num: $scope.patient_id,
            first_names: $scope.patient_first_names,
            surname: $scope.patient_surname,
            dob: getDOB($scope.patient_id),
            gender: getGender($scope.patient_id),
			race: $scope.patient_race,
			allergies: $scope.patient_allergies,
			med_aid_provider: $scope.medical_aid_provider,
			med_aid_scheme: $scope.medical_aid_scheme,
			med_aid_number: $scope.medical_aid_number,
			main_mem_id: $scope.main_member_id,
			main_mem_first_names: $scope.main_member_first_names,
			main_mem_surname: $scope.main_member_surname,
			main_mem_med_aid_number: $scope.main_member_medical_aid_number,
			address1: $scope.address_1,
			address2: $scope.address_2,
			address3: $scope.address_3,
			postal_code: $scope.postal_code,
			phone_number: $scope.phone_number
        });
    };
	
	function getDOB(id_num){
		return id_num.substring(0,2) + '/' + id_num.substring(2,4) + '/' + id_num.substring(4,6);
	}
	
	function getGender(id_num){
		console.log(id_num.substring(6,7));
		if(parseInt(id_num.substring(6,7)) >= 5){
			return 'Male';
		}
		else return 'Female';
	}

});