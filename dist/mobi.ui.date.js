/* mobi.ui.date - v0.0.4 - 2014-12-17 */

angular.module('mobi.ui.date.directives', [
    'mobi.ui.date.services'
])

    .directive('mobiDateInput', function (DateService, dateFilter) {
        return {
            require: 'ngModel',
            compile: function () {
                return function (scope, elm, attrs, ngModelCtrl) {
                    function dateStringParser(value) {
                        var viewValue = ngModelCtrl.$viewValue, dateString, correctedInputValue;
                        if (angular.isDate(viewValue)) {
                            dateString = dateFilter(value, 'yyyy-MM-dd');

                        } else if (angular.isString(viewValue)) {
                            correctedInputValue = DateService.correctInput(viewValue);
                            elm[0].value = correctedInputValue;

                            dateString = DateService.parse(correctedInputValue);
                        }
                        return dateString;
                    }

                    ngModelCtrl.$parsers.unshift(dateStringParser);

                };
            }
        };
    })

    .directive('mobiDate', function () {
        return {
            templateUrl: 'date.tpl.html',
            restrict: 'E',
            transclude: true,
            scope: {
                ngModel: '=',
                id: '@',
                name: '@',
                tabindex: '@',
                definition: '@',
                definitionScopeModel: '=',
                dateDisabled: '=',
                pickerDisabled: '=',
                changeEvent: '=',
                minDate: '=',
                maxDate: '=',
                ignoreGlobalEditMode: '='
            },
            replace: true,
            require: 'ngModel',
            compile: function (elm) {
                var el = elm[0];
                el.removeAttribute('ng-model');
                el.removeAttribute('id');
                el.removeAttribute('name');
                el.removeAttribute('tabindex');
                el.removeAttribute('definition');
                el.removeAttribute('definition-scope-model');

                return {
                    pre: function (scope, elm, attr) {
                        scope.wrapper = {date: undefined};
                        scope.open = function ($event) {
                            if (scope.isDateDisabled() || scope.isPickerDisabled()) {
                                //do not open
                                return;
                            }
                            $event.preventDefault();
                            $event.stopPropagation();
                            scope.opened = true;
                        };

                        scope.dateOptions = {
                            startingDay: 1,
                            showWeeks: false
                        };

                        scope.isDateDisabled = function () {
                            return false;
                        };

                        scope.isPickerDisabled = function () {
                            return false;
                        };
                    }
                };
            }
        };
    });

angular.module('mobi.ui.date', [
    'mobi.ui.date.services',
    'mobi.ui.date.directives',
    'mobi.ui.momentadapter',
    'mobi.ui.date.templates'
])

;


angular.module('mobi.ui.date.services', [])
    .factory('DateService', function (moment, DateFactory) {

        function checkAndCorrectFirst(value) {
            var number;
            number = parseInt(value.charAt(0), 10);
            if (isNaN(number)) {
                value = '';
            } else {
                if (number > 3) {
                    value = '0' + value + '.';
                }
            }
            return value;
        }

        function checkAndCorrectSecond(value) {
            var number, day, before, after;
            number = parseInt(value.charAt(1), 10);
            if (value.charAt(1) === '.') {
                value = '0' + value;
            } else if (isNaN(number)) {
                value = value.slice(0, 1);
            } else {
                day = parseInt(value.slice(0, 2), 10);
                if (day > 31) {
                    value = value.slice(0, 1);
                } else {
                    before = value.slice(0, 2);
                    after = value.slice(3);
                    value = before + '.' + after;
                }
            }
            return value;
        }

        function checkAndCorrectThird(value) {
            var character, before, after;
            character = value.charAt(2);
            if (character !== '.') {
                before = value.slice(0, 2);
                after = value.slice(3);
                value = before + '.' + after;
            }
            return value;
        }

        function checkAndCorrectFourth(value) {
            var number;
            number = parseInt(value.charAt(3), 10);
            if (isNaN(number)) {
                value = value.slice(0, 3);
            } else if (number > 1) {
                value = value.slice(0, 3) + '0' + number + '.';
            }
            return value;
        }

        function checkAndCorrectFifth(value) {
            var number, month, before, after;
            number = parseInt(value.charAt(4), 10);
            if (value.charAt(4) === '.') {
                value = value.slice(0, 3) + '0' + value.slice(3, 5);
            } else if (isNaN(number)) {
                value = value.slice(0, 4);
            } else {
                month = parseInt(value.slice(3, 5), 10);
                if (month > 12) {
                    value = value.slice(0, 4);
                } else {
                    before = value.slice(0, 5);
                    after = value.slice(6);
                    value = before + '.' + after;
                }
            }
            return value;
        }

        function checkAndCorrectSixth(value) {
            var character;
            character = value.charAt(5);
            if (character !== '.') {
                value = value.slice(0, 5) + '.';
            }
            return value;
        }

        function checkAndCorrectOthers(value) {
            var length, number;
            length = value.length;
            number = parseInt(value.charAt(length - 1), 10);
            //too long
            if (length > 10) {
                value = value.slice(0, 10);
            }
            //for all the year digits
            if (isNaN(number)) {
                value = value.slice(0, length - 1);
            }
            return value;
        }

        function correctInput(value) {
            var i, lengthBefore, lengthAfter;
            if (value && typeof value === 'string') {
                for (i = 1; i <= value.length; i++) {
                    lengthBefore = value.length;
                    switch (i) {
                        case 1:
                            value = checkAndCorrectFirst(value);
                            break;
                        case 2:
                            value = checkAndCorrectSecond(value);
                            break;
                        case 3:
                            value = checkAndCorrectThird(value);
                            break;
                        case 4:
                            value = checkAndCorrectFourth(value);
                            break;
                        case 5:
                            value = checkAndCorrectFifth(value);
                            break;
                        case 6:
                            value = checkAndCorrectSixth(value);
                            break;
                        default:
                            value = checkAndCorrectOthers(value);
                    }
                    lengthAfter = value.length;
                    i = i - (lengthBefore - lengthAfter);
                }
            } else {
                value = '';
            }
            return value;
        }

        function parse(inputValue) {
            if (inputValue) {
                return moment(inputValue, 'DD.MM.YYYY').format('YYYY-MM-DD');
            } else {
                return undefined;
            }
        }

        function format(value) {
            return moment(value, 'YYYY-MM-DD').format('DD.MM.YYYY');
        }

        function formatDate(date) {
            return moment(date).format('YYYY-MM-DD');
        }

        function validate(dateStr) {
            if (!dateStr) { //allow potentially empty input
                return true;
            }
            var date = moment(dateStr, 'YYYY-MM-DD');
            return date.isValid() && date.get('year') >= 1000;
        }

        /*
         Converts a string of format yyyy-mm-dd to a date object. The time part is set to 0.
         */
        function getDateObject(dateStr) {
            if (dateStr) {
                return moment(dateStr, 'YYYY-MM-DD').toDate();
            }
        }

        function currentDate() {
            return DateFactory.currentDate();
        }

        function timestamp() {
            return DateFactory.timestamp();
        }

        return {
            correctInput: correctInput,
            parse: parse,
            format: format,
            formatDate: formatDate,
            validate: validate,
            getDateObject: getDateObject,
            currentDate: currentDate,
            timestamp: timestamp
        };

    })

    .factory('DateFactory', function () {
        function currentDate() {
            return new Date();
        }

        function timestamp() {
            return currentDate().getTime();
        }

        return {
            currentDate: currentDate,
            timestamp: timestamp
        }
    })

;


angular.module('mobi.ui.date.templates', ['date.tpl.html']);

angular.module("date.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("date.tpl.html",
    "<div class=\"input-group mobi-date\">\n" +
    "    <!-- mobi-date-input -->\n" +
    "    <input type=\"text\" id=\"{{id}}\" name=\"{{name}}\" datepicker-popup=\"dd.MM.yyyy\" show-button-bar=\"false\"\n" +
    "           ng-model=\"ngModel\" ng-change=\"changeEvent()\" is-open=\"opened\" datepicker-options=\"dateOptions\"\n" +
    "           max-date=\"maxDate\" min-date=\"minDate\"\n" +
    "           class=\"calendarinput form-control\" placeholder=\"dd.mm.yyyy\" maxlength=\"10\"\n" +
    "           tabindex=\"{{tabindex}}\" ng-disabled=\"isDateDisabled()\" mobi-date-input disabled-override-edit-mode=\"{{dateDisabled}}\"\n" +
    "           definition-scope-model=\"{{definitionScopeModel}}\" definition=\"{{definition}}\"\n" +
    "           edit-mode\n" +
    "            />\n" +
    "    <span class=\"input-group-btn\">\n" +
    "        <a class=\"btn btn-default\" id=\"{{id}}Calendar\" ng-click=\"open($event)\" ng-disabled=\"isPickerDisabled() || isDateDisabled()\">\n" +
    "            <i class=\"fa fa-calendar\"></i>\n" +
    "        </a>\n" +
    "    </span>\n" +
    "    <span class=\"input-group-btn\" ng-transclude>\n" +
    "\n" +
    "    </span>\n" +
    "</div>");
}]);
