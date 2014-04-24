exports.home = function home(req, res) {
  res.sendfile('../../public/index.html');
}