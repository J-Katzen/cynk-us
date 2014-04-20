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
    callback_path : 'subscription'
  }
);

// Subscribe to some things
stream.subscribe({ location : 214139311 });
stream.subscribe({ location : 258180411 });
stream.subscribe({ location : 13216121 });
stream.subscribe({ location : 47125 });
stream.subscribe({ location : 7908534 });
stream.subscribe({ location : 5616777 });
stream.subscribe({ location : 75697550 });
stream.subscribe({ location : 1438 });
stream.subscribe({ location : 213863948 });
stream.subscribe({ location : 215620527 });

//stream.subscribe({ location : 214139311 });
//stream.subscribe({ location : 258180411 });
//stream.subscribe({ location : 13216121 });
//stream.subscribe({ location : 47125 });
//stream.subscribe({ location : 7908534 });
//stream.subscribe({ location : 5616777 });
//stream.subscribe({ location : 75697550 });
//stream.subscribe({ location : 1438 });
//stream.subscribe({ location : 213863948 });
//stream.subscribe({ location : 215620527 });

//stream.subscribe({ tag: 'blahblah' });
stream.subscribe({ tag: 'sfnight' });

//stream.subscribe({ tag: 'yoo' });

// Subscribe to SF Geography (max radius)
stream.subscribe({ 
    lat: 37.760, 
    lng: -122.43953,
    radius: 5000
});

stream.on('new', function(response, body) {
    var jsonBody = JSON.parse(body);
    var jsonData = jsonBody.data;
    console.log(jsonData);
    console.log('processing new media...: ' + String(jsonData.length));
    jsonData.forEach(function(media){
        if(media.type === "image"){
            var est = null,
                message = null,
                todayFeed = null,
                messageQuery = null,
                feedQuery = null,
                today = new Date();

            if(media.location && media.location.id){
                var estQuery = Establishment.findOne({'instagramId': media.location.id });
                estQuery.exec(function(err, establishment){
                    if(err) return handleError(err);
                    if(!establishment){
                        var newEst = new Establishment({name: media.location.name, instagramId: media.location.id, latitude: media.location.latitude, longitude: media.location.longitude});
                        newEst.save();
                        est = newEst;
                    } else {
                        est = establishment;
                    }
                });
            }
            today.setHours(6,0,0,0);
            feedQuery = DailyFeed.findOne({'created': {"$gte": today, "$lt": new Date(today.getTime() + (24 * 60 * 60 * 1000))} });
            feedQuery.exec(function(err, feed){
                if(err) return handleError(err);
                if(!feed){
                    var newFeed = new DailyFeed({messages: [], created: Date.now() });
                    newFeed.save();
                    todayFeed = newFeed;
                } else {
                    todayFeed = feed;
                }
            });

            messageQuery = Message.findOne({'instagramId': media.id});
            messageQuery.exec(function(err, msg){
                if(err) return handleError(err);
                if(!msg){
                    var newMsg = new Message({
                        dailyFeed: todayFeed.id,
                        created: Date.now(),
                        userpic: media.user.profile_picture,
                        hashtags: media.tags,
                        userInstaId: media.user.id,
                        username: media.user.username,
                        type: media.type,
                        link: media.link,
                        standard: media.images.standard_resolution,
                        thumb: media.images.thumbnail,
                        instagramId: media.id,
                        geoloc: {
                            longitude: media.location.longitude,
                            latitude: media.location.latitude
                        }
                    });
                    if(est !== null)
                        newMsg.set('establishment', est.id);
                    if(media.caption !== null)
                        newMsg.set('message', media.caption.text);
                    newMsg.save();
                    message = newMsg;
                } else {
                    message = msg;
                }
            });
        }
    });
    
});

stream.on('new/error', function(response, body) {
    console.log("New Media Error");
});

stream.on('subscribe', function(response, body) {
    console.log("Subscribed on Instagram");
});

stream.on('subscribe/error', function (error, response, body) {
    console.log("Error" + body);
});

stream.on('unsubscribe', function(response, body) {
    console.log("Unsubscribed, so resubscribe");
    stream.subscribe({ location : 214139311 });
    stream.subscribe({ location : 258180411 });
    stream.subscribe({ location : 13216121 });
    stream.subscribe({ location : 47125 });
    stream.subscribe({ location : 7908534 });
    stream.subscribe({ location : 5616777 });
    stream.subscribe({ 
        lat: 37.760, 
        lng: -122.43953,
        radius: 5000
    });    
})


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

module.exports = app;

console.log("Kwaku server listening on port 5000");