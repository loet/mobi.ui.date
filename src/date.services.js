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

