const router = require("express").Router();
const SurveyResponse = require("../models/SurveyResponse");

const QUESTIONS = [
  "Are you aware of the importance of trees in your locality?",
  "Do you know the names of the trees present in your locality?",
  "Do you think your locality has sufficient green spaces?",
  "Have you participated in any tree plantation activity?",
  "Do you think the number of trees in your locality has decreased in recent years?",
  "Are you aware of the environmental benefits provided by trees?",
  "Do you think trees in your locality are properly maintained?",
  "Would you support creating a digital map of trees in your locality?",
  "Would you participate in activities for protecting and maintaining local trees?",
  "Do you think digital technology can help in tree conservation and green-cover management?"
];
// Field survey results from the report (50 respondents): number of "Yes" answers per question
const BASE_YES = [45,30,20,18,32,42,28,44,40,46], BASE_TOTAL = 50;

router.get("/", async (req,res)=>{
  try{
    const extra = await SurveyResponse.find();
    const total = BASE_TOTAL + extra.length;
    res.json({ total, questions: QUESTIONS.map((question,i)=>{
      const yes = BASE_YES[i] + extra.filter(r=>r.answers[i]).length;
      return { id:i+1, question, yes, no: total-yes };
    })});
  }catch(e){res.status(500).json({message:e.message});}
});

router.post("/", async (req,res)=>{
  try{
    const a = req.body.answers;
    if(!Array.isArray(a) || a.length!==QUESTIONS.length || a.some(x=>typeof x!=="boolean"))
      return res.status(400).json({message:"Answer all 10 questions"});
    await SurveyResponse.create({answers:a});
    res.status(201).json({message:"Response saved"});
  }catch(e){res.status(500).json({message:e.message});}
});
module.exports = router;
