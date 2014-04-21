var express   = require('express');
var router    = express.Router();

router.param('user_id', function(req, res, next, id) {
  req.user = {
    id: id,
    name: 'Kwaku Farkye'
  };
  next();
});

// Set Param for establishment route
router.param('establishment_id', function(req, res, next, id) {
  var est = Establishment.findOne({'instagramId': media.location.id });
  est.exec(function(err, establishment) {
    if (err) {
      return next(err);
    }
    else if (!establishment) {
      return next(new Error('failed to load establishment'));
    }
    else {
      req.establishment = establishment;
      next();
    }
  });
});

// Set param for daily feed
router.param('daily_feed_id', function(req, res, next, id) {
  var feed = DailyFeed.findById(id, function(err, dailyFeed) {

  });

});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('./public/index.html');
  // res.render('index', { title: 'Express' });

});

router.post('/', function(req, res) {
  console.log('Post to Root');
  console.log(req.ip);
});


router.get('/establishments/:establishment_id', function(req, res, next) {
  console.log("Get data about this establishment");
});

router.route('/dailyfeeds/:daily_feed_id')
.all(function(req, res, next) {
  console.log("Runs for all http verbs");
  next(); 
})
.get(function(req, res, next) {
  console.log('Feed: ' + req);
  console.log("Daily Feed get route");
  res.json(req.user);
})

module.exports = router;
