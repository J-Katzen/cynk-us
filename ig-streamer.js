var stream      =   require('instagram-node').instagram(),
    recvdCount  =   0;
var redirectUri;

// Initialize Instagram API Connection
exports.initStream = function initStream() {
  
  // Set Instagram API Credentials
  stream.use({
    client_id     :   "491c67def4b64d5d939abf92e6733f30",
    client_secret :   "76d396a74a4c4e208c558a8640ec6118"
  });

  redirectUri = 'http://http://cynk-us.herokuapp.com/subscription';

  exports.getSubscriptions;
  exports.deleteAllSubscriptions;
};

// Get the subscriptions this stream has
exports.getSubscriptions = stream.subscriptions(
    function(err, subscriptions, limit) {
        if (recvdCount < 5){
            recvdCount++;
            console.log("Subscriptions Received: \n\n");
            console.log(subscriptions);
            console.log("Done with getting subscriptions\n\n\n");
        }
    }
);

// Delete the subscriptions this stream has
exports.deleteAllSubscriptions = stream.del_subscription(
    {all: true}, 
    function(err, subscriptions, limit) {
        console.log("Deleted Subscriptions");
    }
);