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

    .directive('mobiDate', function (ModelManager, SettingsManager) {
        return {
            templateUrl: 'date/date.tpl.html',
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
                            if (!angular.isDefined(attr.ignoreGlobalEditMode)) {
                                //check if the edit mode is enabled
                                var editMode = false,
                                    model = ModelManager.getCurrentModel();
                                if (model.settings && model.settings.editMode !== undefined) {
                                    editMode = model.settings.editMode;
                                }
                                else {
                                    editMode = SettingsManager.getSetting('editMode');
                                }

                                // edit mode overrides all
                                if (!editMode) {
                                    return true;
                                }
                            }

                            return scope.dateDisabled;
                        };

                        scope.isPickerDisabled = function () {
                            return scope.pickerDisabled;
                        };
                    }
                };
            }
        };
    });
