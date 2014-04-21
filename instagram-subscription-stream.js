// Variable dependencies/declarations
var Establishment       = require('./models/establishment');
var DailyFeed           = require('./models/dailyfeed');
var Message             = require('./models/message');
var InstagramStream     = require('instagram-realtime');

var async   =   require('async');
var test    =   0;
var stream;

var hsm = function handleStreamingMessages(jsonData){
    var today = new Date(),
        feedQuery = null,
        todayfeed = null;
    today.setHours(6,0,0,0);
    if(today > new Date()){
        feedQuery = DailyFeed.findOne({'created': {"$gte": new Date(today.getTime() - (24 * 60 * 60 * 1000)), "$lt": today} });
    } else {
        feedQuery = DailyFeed.findOne({'created': {'$gte': today, '$lt': new Date(today.getTime() + (24 * 60 * 60 * 1000))} });
    }
    async.series([
        function(callback){
            feedQuery.exec(function(err, feed){
                if(err) {
                    console.log(err);
                    callback();
                }
                if(!feed){
                    var newFeed = new DailyFeed({messages: [], created: Date.now() });
                    newFeed.save(function(err, fd){
                        console.log(fd);
                        todayfeed = fd.id;
                    });
                } else {
                    console.log(feed);
                    todayfeed = feed.id;
                }
                callback();
            });
        },
        function(callback){
            var est = null;
            jsonData.forEach(function(media){
                est = null;
                async.series([
                    function(callback){
                        if(media.location && media.location.id){
                            var estQuery = Establishment.findOne({'instagramId': media.location.id });
                            estQuery.exec(function(err,establishment){
                                if(err) {
                                    console.log(err);
                                    callback();
                                }
                                    // return handleError(err);
                                if(!establishment){
                                    var newEst = new Establishment({name: media.location.name, instagramId: media.location.id, latitude: media.location.latitude, longitude: media.location.longitude});
                                    newEst.save(function(err,establ){
                                        est = establ.id;
                                        console.log(est);
                                    });
                                } else {
                                    est = establishment.id;
                                    console.log(est);
                                }
                            });
                        }
                        callback();
                    },
                    function(callback){
                        var msgQuery = Message.findOne({'instagramid': media.id});
                        msgQuery.exec(function(err, msg){
                            if(err) {
                                console.log(err);
                                callback();
                            } 
                                // return handleError(err);
                            if(!msg){
                                var newMsg = new Message({
                                created: (media.created_time * 1000),
                                userpic: media.user.profile_picture,
                                hashtags: media.tags,
                                userInstaId: media.user.id,
                                username: media.user.username,
                                type: media.type,
                                link: media.link,
                                standard: media.images.standard_resolution.url,
                                thumb: media.images.thumbnail.url,
                                instagramId: media.id
                                });
                                if(todayfeed)
                                    newMsg.set('dailyFeed', todayfeed);
                                if(media.location){
                                    console.log(media.location);
                                    newMsg.set('geoloc', {longitude: media.location.longitude, latitude: media.location.latitude});
                                }
                                if(est)
                                    newMsg.set('establishment', est);
                                if(media.caption !== null)
                                    newMsg.set('message', media.caption.text);
                                newMsg.save(function(err,savedMsg){
                                    if(err) {
                                        console.log(err);
                                        Message.update({instagramId: media.id}, {standard: media.images.standard_resolution.url, thumb: media.images.thumbnail.url}).exec();
                                        callback();
                                    } 
                                        // return handleError(err);
                                    console.log(savedMsg);
                                });
                            } else {
                                console.log('updates');
                                Message.update({instagramId: media.id}, {standard: media.images.standard_resolution.url, thumb: media.images.thumbnail.url}).exec();
                            }
                            callback();
                        });
                    }
                ],
                function(err, results){
                });
            });
        }
    ],
    function(err,results){
    });
    return 'hm';
};

// Check List of Subscriptions this Instagram Stream has registered
function checkSubscriptionList() {
    console.log("Check Subscription List...");
}

// Set The triggers for the stream
function setStreamTriggers() {
    stream.on('new', function(response, body) {
        var jsonBody = JSON.parse(body);
        var jsonData = jsonBody.data;
        var tst = null;
        console.log('processing new media...: ' + String(jsonData.length));
        tst = hsm(jsonData);
    });

    stream.on('new/error', function(response, body) {
        console.log("New Media Error");
        console.log(body);
    });

    stream.on('subscribe', function(response, body) {
        console.log('Subscribed');
    });

    stream.on('subscribe/error', function (error, response, body) {
        console.log("Error: " + body);
        console.log("Error response: " + response);
    });

    stream.on('unsubscribe', function(response, body) {
        console.log("Unsubscribed!");
    });

    stream.on('unsubscribe/error', function (error, response, body) {
        console.log('Unsubscribe error: ' + error);
    });
}

// Initialize the subscriptions for this stream
function initSubscriptions(test) {

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
    stream.subscribe({ location : 1333 }); // Smuggler's Cove
    stream.subscribe({ location : 82756577 }); // Smuggler's Cove
    stream.subscribe({ location : 5882549 }); // The Ice Cream Bar
    stream.subscribe({ location : 118516 }); // The Boardroom
    stream.subscribe({ location : 11945887 }); // Board Room
    stream.subscribe({ location : 365453 }); // Curly's Coffee Shop
    stream.subscribe({ location : 795950 }); // Patxi's chicago pizza
    stream.subscribe({ location : 1397980572 }); // Silver Cloud

    stream.subscribe({ tag: 'sfnight' });
    stream.subscribe({ tag: 'sanfrancisco'});
    //stream.subscribe({ tag: 'goodnight' });
    console.log(test);
};

// Test Functions
exports.setTestVal = function setTestVal(value) {
    test = value;
};

exports.getTestVal = function getTestVal() {
    return test;
};

// Initialize an Instagram Stream for the specified server
exports.initStream = function(server) {
    // Setup Instagram Stream
    console.log(test);
    stream = InstagramStream(
        server,
        {
            client_id       : "491c67def4b64d5d939abf92e6733f30",
            client_secret   : "76d396a74a4c4e208c558a8640ec6118",
            url             : 'http://cynk-us.herokuapp.com',
            callback_path   : "subscription"
        }
    );
    setStreamTriggers(stream);
    checkSubscriptionList();
    initSubscriptions(test);
    console.log("done initializing screen");
};