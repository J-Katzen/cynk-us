var express   = require('express');
var router    = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('Root URL');
  console.log(res);
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  console.log('Post to Root');
  console.log(req);
  consolel.lof('Response is: ')
  console.log(res);
});

router.get('/handleauth', function(req, res) {
  console.log("Authorization Instagram");
});

module.exports = router;
