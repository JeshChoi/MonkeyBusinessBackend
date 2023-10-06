var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
const User = require('../models/user');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const passport = require("passport");
const jwt = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// create a user 
router.post("/sign-up", asyncHandler( async (req, res, next) => {
  const username = req.body.username; 
  const password = req.body.password
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    try {
      const findDup = await User.findOne({username: username});
      if(!findDup){
        const user = new User({
          username: username,
          password: hashedPassword
        });
        const opts = {}
        const secret = process.env.JWT_SECRET_KEY //normally stored in process.env.secret
        const token = jwt.sign({ username }, secret, opts);
        const result = await user.save();
        res.json({user: result, authToken: token});
      }else{
        res.status(402).json({ error: 'Username already exists' }); // Added a response message
      }
    } catch(err) {
      return next(err);
    };
  });
  
}));

router.post('/login',  asyncHandler(async (req, res, next) => {
  const username = req.body.username; 
  const password = req.body.password;
  try{
    console.log('username:', username, ' password:', password)
    const the_user = await User.findOne({username: username});
    console.log(the_user)
    if(the_user !== null){
      const match = await bcrypt.compare(password, the_user.password);
      if (!match) {
        // passwords do not match!
        return res.status(401).json({ message: "Incorrect password" }); // Modified this line
      }else{ 
        // send back token 
        const opts = {}
            const secret = process.env.JWT_SECRET_KEY //normally stored in process.env.secret
            const token = jwt.sign({ username }, secret, opts);
            return res.json({user: the_user, authToken: token});
      }
    }else{
      // username does not exist
      res.status(402).json({ error: 'Username does not exists' }); // Added a response message
    }
  }catch(err){
    return next(err);
  }
}));

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});





module.exports = router;
