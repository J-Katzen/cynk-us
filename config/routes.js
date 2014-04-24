module.exports = function(app) {
  homeRoutes = App.route('homeRoutes');

  app.use('/', homeRoutes.home);
}