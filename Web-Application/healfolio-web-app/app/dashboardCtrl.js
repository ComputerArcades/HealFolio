app.controller('dashboardCtrl', function ($scope, $firebaseArray, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
//            console.log("User is signed in!");
//            console.log("User Id: "+ firebase.auth().currentUser.uid + "\nEmail: " + firebase.auth().currentUser.email);
            console.log(user);
        } else {
            // No user is signed in.
            $location.path("/login");
//            console.log("No user is signed in!");
        }
    });

    $scope.doLogout = function(){
        firebase.auth().signOut();
        $location.path("/login");
    }

});

