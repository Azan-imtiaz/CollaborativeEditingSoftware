var express = require('express');
var router = express.Router();
var userModel = require("../models/useModel")
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const secret = "secret";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  console.log("Called")

  let { username, name, email, phone, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  let phoneCon = await userModel.findOne({ phone: phone });
  if (emailCon) {
    return res.json({ success: false, message: "email already exist" })
  }
  else if (phoneCon) {
    return res.json({ success: false, message: "Phone number already exist" })
  }
  else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;
        let user = await userModel.create({
          username: username,
          name: name,
          email: email,
          phone: phone,
          password: hash
        })
        res.json({ success: true, message: "User created successfully", userId: user._id })
      });
    });
  };

});








router.post("/login", async (req, res) => {
  let {email,password} = req.body;
  let user = await userModel.findOne({email:email});
  if(user){
    bcrypt.compare(password, user.password, function(err, result) {
      if(result){
        var token = jwt.sign({ email: user.email, userId: user._id}, secret);
        res.json({success:true,message:"Login successful",userId:user._id,token: token})
      }
      else{
        res.json({success:false,message:"Invalid password"})
      }
    });
  }
  else{
    res.json({success:false,message:"Invalid email"})
  }
})

router.post("/getUser", async (req, res) => {
  let {userId} = req.body;
  let user = await userModel.findById(userId);
  if(user){
    return res.json({success:true,message:"User fetched successfully",user:user});
  }
  else{
    return res.json({success:false,message:"Invalid user"})
  }
});

router.post("/logout", async (req, res) => {
  
  let {userId} = req.body;
  
  let user = await userModel.findById(userId);
  
  if(user){
    return res.json({success:true,message:"User logged out successfully"});
  }
  
  else{
    return res.json({success:false,message:"Invalid user"})
  }
  
})

router.post("/findUser", async (req, res) => {
  const { collaboratorEmail } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findOne({ email: collaboratorEmail });

    if (user) {
      res.status(200).send({
        success: true,
        message: "Collaborator found successfully.",
        userData: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Collaborator not found.",
      });
    }
  } catch (err) {
    console.error("Error finding collaborator:", err);
    res.status(500).send({
      success: false,
      message: "An error occurred while adding collaborator.",
    });
  }
});


router.post("/findUserWithId", async (req, res) => {
  const {  userId } = req.body;
  

  try {
    // Find the user by _id
    const user = await userModel.findById(userId);

    console.log(user)
    if (user) {
      res.status(200).send({
        success: true,
        message: "user found successfully.",
        userData: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "user not found ",
      });
    }
  } catch (err) {
    console.error("user not  found:", err);
    res.status(500).send({
      success: false,
      message: "An error occurred .",
    });
  }
});


module.exports = router;