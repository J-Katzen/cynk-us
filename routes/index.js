var express   = require('express');
var router    = express.Router();

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

module.exports = router;
