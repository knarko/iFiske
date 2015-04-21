/* global angular:false */
/*
 * SimplePubSub from https://github.com/mbenford/ngTagsInput/blob/master/src/util.js
 * */
;(function(angular){
    'use strict';

    function SimplePubSub() {
        var events = {};
        return {
            on: function(names, handler) {
                names.split(' ').forEach(function(name) {
                    if (!events[name]) {
                        events[name] = [];
                    }
                    events[name].push(handler);
                });
                return this;
            },
            trigger: function(name, args) {
                angular.forEach(events[name], function(handler) {
                    handler.call(null, args);
                });
                return this;
            }
        };
    }

    angular.module('tabSlideBox', [])
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    })
    .directive('tabSlideBox', [ '$timeout', '$window', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
               function($timeout, $window, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

                   return {
                       restrict : 'A, E, C',
                       link : function(scope, element, attrs, ngModel) {

                           var ta = element[0];
                           var $ta = element;
                           $ta.addClass("tabbed-slidebox");
                           if(attrs.tabsPosition === "bottom"){
                               $ta.addClass("btm");
                           }

                           function renderScrollableTabs(){
                               var iconsDiv = angular.element(ta.querySelector(".tsb-nav"));
                               var icons = iconsDiv.find("button");
                               var totalTabs = icons.length;

                               iconsDiv.on('click', function(e) {
                                   if(e.target.tagName === 'BUTTON') {
                                       var button = e.target;
                                       var index = [].indexOf.call(button.parentNode.children,button);
                                       $ionicSlideBoxDelegate.slide(index);
                                   }
                               });

                               var initialIndex = attrs.tab;
                               //Initializing the middle tab
                               if(typeof attrs.tab === 'undefined' || (totalTabs <= initialIndex) || initialIndex < 0){
                                   initialIndex = Math.floor(icons.length/2);
                               }

                               setPosition(initialIndex);

                               $timeout(function() {
                                   $ionicSlideBoxDelegate.slide(initialIndex);
                               }, 0);
                           }
                           function setPosition(index){
                               var iconsDiv = angular.element(ta.querySelector(".tsb-nav"));
                               var icons = iconsDiv.find("button");
                               var totalTabs = icons.length;

                               var middle = iconsDiv[0].offsetWidth/2;
                               var curEl = angular.element(icons[index]);
                               if(curEl && curEl.length){
                                   var curElWidth = curEl[0].offsetWidth, curElLeft = curEl[0].offsetLeft;

                                   angular.element(iconsDiv[0].querySelector(".active")).removeClass("active");
                                   curEl.addClass("active");

                                   var leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5);
                                   leftStr = (middle  - (curElLeft) -  curElWidth/2 + 5) + "px";
                               }
                           }
                           function getX(matrix) {
                               matrix = matrix.replace("translate3d(","");
                               matrix = matrix.replace("translate(","");
                               return (parseInt(matrix));
                           }
                           var events = scope.events;
                           events.on('slideChange', function(index){
                               setPosition(index);
                           });
                           events.on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                               renderScrollableTabs();
                           });

                           renderScrollableTabs();
                       },
                       controller : function($scope, $attrs, $element) {
                           $scope.events = new SimplePubSub();

                           $scope.slideChanged = function(index) {
                               $scope.events.trigger('slideChange', index);
                           };

                           $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                               $scope.events.trigger("ngRepeatFinished", {"event" : ngRepeatFinishedEvent});
                           });
                       }
                   };

               }
    ]);
})(window.angular);
