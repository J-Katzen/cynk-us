require('./app')

// Start this thang
App.start();

// Load our custom Instagram Stream Modules
var instagramStream     =   App.util('instagram-subscription-stream');
var igStreamer          =   App.util('ig-streamer');

// Tells socket.io to user our express server
var io      =   require('socket.io').listen(App.server);

// Create instagram stream
instagramStream.initStream(App.server);

// SocketIO server
io.sockets.on('connection', function(socket) {
    // fill in with websocket and instagram streaming stuff
});
