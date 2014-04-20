var express         =   require('express'),
    favicon         =   require('static-favicon'),
    logger          =   require('morgan'),
    mongoose        =   require('mongoose'),
    bodyParser      =   require('body-parser'),
    cookieParser    =   require('cookie-parser'),
    routes          =   require('./routes'),
    methodOverride  =   require('method-override'),
    InstagramStream =   require('instagram-realtime'),
    http            =   require('http');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/cynkus');

var app     =   express();
var server  =   app.listen(process.env.PORT || 5000);
var Establishment = require('./models/establishment');
var DailyFeed = require('./models/dailyfeed');
var Message = require('./models/message');
var InstagramStream = require('instagram-realtime');

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(server);

console.log('Process Env:' + process.env);

// Create instagram stream
var stream = InstagramStream(
  server,
  {
    client_id     : "491c67def4b64d5d939abf92e6733f30",
    client_secret : "76d396a74a4c4e208c558a8640ec6118",
    url           : 'http://cynk-us.herokuapp.com',
    callback_path : '/'
  }
);

stream.on('new', function(response, body) {
    console.log("New Media");
    // TODO: Parse body
    // TODO: Add records to model 
});

stream.on('new/error', function(response, body) {
    console.log("New Media Error");
})

stream.on('subscribe', function(response, body) {
    console.log("Subscribed on Instagram");
});

stream.on('subscribe/error', function (error, response, body) {
    console.log("Error" + body);
});

stream.on('unsubscribe', function(response, body) {
    console.log("Unsubscribed, so resubscribe");
    stream.subscribe({ 
        lat: 37.760, 
        lng: -122.43953,
        radius: 5000
    });    
})

stream.subscribe({ 
    lat: 37.760, 
    lng: -122.43953,
    radius: 5000
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(favicon());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use('/', routes);
app.use('/handleauth', routes)
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


// SocketIO server
io.sockets.on('connection', function(socket) {
    // fill in with websocket and instagram streaming stuff
});


module.exports = app;

console.log("Kwaku server listening on port 5000");