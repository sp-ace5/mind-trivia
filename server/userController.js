const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('./userModel');

// Passport LocalStrategy
const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
// Register the strategy with passport
passport.use('local', strategy);

// Authentication middleware
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated');
    return next();
  }
  console.log('User is NOT authenticated ');
};

module.exports = { passport, checkAuthenticated };
