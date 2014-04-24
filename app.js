var env                 =   process.env.NODE_ENV || 'development'
    express             =   require('express'),
    favicon             =   require('static-favicon'),
    logger              =   require('morgan'),
    mongoose            =   require('mongoose'),
    bodyParser          =   require('body-parser'),
    cookieParser        =   require('cookie-parser'),
    routes              =   require('./routes'),
    methodOverride      =   require('method-override'),
    instagramStream     =   require('./instagram-subscription-stream'),
    igStreamer          =   require('./ig-streamer'),
    http                =   require('http'),
    packageJson         =   require('./package.json'),
    path                =   require('path');

global.App = {
    app: express(),
    port: process.env.PORT || 5000,
    database: process.env.MONGOHQ_URL || 'mongodb://localhost/cynkus',
    version: packageJson.version,
    root: path.join(__dirname, '..'),
    appPath: function(path) {
        return this.root + '/' + path
    },
    require: function(path) {
        return require(this.appPath(path))
    },
    env: env,
    start: function() {
        if (!this.started) {
            mongoose.connect(this.database);
            this.started = true
            this.server = this.app.listen(this.port)
            console.log("Running App Version " + App.version + " on port " + App.port + " in " + App.env + " mode")
        }
    },
    route: function(path) {
        return this.requre('app/routes/' + path)
    }

}

// Start this thang
App.start()

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(App.server);

// Create instagram stream
instagramStream.initStream(App.server);

// SocketIO server
io.sockets.on('connection', function(socket) {
    // fill in with websocket and instagram streaming stuff
});


// App Templating Engine
App.app.set('views', __dirname + '/views');
App.app.set('view engine', 'jade');

// Set up app middleware
App.app.use(favicon());
App.app.use(bodyParser.urlencoded());
App.app.use(methodOverride());
App.app.use('/', routes);
App.app.use('/dailyfeeds', routes);
App.app.use(express.static(App.appPath('public')));

/// catch 404 and forwarding to error handler
App.app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (App.app.get('env') === 'development') {
    App.app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
App.app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = App.app;
