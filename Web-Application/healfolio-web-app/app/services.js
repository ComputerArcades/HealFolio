/**
 * Created by pcc on 30-Oct-16.
 */
app.service('SessionService', function($window) {
    var service = this;
    var sessionStorage = $window.sessionStorage;

    service.get = function(key) {
        return sessionStorage.getItem(key);
    };

    service.set = function(key, value) {
        sessionStorage.setItem(key, value);
    };

    service.unset = function(key) {
        sessionStorage.removeItem(key);
    };
});