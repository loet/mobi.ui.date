module.exports.config = {

    src4concat: [
        'tmp/*.js', '!tmp/**/*.spec.js'
    ],

    bower_components: [
        'bower_components/momentjs/min/moment.min.js',
        'bower_components/momentjs/lang/de.js',
        'bower_components/momentjs/lang/fr.js',
        'bower_components/momentjs/lang/it.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/mobi.ui.momentadapter/dist/mobi.ui.momentadapter.js',
        'bower_components/mobi.ui.settings/dist/mobi.ui.settings.js',
        'bower_components/mobi.ui.guid/dist/mobi.ui.guid.js',
        'bower_components/mobi.ui.model/dist/mobi.ui.model.js'
    ]
}
;
