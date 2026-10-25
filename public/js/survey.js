document.getElementById("pageTitle").textContent="Community Survey";
async function load(){
  const d=await api("/survey");
  document.getElementById("content").innerHTML=`
  <div class="section"><h2>Results</h2><p class="muted">${d.total} residents answered. Bars show the share who said Yes.</p>
  ${d.questions.map(q=>{const p=Math.round(q.yes/d.total*100);return `<div class="bar"><p>Q${q.id}. ${escapeHtml(q.question)} <b>${p}%</b> <small class="muted">(Yes ${q.yes}, No ${q.no})</small></p><div class="track"><span style="width:${p}%"></span></div></div>`}).join("")}</div>
  <div class="section" style="margin-top:20px"><h2>Add a response</h2><form id="sf">
  ${d.questions.map((q,i)=>`<div class="q"><label for="a${i}">Q${q.id}. ${escapeHtml(q.question)}</label><select id="a${i}"><option value="">Choose</option><option value="1">Yes</option><option value="0">No</option></select></div>`).join("")}
  <br><button class="btn primary">Submit response</button><div id="sm" class="msg"></div></form></div>`;
  document.getElementById("sf").onsubmit=async e=>{e.preventDefault();
    const a=d.questions.map((_,i)=>document.getElementById("a"+i).value);
    const sm=document.getElementById("sm");
    if(a.includes("")){sm.textContent="Answer all 10 questions.";return}
    try{await api("/survey",{method:"POST",body:JSON.stringify({answers:a.map(x=>x==="1")})});load()}catch(x){sm.textContent=x.message}};
}
load().catch(e=>document.getElementById("content").innerHTML=`<div class="section msg">${escapeHtml(e.message)}</div>`);
