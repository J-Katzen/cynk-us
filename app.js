var express         =   require('express'),
    favicon         =   require('static-favicon'),
    logger          =   require('morgan'),
    bodyParser      =   require('body-parser'),
    cookieParser    =   require('cookie-parser'),
    routes          =   require('./routes'),
    methodOverride  =   require('method-override'),
    http            =   require('http');

var app     =   express();
var server  =   app.listen(process.env.PORT || 5000);

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(server);

function helloF(req, res, next) {
    console.log("Here!!");
    next();
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(cookieParser());
app.use('/', routes);
app.use(express.static(__dirname + '/public'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

console.log("Kwaku server listening on port 5000");