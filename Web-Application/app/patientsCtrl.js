/**
 * Created by tumbone on 03-Sep-16.
 */
app.controller('patientsCtrl', function ($scope, $firebaseArray, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    $scope.patients = {};

    var ref = firebase.database().ref().child("Patients");

    // create a synchronized array
    $scope.patients = $firebaseArray(ref);

    $scope.columns = [
        {text:"ID",predicate:"id_num",sortable:true,dataType:"number"},
        {text:"Name",predicate:"name",sortable:true},
        {text:"Age",predicate:"age",sortable:true,dataType:"number"},
        {text:"Gender",predicate:"gender",sortable:true},
        {text:"Race",predicate:"race",sortable:true},
        {text:"Action",predicate:"",sortable:false}
    ];



});

app.controller("addPatientCtrl", function($scope, $firebaseArray) {

    var ref = firebase.database().ref().child("Patients");

    // create a synchronized array
    $scope.patients = $firebaseArray(ref);
//
//    // add new items to the array
//    // the patient is automatically added to our Firebase database!
    $scope.addPatient = function() {
        $scope.patients.$add({
            name: $scope.patient_name,
            id_num: $scope.patient_id_num,
            age: $scope.patient_age,
            gender: $scope.patient_gender,
            race: $scope.patient_race
        });
//        console.log("Patient Added!");
    };

});
