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
            when('/patients',{
                title: "Patients",
                templateUrl: 'partials/patients.html',
                controller: 'patientsCtrl'
            }).
            when('/addpatient',{
                title:"Add a Patient",
                templateUrl:"partials/add_patient.html",
                controller:"addPatientCtrl"
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
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);