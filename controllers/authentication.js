const User = require('../models/user');
const config = require('../config');
const jwt = require('jwt-simple');


function tokenForUser(user){
  const timeStamp = new Date().getTime()
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signup = function(req, res, next){

  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password){
    return res.status(422).send({error: "You must enter the username and password"})
  }

  User.findOne({ email: email}, function(err, existingUser){
      if(err) {return next(err)}

      if(existingUser){
        return res.status(422).send({error: "Email is in use"})
      }

      const user = new User({
        email: email,
        password: password
      });

      user.save(function(err){
        if(err) {return next(err);}

        res.send({token: tokenForUser(user)})
      })
  });
}
