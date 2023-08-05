const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./userModel');

// Passport LocalStrategy
const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    // Find the user by username in the database
    const user = await User.findOne({ where: { username } });

    // If user not found or password doesn't match, return error message
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    // Return the user if authentication is successful
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

// Passport serialization and deserialization of user
passport.serializeUser((user, done) => {
  done(null, user.user_id); // Use the appropriate property for serialization
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Initialize Passport with the LocalStrategy
passport.use('local', strategy);

module.exports = passport;
