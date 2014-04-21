// Variable dependencies/declarations
var Establishment = require('./models/establishment');
var DailyFeed = require('./models/dailyfeed');
var Message = require('./models/message');
var InstagramStream = require('instagram-realtime');
var stream;
var test = 0;

/* Test Functions */
exports.setTestVal = function setTestVal(value) {
    test = value;
}

exports.getTestVal = function getTestVal() {
    return test;
}

// Check List of Subscriptions this Instagram Stream has registered
function checkSubscriptionList() {
    console.log("Check Subscription List...");
}

// Parse/Persist Instagram Message Payload
function handleStreamingMessages(jsonData) {
    // TODO: Add JK's method here
}

// Set The triggers for the stream
function setStreamTriggers() {
    stream.on('new', function(response, body) {
        var jsonBody = JSON.parse(body);
        var jsonData = jsonBody.data;
        console.log(jsonData);
        console.log('processing new media...: ' + String(jsonData.length));
        handleStreamingMessages(jsonData);
        console.log('parsed. :O!');
    });

    stream.on('new/error', function(response, body) {
        console.log("New Media Error");
    });

    stream.on('subscribe', function(response, body) {
        console.log("Subscribed on Instagram");
    });

    stream.on('subscribe/error', function (error, response, body) {
        console.log("Error while subscribing: " + body);
    });

    stream.on('unsubscribe', function(response, body) {
        console.log("Unsubscribed, so resubscribe");
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
    stream.subscribe({ tag: 'goodnight' });
    console.log(test);
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