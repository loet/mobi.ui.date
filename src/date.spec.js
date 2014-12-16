describe('date service', function () {
    var DateService;

    beforeEach(module('mobi.ui.date'));
    //beforeEach(module('ngMock'));    //not needed?

    beforeEach(inject(function (_DateService_) {
        DateService = _DateService_;
    }));

    describe('definitions', function () {

        it('functions should be defined', inject(function () {
            expect(angular.isFunction(DateService.correctInput)).toBeTruthy();
            expect(angular.isFunction(DateService.parse)).toBeTruthy();
            expect(angular.isFunction(DateService.format)).toBeTruthy();
            expect(angular.isFunction(DateService.validate)).toBeTruthy();
        }));

    });


    describe('to model conversion', function () {

        it('should with full input return joda string', inject(function () {
            var inputValue, modelValue;
            inputValue = '10.11.2000';
            modelValue = DateService.parse(inputValue);
            expect(modelValue).toBe('2000-11-10');
        }));

        it('should complete date', inject(function () {
            var inputValue, modelValue;
            inputValue = '5';
            modelValue = DateService.parse(inputValue);
            expect(modelValue).toBe('0000-01-05');
        }));

        it('should complete month', inject(function () {
            var inputValue, modelValue;
            inputValue = '04.5';
            modelValue = DateService.parse(inputValue);
            expect(modelValue).toBe('0000-05-04');
        }));

    });

    describe('input correction', function () {

        it('should accept only digits', inject(function () {
            var inputValue, correctedValue;
            inputValue = 'f';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('');
            inputValue = 'text';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('');
        }));

        it('should add 0 and . if first digit > 3', inject(function () {
            var inputValue, correctedValue;
            inputValue = '4';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('04.');
        }));

        it('should add 0 and if second digit is .', inject(function () {
            var inputValue, correctedValue;
            inputValue = '2.';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('02.');
        }));

        it('should add . if 2 digit provided', inject(function () {
            var inputValue, correctedValue;
            inputValue = '18';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('18.');
        }));

        it('should add 0 and . if first month digit > 1', inject(function () {
            var inputValue, correctedValue;
            inputValue = '10.2';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('10.02.');
        }));

        it('should add 0 if month has only one digit ', inject(function () {
            var inputValue, correctedValue;
            inputValue = '10.2.';
            correctedValue = DateService.correctInput(inputValue);
            expect(correctedValue).toBe('10.02.');
        }));
    });

    describe('date validation', function () {

        it('should accept only correct high days', inject(function () {
            var date;
            date = '2000-01-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-01-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-03-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-03-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-05-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-05-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-07-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-07-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-08-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-08-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-10-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-10-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-12-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-12-31';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-04-31';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-04-30';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-06-31';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-06-30';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-09-31';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-09-30';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-11-31';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-11-30';
            expect(DateService.validate(date)).toBeTruthy();

        }));

        it('should not accept 0 for days or months', inject(function () {
            var date;
            date = '2000-00-32';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2000-01-00';
            expect(DateService.validate(date)).toBeFalsy();
        }));

        it('should not accept > 12 for months', inject(function () {
            var date;
            date = '2000-13-01';
            expect(DateService.validate(date)).toBeFalsy();

        }));

        it('should only accept years from 1000 to 9999', inject(function () {
            var date;
            date = '999-01-01';
            expect(DateService.validate(date)).toBeFalsy();
            date = '1000-01-01';
            expect(DateService.validate(date)).toBeTruthy();
            date = '9999-01-01';
            expect(DateService.validate(date)).toBeTruthy();
        }));

        it('should accept only correct leap days', inject(function () {
            var date;
            date = '2000-02-29';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2000-02-28';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2001-02-28';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2001-02-29';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2008-02-29';
            expect(DateService.validate(date)).toBeTruthy();
            date = '1900-02-29';
            expect(DateService.validate(date)).toBeFalsy();
            date = '2016-02-29';
            expect(DateService.validate(date)).toBeTruthy();
            date = '2100-02-29';
            expect(DateService.validate(date)).toBeFalsy();
        }));

        it('should accept empty input', function () {
            expect(DateService.validate()).toBeTruthy();
        });
    });

    describe('date input directive', function () {

        var $scope, form;

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            var $compile, element;
            $compile = _$compile_;
            $scope = _$rootScope_;
            $scope.model = {date: ''};
            //element = angular.element("<form name='myForm'><input name='time' type='text' mobi-time-input ng-model='model.time' /></form>");
            element = angular.element("<form name='myForm'><input type='text' name='date' ng-model='model.date' mobi-date-input /></form>");
            $compile(element)($scope);
            $scope.$digest();
            form = $scope.myForm;
        }));


        it('should convert parsed viewValue correctly to modelValue', inject(function () {
            var modelValue;

            form.date.$setViewValue('5');
            $scope.$apply();
            modelValue = $scope.model.date;
            expect(modelValue).toBe('0000-01-05');

            form.date.$setViewValue('05.5');
            $scope.$apply();
            modelValue = $scope.model.date;
            expect(modelValue).toBe('0000-05-05');

            form.date.$setViewValue('05.05.2000');
            $scope.$apply();
            modelValue = $scope.model.date;
            expect(modelValue).toBe('2000-05-05');

            form.date.$setViewValue('ffff');
            $scope.$apply();
            modelValue = $scope.model.date;
            expect(modelValue).toBeUndefined();

        }));
    });

    describe('format date', function () {
        it('should add leading zeroes for month and date', function () {
            var formatted = DateService.formatDate(new Date('2000-10-10')), date;
            expect(formatted).toEqual('2000-10-10');
            date = new Date();
            date.setDate(1);
            date.setMonth(0);
            date.setFullYear(2000);
            formatted = DateService.formatDate(date);
            expect(formatted).toEqual('2000-01-01');
        });

    });

    describe('convert to date (getDateObject())', function () {
        it('should return a date object', function () {
            var date = DateService.getDateObject('2000-12-31');
            expect(date).toBeDefined();
            expect(date.getFullYear()).toBe(2000);
            expect(date.getMonth()).toBe(11); // jan: 0, feb: 1, ...
            expect(date.getDate()).toBe(31);
            // test if time part is set to 0
            expect(date.getHours()).toBe(0);
            expect(date.getMinutes()).toBe(0);
            expect(date.getSeconds()).toBe(0);
            expect(date.getMilliseconds()).toBe(0);
        });

        it('should return undefined if no date argument passed', function () {
            var date = DateService.getDateObject();
            expect(date).not.toBeDefined();

            date = DateService.getDateObject('');
            expect(date).not.toBeDefined();
        });
    });
});

