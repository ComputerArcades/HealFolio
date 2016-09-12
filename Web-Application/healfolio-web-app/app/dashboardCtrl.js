app.controller('dashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {

    //This code below will go on the app's Routing function
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
        } else {
            // No user is signed in.
            $location.path("/login");
//            console.log("No user is signed in!");
        }
    });

    var user = firebase.auth().currentUser;
    $scope.user_auth = {};

    if(user){
        var ref = firebase.database().ref("users").child(user.uid);

        // return it as a synchronized object
        $scope.user_auth = $firebaseObject(ref);
//    $scope.user_auth.$loaded()
//        .then(function(){
//            console.log($scope.user_auth);
//        })
//        .catch(function(error){
//            //Failure callback
//            console.log(error);
//        });
    }else{
        console.log("Error: Page was loaded outside the scope of the application!");
    }









    $scope.doLogout = function(){
        firebase.auth().signOut();
        $location.path("/login");
    };


});

