app.controller('dashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location, SessionService) {

    //Javascript tag handling on patients dashboard
    $('#myTabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

//    This code below will go on the app's Routing function
//    firebase.auth().onAuthStateChanged(function(user) {
//        if (user) {
//            // User is signed in.
//        } else {
//            // No user is signed in.
//            $location.path("/login");
////            console.log("No user is signed in!");
//        }
//    });

//    //Retrieve the user that has been authenticated
//    var user = firebase.auth().currentUser;

    $scope.user_auth = {};
    $scope.user_status = false;

        if(SessionService.get("userIdNum")){
                //success callback
                $scope.user_status = true;
                $scope.user_auth.id_num = SessionService.get("userIdNum");
                $rootScope.displayName = SessionService.get("userDisplayName");
                $scope.user_auth.account_type = SessionService.get("userAccountType");


                if (SessionService.get("userAccountType") == 'doctor'){
                    //Show list of Doctor's patients
                    $scope.patients = [];

                    var doctor_id_num = $scope.user_auth.id_num;
                    var ref_doctors = firebase.database().ref().child("doctors").child(doctor_id_num).child("patients");

                    //  create a synchronized array
                    var doc_patients = $firebaseArray(ref_doctors);

                    doc_patients.$loaded()
                        .then(function(){
                            for (var i = 0; i < doc_patients.length; i++){
                                var patient_id_num = doc_patients[i].$value;
                                var ref_patients = firebase.database().ref().child('patients/'+ patient_id_num);
                                var patient_obj = $firebaseObject(ref_patients);
                                $scope.patients.push(patient_obj);                         }

                        })
                        .catch(function(error){
                            console.log(error);
                        });

                    $scope.columns = [
                        {text:"ID",predicate:"id_num",sortable:true,dataType:"number"},
                        {text:"First Name",predicate:"first_name",sortable:true},
                        {text:"Last Name",predicate:"lastname",sortable:true},
                        {text:"Date of Birth",predicate:"date_of_birth",sortable:true,dataType:"number"},
                        {text:"Gender",predicate:"gender",sortable:true}
                    ];

                }
                //FIX this later
                if(SessionService.get("userAccountType") == 'patient'){

                    $scope.patient = {};
                    var ref_patient = firebase.database().ref().child("patients/"+ $scope.user_auth.id_num);
                    //  create a synchronized array
                    var patient_info = $firebaseObject(ref_patient);

                    patient_info.$loaded()
                        .then(function(){
                            $scope.patient = patient_info;
                        })
                        .catch(function(error){
                            console.log(error);
                        });
                   //Display Diagnosis Records
                    $scope.diagnosis = [];

                    var ref_diag = firebase.database().ref().child("diagnosis/" + $scope.user_auth.id_num);
                    $scope.diagnosis = $firebaseArray(ref_diag);

                    $scope.diag_columns = [
                        {text:"Date",predicate:"id_num",sortable:true},
                        {text:"Title/Summary",predicate:"title",sortable:true},
                        {text:"Practice",predicate:"practice_name",sortable:true},
                        {text:"Doctor",predicate:"doctor_name",sortable:true}
                    ];

                    //Display Prescription Records
                    $scope.prescriptions = [];
                    var presc_ref = firebase.database().ref().child("prescriptions/" + $scope.user_auth.id_num);
                    $scope.prescriptions = $firebaseArray(presc_ref);

                    $scope.presc_columns = [
                        {text:"Date",predicate:"id_num",sortable:true},
                        {text:"Diagnosis Summary",predicate:"title",sortable:true},
                        {text:"Practice",predicate:"practice_name",sortable:true},
                        {text:"Doctor",predicate:"doctor_name",sortable:true}
                    ];


                }

        }else{
            $location.path('/login');

        }

    //Prescription Tab
    $scope.modal_presc = {};
    $scope.openPresc = function(paramPresc){
        $scope.modal_presc = paramPresc;
        $('#prescModal').modal('show');
    };




});

