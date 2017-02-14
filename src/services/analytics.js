angular.module('ifiske.services')
.service('analytics', function($q, $window, $ionicPlatform) {
    return {
        trackEvent: function(category, action, label, value, newSession) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.trackEvent(
                    category,
                    action,
                    label,
                    value,
                    newSession,
                    function(success) {
                        console.log('analytics.trackEvent:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.trackEvent:',
                            category, action, label, value, newSession, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        trackView: function(screen, campaignUrl, newSession) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.trackView(
                    screen,
                    campaignUrl,
                    newSession,
                    function(success) {
                        console.log('analytics.trackView:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.trackView:',
                            screen, campaignUrl, newSession, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        trackMetric: function(key, value) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.trackMetric(
                    key,
                    value,
                    function(success) {
                        console.log('analytics.trackMetric:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.trackMetric:', key, value, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        trackException: function(description, fatal) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.trackException(
                    description,
                    fatal,
                    function(success) {
                        console.log('analytics.trackException:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.trackException:', description, fatal, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        debugMode: function() {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.debugMode(
                    function(success) {
                        console.log('analytics.debugMode:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.debugMode:', error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        enableUncaughtExceptionReporting: function(enable) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.enableUncaughtExceptionReporting(
                    enable,
                    function(success) {
                        console.log('analytics.enableUncaughtExceptionReporting:', success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.enableUncaughtExceptionReporting:', enable, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
        startTrackerWithId: function(id, dispatchPeriod) {
            var deferred = $q.defer();
            $ionicPlatform.ready(function() {
                $window.ga.startTrackerWithId(
                    id,
                    dispatchPeriod,
                    function(success) {
                        console.log('analytics.startTrackerWithId:', id, dispatchPeriod, success);
                        return deferred.resolve(success);
                    },
                    function(error) {
                        console.warn('analytics.startTrackerWithId:', id, dispatchPeriod, error);
                        return deferred.reject(error);
                    }
                );
            });
            return deferred.promise;
        },
    };
});
