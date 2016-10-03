app.controller('dashboardCtrl', function ($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $rootScope, $filter,$routeParams, $location) {


//    This code below will go on the app's Routing function
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
    $rootScope.user_auth = {};
    $scope.user_status = false;

    //FIX: Rather use this in the app's Routing function
    if(user){
        var ref = firebase.database().ref("users").child(user.uid);
        // return it as a synchronized object
        $rootScope.user_auth = $firebaseObject(ref);
        $scope.user_auth.$loaded()
            .then(function(){
                //success callback
                $scope.user_status = true;
            })
            .catch(function(error){
                //Failure callback
                console.log(error);
            });
    }else{
        console.log("Error: Page was loaded outside the scope of the application!");

        //FIX: Change what happens if $scope does not exist, i.e page refresh problem
        firebase.auth().signOut();
        $location.path("/login");
    }

    $rootScope.doLogout = function(){
        firebase.auth().signOut();
        $location.path("/login");
    };


});

