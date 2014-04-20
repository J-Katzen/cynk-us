var express   = require('express');
var router    = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('Root URL');
  console.log(req.ip);
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  console.log('Post to Root');
  console.log(req.ip);
});

router.get('/handleauth', function(req, res) {
  console.log("Authorization Instagram");
});

router.post('/subscription', function(req, res) {
  console.log("Post to subscription");
})

module.exports = router;
