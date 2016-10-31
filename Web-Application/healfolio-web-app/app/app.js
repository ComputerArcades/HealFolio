/**
 * Created by pcc on 14-Aug-16.
 */
var app = angular.module('myApp', ['ngRoute', 'ngAnimate','firebase']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                title: 'Dashboard',
                templateUrl: 'partials/dashboard.html',
                controller: 'dashboardCtrl',
                role: 0
            }).
            //DOCTOR
            when('/doc_view_patient/:patientId',{
                title: 'Patient View',
                templateUrl: 'partials/doc_view_patient.html',
                controller: 'viewPatientCtrl'
            }).
            when('/doc_add_patient',{
                title:'Add a Patient',
                templateUrl:'partials/doc_add_patient.html',
                controller:'docAddPatientCtrl'
            }).
            when('/doc_add_diagnosis/:patientId',{
                title: 'Add New Diagnosis',
                templateUrl: 'partials/doc_add_diagnosis.html',
                controller: 'docAddDiagnosisCtrl'
            }).
            //PATIENT
            when('/patient_info/:patientId',{
                title: 'Patient Information',
                templateUrl: 'partials/patient_info.html',
                controller: 'viewPatientCtrl'
            }).
            when('/patient_doctors/:patientId',{
                title: 'Doctors',
                templateUrl: 'partials/patient_doctors.html',
                controller: 'patientViewDoctorsCtrl'
            }).
            when('/patient_doctor_requests',{
                title: 'Patient\'s Doctor Requests',
                templateUrl: 'partials/patient_doctor_requests.html',
                controller: 'patientDoctorRequestsCtrl'
            }).
            //AUTHENTICATION
            when('/doctor_signup',{
                title: 'Doctor Sign Up',
                templateUrl:'partials/doctor_signup.html',
                controller: 'authCtrl'
            }).
            when('/patient_signup',{
                title: 'Patient Sign Up',
                templateUrl: 'partials/patient_signup.html',
                controller: 'authCtrl'
            }).
            when('/login', {
                title: 'Login',
                templateUrl: 'partials/login.html',
                controller: 'authCtrl'
            }).
            when('/signup', {
                title: 'Sign Up',
                templateUrl: 'partials/signup.html',
                controller: 'authCtrl'
            }).
            //USER PROFILE
            when('/user_profile',{
                title: 'User Profile',
                templateUrl: 'partials/user_profile.html',
                controller: 'userProfileCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]).run(function($rootScope, $firebaseObject, $location, SessionService){

    $rootScope.$on('$routeChangeStart', function(event, next){

        if (SessionService.get("userIdNum")){
        }else{
            var nextUrl = next.$$route.originalPath;
            if (nextUrl == '/signup' || nextUrl == '/doctor_signup' || nextUrl == '/patient_signup'){

            }else{
                $location.path('/login');
            }
        }
    });

    $rootScope.userProfile = function(){
        $location.path('/user_profile');
    };

    $rootScope.doLogout = function(){
        $location.path("/login");
        firebase.auth().signOut();
        SessionService.unset("userIdNum");
        SessionService.unset("userDisplayName");
        SessionService.unset("userAccountType");

    };

});