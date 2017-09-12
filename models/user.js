const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt =  require('bcrypt-nodejs');

//Define model
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

//password encryption. is executed before saving the model

userSchema.pre('save', function(next){
  const user = this;//get an instance of the model
  bcrypt.genSalt(10, function(err, salt){
    if(err) {return next(err)}

    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err){return next(err)}

      user.password = hash
      next()
    });
  });
});

//create model class
const ModelClass = mongoose.model('user', userSchema);

//export the model
module.exports = ModelClass