const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  treeId:{type:String,unique:true},
  name:{type:String,required:true,trim:true},
  scientificName:{type:String,default:""},
  location:{type:String,default:""},
  condition:{type:String,enum:["Healthy","Good","Moderate","Needs Attention"],required:true},
  category:{type:String,enum:["Fruit","Shade","Flowering","Medicinal","Other"],default:"Other"},
  height:{type:String,default:""},
  remarks:{type:String,default:""},
  lat:{type:Number,required:true,min:-90,max:90},
  lng:{type:Number,required:true,min:-180,max:180},
  addedBy:{type:String,default:""}
},{timestamps:true});
module.exports = mongoose.model("Tree",schema);
