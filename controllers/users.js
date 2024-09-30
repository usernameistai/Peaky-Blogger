const User = require('../models/user');

module.exports.renderSignup = (req, res) => {
  res.render('users/signup');
};

module.exports.signup = async(req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({email, username});
    const regUser = await User.register(user, password);
    req.login(regUser, err => {
      if(err) return next(err);
      req.flash('success', 'Welcome to the website of Peaky Blogger');
      res.redirect('/walks');
    });
  }  catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  const { username } = req.body;
  req.flash('success', `Welcome Back ${username}!!!`);
  const redirectUrl = req.session.returnTo || '/homehub';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You logged out');
    res.redirect('/walks');
  });
}