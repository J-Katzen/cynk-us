var express             =   require('express'),
    favicon             =   require('static-favicon'),
    logger              =   require('morgan'),
    mongoose            =   require('mongoose'),
    bodyParser          =   require('body-parser'),
    cookieParser        =   require('cookie-parser'),
    routes              =   require('./routes'),
    methodOverride      =   require('method-override'),
    instagramStream     =   require('./instagram-subscription-stream'),
    igStreamer          =   require('./ig-streamer'),
    http                =   require('http');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/cynkus');

var app             =   express();
var server          =   app.listen(process.env.PORT || 5000);
var Establishment   =   require('./models/establishment');
var DailyFeed       =   require('./models/dailyfeed');
var Message         =   require('./models/message');

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(server);

// Create instagram stream

instagramStream.initStream(server);
//instagramStream.setTestVal(99);
//console.log(instagramStream.getTestVal());

//igStreamer.initStream();

// SocketIO server
io.sockets.on('connection', function(socket) {
    // fill in with websocket and instagram streaming stuff
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(favicon());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use('/', routes);
app.use('/dailyfeeds', routes);
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