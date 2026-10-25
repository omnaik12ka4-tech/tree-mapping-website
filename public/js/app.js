const page=location.pathname.split("/").pop();
const nav=[["dashboard.html","📊","Dashboard"],["trees.html","🌿","Tree Inventory"],["map.html","🗺️","Map"],["survey.html","📋","Survey"],["about.html","ℹ️","About"]];
document.getElementById("app").innerHTML=`<div class="layout"><aside class="sidebar"><div class="brand">🌳 <span>Tree Mapping</span></div><nav class="nav">${nav.map(n=>`<a href="${n[0]}" class="${page===n[0]?"active":""}">${n[1]} <span>${n[2]}</span></a>`).join("")}</nav><a class="btn logout" href="index.html" style="display:block;text-align:center">🏠 <span>Home</span></a></aside><main class="main"><div class="topbar"><div><h1 id="pageTitle"></h1><div class="muted">Tree Mapping and Green Cover Documentation</div></div></div><div id="content"></div></main></div>`;
const API="/api";
async function api(url,options={}){options.headers={...(options.headers||{}),"Content-Type":"application/json"};const r=await fetch(API+url,options);const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.message||"Request failed");return d}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
const CONDS=["Healthy","Good","Moderate","Needs Attention"],CATS=["Fruit","Shade","Flowering","Medicinal","Other"];
const opts=a=>a.map(x=>`<option>${x}</option>`).join("");
const pill=c=>`<span class="pill c-${escapeHtml(c).replace(" ","")}">${escapeHtml(c)}</span>`;
