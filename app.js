var express         =   require('express'),
    favicon         =   require('static-favicon'),
    logger          =   require('morgan'),
    mongoose        =   require('mongoose'),
    bodyParser      =   require('body-parser'),
    cookieParser    =   require('cookie-parser'),
    routes          =   require('./routes'),
    methodOverride  =   require('method-override'),
    http            =   require('http');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/cynkus');

var app     =   express();
var server  =   app.listen(process.env.PORT || 5000);
var Establishment = require('./models/establishment');
var DailyFeed = require('./models/dailyfeed');
var Message = require('./models/message');

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(server);

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(logger('dev'));
    app.use(favicon());
    app.use(express.static(__dirname + '/public'));
    app.use(urlencoded());
    app.use(methodOverride());
});

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

function instagramListener(){

};


// SocketIO server
io.sockets.on('connection', function(socket) {
    socket.on('picture:new', function(order) {
        console.log(order);
        var nimage = new ({stripe: order.stripe_id,
                              name: order.name,
                              note: order.note});
        nord.save();
        console.log(nord);
        socket.broadcast.emit('order:new', nord);
    });

    socket.on('order:update', function(order) {
        console.log(order);
        socket.broadcast.emit('order:update', order);
    });

    // socket.on('disconnect', function() {
    //     socket.broadcast.to(socket.room).emit('blitz:chatmsg',
    //         {msg: socket.user_name + ' has disconnected!'});
    //     socket.leave(socket.room);
    // });

});


module.exports = app;

console.log("Kwaku server listening on port 5000");