var myApp = angular.module('myApp',
  ['ngRoute', 'firebase'])
  .constant('FIREBASE_URL', 'https://healfolio-1f903.firebaseio.com/');


myApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        if (error=='AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $location.path('/login');
        } // AUTH REQUIRED
      }); //event info
  }]); //run

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/user_type', {
      templateUrl: 'views/user_type.html',
      //controller: 'PathController'
      controller: 'RegistrationController'
    }).
    when('/patient_register', {
      templateUrl: 'views/patient_register.html',
      controller: 'RegistrationController'
    }).
    when('/doctor_register', {
      templateUrl: 'views/doctor_register.html',
      controller: 'RegistrationController'
    }).    
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/checkins/:uId/:mId', {
      templateUrl: 'views/checkins.html',
      controller: 'CheckInsController'
    }).
    when('/checkins/:uId/:mId/checkinsList', {
      templateUrl: 'views/checkinslist.html',
      controller: 'CheckInsController'
    }).
    when('/meetings', {
      templateUrl: 'views/meetings.html',
      controller: 'MeetingsController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //current Auth
      } //resolve
    }).
    otherwise({
      redirectTo: '/login'
    });
}]);