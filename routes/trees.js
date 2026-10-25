const router = require("express").Router();
const Tree = require("../models/Tree");

const FIELDS = ["name","scientificName","location","condition","category","height","remarks","lat","lng"];
const pick = (b) => FIELDS.reduce((o,k)=> (b[k]!==undefined ? (o[k]=typeof b[k]==="string"?b[k].trim():b[k],o) : o), {});

router.get("/", async (req,res)=>{
  try{
    const {q="",condition="",category=""} = req.query;
    const f = {};
    if(condition) f.condition = condition;
    if(category) f.category = category;
    if(q){ const r = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i"); f.$or=[{name:r},{scientificName:r},{location:r},{treeId:r}]; }
    res.json(await Tree.find(f).sort({treeId:1}));
  }catch(e){res.status(500).json({message:e.message});}
});

router.get("/stats", async (req,res)=>{
  try{
    const all = await Tree.find().sort({createdAt:-1});
    const count = (k)=>all.reduce((o,t)=>(o[t[k]]=(o[t[k]]||0)+1,o),{});
    res.json({
      total: all.length,
      species: new Set(all.map(t=>t.name.toLowerCase())).size,
      byCondition: count("condition"), byCategory: count("category"),
      recent: all.slice(0,5)
    });
  }catch(e){res.status(500).json({message:e.message});}
});

router.post("/", async (req,res)=>{
  try{
    const d = pick(req.body);
    if(!d.name) return res.status(400).json({message:"Tree name is required"});
    d.lat = Number(d.lat); d.lng = Number(d.lng);
    if(!isFinite(d.lat)||!isFinite(d.lng)) return res.status(400).json({message:"Enter valid latitude and longitude"});
    const last = await Tree.findOne().sort({treeId:-1});
    const n = last ? parseInt(last.treeId.slice(1),10)+1 : 1;
    d.treeId = "T"+String(n).padStart(3,"0");
    d.addedBy = (req.body.addedBy || "Team").toString().slice(0,40);
    res.status(201).json(await Tree.create(d));
  }catch(e){res.status(400).json({message:e.message});}
});

router.put("/:id", async (req,res)=>{
  try{
    const t = await Tree.findByIdAndUpdate(req.params.id, pick(req.body), {new:true,runValidators:true});
    if(!t) return res.status(404).json({message:"Tree not found"});
    res.json(t);
  }catch(e){res.status(400).json({message:e.message});}
});

router.delete("/:id", async (req,res)=>{
  try{
    const t = await Tree.findByIdAndDelete(req.params.id);
    if(!t) return res.status(404).json({message:"Tree not found"});
    res.json({message:"Deleted"});
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports = router;
