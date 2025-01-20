var mongoose = require('mongoose');

mongoose.connect("mongodb+srv://azanimtiaz43:ZeEyht53u87EjMhq@cluster0.vfvefyj.mongodb.net/CollaborativeEditingSystem", {
  
}).then(()=>{
console.log("database connected");
}).catch((err)=>{
  console.log("database not connected");
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    username: String,
    isBlocked: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);
