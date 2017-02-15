angular.module('ifiske.services')
.service('analytics', function($q, $window, $ionicPlatform, $interval) {
    var hasGADeferred = $q.defer();
    var isTrackerStartedDeferred = $q.defer();
    /**
     * returns a promise that resolves if we have google analytics
     * @return {Promise} Only resolves if we have window.ga
     */
    function hasGA() {
        return hasGADeferred.promise;
    }
    /**
     * returns a promise that resolves when the tracker has started
     * @return {Promise} Only resolves if we have started the tracker
     */
    function hasTrackerStarted() {
        return isTrackerStartedDeferred.promise;
    }

    var timesChecked = 0;
    var intervalId = $interval(function() {
        if (timesChecked++ > 5) {
            $interval.cancel(intervalId);
            console.warn('We do not have Google Analytics');
            hasGADeferred.reject('Could not find Google Analytics');
        }
        if ($window.ga) {
            $interval.cancel(intervalId);
            console.log('We have Google Analytics');
            hasGADeferred.resolve();
        }
    }, 1000);

    var analytics = {
        trackEvent: function(category, action, label, value, newSession) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(hasTrackerStarted)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        trackView: function(screen, campaignUrl, newSession) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(hasTrackerStarted)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        trackMetric: function(key, value) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(hasTrackerStarted)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        trackException: function(description, fatal) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(hasTrackerStarted)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        debugMode: function() {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        enableUncaughtExceptionReporting: function(enable) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
        startTrackerWithId: function(id, dispatchPeriod) {
            return $ionicPlatform.ready()
            .then(hasGA)
            .then(function() {
                var deferred = $q.defer();
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
                return deferred.promise;
            });
        },
    };
    // analytics.debugMode(); // enable when debugging

    analytics.startTrackerWithId('UA-7371664-4').then(
        isTrackerStartedDeferred.resolve,
        isTrackerStartedDeferred.reject);

    analytics.enableUncaughtExceptionReporting(true);

    return analytics;
});
