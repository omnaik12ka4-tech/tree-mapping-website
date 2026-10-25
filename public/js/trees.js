document.getElementById("pageTitle").textContent="Tree Inventory";
const $=s=>document.querySelector(s);
let trees=[];
$("#content").innerHTML=`
<div class="toolbar"><input class="grow" id="q" type="search" placeholder="Search name, location or ID"><select id="fc"><option value="">All conditions</option>${opts(CONDS)}</select><select id="fk"><option value="">All categories</option>${opts(CATS)}</select><button class="btn primary" id="add">+ Add tree</button></div>
<div class="section"><div class="table-wrap"><table class="table"><thead><tr><th>ID</th><th>Tree</th><th>Location</th><th>Condition</th><th>Category</th><th>Height</th><th>Added by</th><th></th></tr></thead><tbody id="rows"></tbody></table></div></div><div id="modal"></div>`;

async function load(){
  const p=new URLSearchParams({q:$("#q").value,condition:$("#fc").value,category:$("#fk").value});
  trees=await api("/trees?"+p);
  $("#rows").innerHTML=trees.map(t=>`<tr><td>${escapeHtml(t.treeId)}</td><td>${escapeHtml(t.name)}<br><small class="muted"><i>${escapeHtml(t.scientificName)}</i></small></td><td>${escapeHtml(t.location)}</td><td>${pill(t.condition)}</td><td>${escapeHtml(t.category)}</td><td>${escapeHtml(t.height)}</td><td>${escapeHtml(t.addedBy)}</td><td class="actions"><button class="btn ghost" data-e="${t._id}">Edit</button><button class="btn danger" data-d="${t._id}">Delete</button></td></tr>`).join("")||'<tr><td colspan="8" class="empty">No trees match. Clear the filters or add a tree.</td></tr>';
}
function openForm(t){
  const v=t||{};
  $("#modal").innerHTML=`<div class="modal"><div class="modal-box"><div class="modal-head"><h2>${t?"Edit":"Add"} tree</h2><button class="close" id="x" aria-label="Close">×</button></div>
  <form id="f"><div class="form-grid">
  <label>Tree name<input name="name" required value="${escapeHtml(v.name)}"></label>
  <label>Scientific name<input name="scientificName" value="${escapeHtml(v.scientificName)}"></label>
  <label>Location<input name="location" value="${escapeHtml(v.location)}"></label>
  <label>Approx. height<input name="height" placeholder="15 ft" value="${escapeHtml(v.height)}"></label>
  <label>Condition<select name="condition">${opts(CONDS)}</select></label>
  <label>Category<select name="category">${opts(CATS)}</select></label>
  <label>Latitude<input name="lat" required inputmode="decimal" value="${v.lat??""}"></label>
  <label>Longitude<input name="lng" required inputmode="decimal" value="${v.lng??""}"></label></div>
  <label>Remarks<input name="remarks" value="${escapeHtml(v.remarks)}"></label>
  <div class="actions"><button class="btn primary">Save tree</button><button type="button" class="btn ghost" id="gps">Use my location</button></div><div class="msg" id="fm"></div></form></div></div>`;
  const f=$("#f"); if(t){f.condition.value=t.condition;f.category.value=t.category}
  $("#x").onclick=()=>$("#modal").innerHTML="";
  $("#gps").onclick=()=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>{f.lat.value=p.coords.latitude.toFixed(6);f.lng.value=p.coords.longitude.toFixed(6)},()=>$("#fm").textContent="Could not read your location. Allow access or type the coordinates."):$("#fm").textContent="Location is not available in this browser.";
  f.onsubmit=async e=>{e.preventDefault();try{
    await api(t?"/trees/"+t._id:"/trees",{method:t?"PUT":"POST",body:JSON.stringify(Object.fromEntries(new FormData(f)))});
    $("#modal").innerHTML="";load();}catch(x){$("#fm").textContent=x.message}};
}
$("#add").onclick=()=>openForm();
$("#rows").onclick=async e=>{
  const ed=e.target.closest("[data-e]"),del=e.target.closest("[data-d]");
  if(ed)openForm(trees.find(t=>t._id===ed.dataset.e));
  if(del&&confirm("Delete this tree?")){await api("/trees/"+del.dataset.d,{method:"DELETE"});load()}
};
let tm;$("#q").oninput=()=>{clearTimeout(tm);tm=setTimeout(load,250)};$("#fc").onchange=load;$("#fk").onchange=load;
load();
