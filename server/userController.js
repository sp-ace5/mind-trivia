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

passport.serializeUser((user, cb) => {
  cb(null, {
    id: user.user_id,
    username: user.username,
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

passport.use('local', strategy);

module.exports = passport;
