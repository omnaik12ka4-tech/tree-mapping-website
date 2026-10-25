require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Tree = require("./models/Tree");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/trees", require("./routes/trees"));
app.use("/api/survey", require("./routes/survey"));
app.get("/api/health", (req,res)=>res.json({ok:true, message:"Tree Mapping API running"}));
app.get("*", (req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

// Starter records from the field visit (26/09/2026). Verify species before submitting.
const SEED = [
  {treeId:"T001",name:"Broad-leaf tree (verify species)",location:"Near compound wall",condition:"Healthy",category:"Shade",lat:19.447031,lng:73.319818,remarks:"Photographed 26/09/2026"},
  {treeId:"T002",name:"Mango",scientificName:"Mangifera indica",location:"Fenced plot",condition:"Good",category:"Fruit",lat:19.446948,lng:73.319804,remarks:"Photographed 26/09/2026; confirm species"},
  {treeId:"T003",name:"Areca palm",scientificName:"Areca catechu",location:"Beside residential building",condition:"Healthy",category:"Other",lat:19.44703,lng:73.319823,remarks:"Photographed 26/09/2026; confirm species"},
  {treeId:"T004",name:"Leafy shrub (verify species)",location:"Wall corner",condition:"Healthy",category:"Other",lat:19.44704,lng:73.319812,remarks:"Photographed 26/09/2026"}
];

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tree_mapping")
  .then(async()=>{
    if(!(await Tree.countDocuments())) await Tree.insertMany(SEED.map(t=>({...t,addedBy:"Field survey"})));
    app.listen(PORT, ()=>console.log(`Server running: http://localhost:${PORT}`));
  })
  .catch(err=>{ console.error("MongoDB connection failed:", err.message); process.exit(1); });
