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
            when('/patients/:doctorId',{
                title: 'Patients',
                templateUrl: 'partials/patients.html',
                controller: 'doctorsCtrl'
            }).
            when('/doctors/:patientId',{
                title: 'Doctors',
                templateUrl: 'partials/patient_doctors.html',
                controller: 'patientsCtrl'
            }).
            when('/patient_dashboard/:patientId',{
                title: 'Patient Dashboard',
                templateUrl: 'partials/patient_dashboard.html',
                controller: 'patientsDashboardCtrl'
            }).
            when('/patient_doctor_requests',{
                title: 'Patient\'s Doctor Requests',
                templateUrl: 'partials/patient_doctor_requests.html',
                controller: 'patientDoctorRequestsCtrl'
            }).
            when('/addpatient',{
                title:'Add a Patient',
                templateUrl:'partials/add_patient.html',
                controller:'addPatientCtrl'
            }).
            when('/doc_add_diagnosis/:patientId',{
                title: 'Add New Diagnosis',
                templateUrl: 'partials/doc_add_diagnosis.html',
                controller: 'addDiagnosisCtrl'
            }).
            when('/doctor_signup',{
                title: 'Doctor Sign Up',
                templateUrl:'partials/doctor_signup.html',
                controller: 'authCtrl'
            }).
            when('/patient_signup',{
                title: 'Patient Sign UP',
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
            when('/user_profile/:userId',{
                title: 'User Profile',
                templateUrl: 'partials/user_profile.html',
                controller: 'userProfileCtrl'
            }).
			when('/patient_info/:patientId',{
				title: 'Patient information',
				templateUrl: 'partials/patient_info.html',
				controller: 'patientsDashboardCtrl'
			}).
            otherwise({
                redirectTo: '/'
            });
    }]);