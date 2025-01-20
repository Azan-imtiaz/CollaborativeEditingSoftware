const mongoose = require('mongoose');



// mongoose.connect("mongodb://127.0.0.1:27017/cscProjectDatabase", {


mongoose.connect("mongodb+srv://azanimtiaz43:ZeEyht53u87EjMhq@cluster0.vfvefyj.mongodb.net/CollaborativeEditingSystem", {

}).then(()=>{
console.log("database connected");
}).catch((err)=>{
  console.log("database not connected");
})





// const docSchema = mongoose.Schema({
//   title: String,
//   content: {
//     type: String,
//     default: ""
//   },

  
//   date: {
//     type: Date,
//     default: Date.now
//   },
//   lastUpdate: {
//     type: Date,
//     default: Date.now
//   }
// });






const docSchema = mongoose.Schema({
  title: String,
  content: {
    type: String,
    default: ""
  },
  collaborators: [
    {
      type: String, // Store the email as a string
      required: true,
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  lastUpdatedBy:String,
  previousContent: {
    type: String,
    default: ""
  }
  
});
module.exports = mongoose.model('Document', docSchema);