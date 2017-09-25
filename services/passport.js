const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//create local Strategy
const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy( localOptions, function(email, password, done){
  //verify email and password
  User.findOne({email: email}, function(err, user){
    if(err){ return done(err); }
    if(!user) { return done(null, false); }

    //compare password
    user.comparePassword(password, function(err, isMatch){
      if(err){ return done(err) }
      if(!isMatch){
        return done(null, false);
      }
      return done(null, user);
    })
  })
})

//setup jwt stragegy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

//create jwt stragegy

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //see if the user id in the payload exists in the database. Call done with that object
  User.findById(payload.sub, function(err, user){
    if(err) {return done(err, false);}
    if(user){
      done(null, user);
    } else{
      done(null, false);
    }
  })
});

passport.use(jwtLogin);
passport.use(localLogin);
