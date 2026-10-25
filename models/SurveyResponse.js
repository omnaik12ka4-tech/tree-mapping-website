const mongoose = require("mongoose");
const schema = new mongoose.Schema({ answers:{type:[Boolean],required:true} },{timestamps:true});
module.exports = mongoose.model("SurveyResponse",schema);
